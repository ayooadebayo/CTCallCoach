// Wrap-up routes
//
// POST /wrapup        — save outcome + case note; closes the session
// GET  /wrapup/:id    — get the saved outcome and case note for a session
//
// Body for POST: { call_session_id, primary_outcome_code, owner_next_step,
//                 case_note_text, disposition? }

import type { FastifyInstance } from 'fastify';
import { db } from '../db/client.js';
import { closeSession } from '../modules/sessions/service.js';

// Valid primary_outcome_code values (mirrors Prisma enum).
const PRIMARY_OUTCOME_CODES = [
  'info_only',
  'support_signposted',
  'specialist_review_referred',
  'debt_advice_signposted',
  'vulnerability_flag_raised',
  'callback_required',
  'pending_further_evidence',
  'redirected',
] as const;

type PrimaryOutcomeCode = (typeof PRIMARY_OUTCOME_CODES)[number];

function isValidOutcomeCode(v: unknown): v is PrimaryOutcomeCode {
  return typeof v === 'string' && (PRIMARY_OUTCOME_CODES as readonly string[]).includes(v);
}

export async function wrapupRoute(app: FastifyInstance): Promise<void> {
  // ── POST /wrapup ────────────────────────────────────────────────────────────
  app.post<{
    Body: {
      call_session_id?: string;
      primary_outcome_code?: string;
      owner_next_step?: string;
      case_note_text?: string;
      disposition?: string;
    };
  }>('/wrapup', async (req, reply) => {
    const { call_session_id, primary_outcome_code, owner_next_step, case_note_text } =
      req.body ?? {};

    if (!call_session_id || typeof call_session_id !== 'string') {
      return reply.code(400).send({ error: '"call_session_id" is required' });
    }
    if (!isValidOutcomeCode(primary_outcome_code)) {
      return reply.code(400).send({ error: '"primary_outcome_code" is invalid or missing' });
    }
    if (!owner_next_step || typeof owner_next_step !== 'string') {
      return reply.code(400).send({ error: '"owner_next_step" is required' });
    }
    if (!case_note_text || typeof case_note_text !== 'string') {
      return reply.code(400).send({ error: '"case_note_text" is required' });
    }

    const disposition = req.body.disposition ?? 'completed';

    // Upsert outcome (session has at most one).
    const existingOutcome = await db.callOutcome.findUnique({
      where: { call_session_id },
      select: { id: true },
    });

    const outcome = existingOutcome
      ? await db.callOutcome.update({
          where: { call_session_id },
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            primary_outcome_code: primary_outcome_code as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            disposition: disposition as any,
            owner_next_step,
          },
          select: { id: true, primary_outcome_code: true },
        })
      : await db.callOutcome.create({
          data: {
            call_session_id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            primary_outcome_code: primary_outcome_code as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            disposition: disposition as any,
            owner_next_step,
          },
          select: { id: true, primary_outcome_code: true },
        });

    // Upsert case note.
    const existingNote = await db.caseNote.findUnique({
      where: { call_session_id },
      select: { id: true },
    });

    const note = existingNote
      ? await db.caseNote.update({
          where: { call_session_id },
          data: {
            summary_text: case_note_text,
            status: 'accepted',
          },
          select: { id: true },
        })
      : await db.caseNote.create({
          data: {
            call_session_id,
            summary_text: case_note_text,
            facts_json: {},
            actions_json: {},
            status: 'accepted',
            created_by: 'agent',
          },
          select: { id: true },
        });

    // Close the session.
    await closeSession(call_session_id, `outcome:${primary_outcome_code}`);

    return { outcome_id: outcome.id, note_id: note.id };
  });

  // ── GET /wrapup/:id ─────────────────────────────────────────────────────────
  app.get<{ Params: { id: string } }>('/wrapup/:id', async (req, reply) => {
    const { id } = req.params;

    const [outcome, note, session] = await Promise.all([
      db.callOutcome.findUnique({
        where: { call_session_id: id },
        select: {
          id: true,
          primary_outcome_code: true,
          disposition: true,
          owner_next_step: true,
          callback_required: true,
        },
      }),
      db.caseNote.findUnique({
        where: { call_session_id: id },
        select: { id: true, summary_text: true, status: true },
      }),
      db.callSession.findUnique({
        where: { id },
        select: {
          id: true,
          stage: true,
          current_path_code: true,
          overlay_path_codes_json: true,
          classification_status: true,
          ended_at: true,
          scenario: { select: { title: true, expected_primary_path: true } },
          resident: { select: { display_label: true } },
        },
      }),
    ]);

    if (!session) {
      return reply.code(404).send({ error: 'Session not found' });
    }

    return { session, outcome, note };
  });
}
