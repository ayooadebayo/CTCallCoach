// AI assistance routes
//
// GET  /ai/question-rationale?question_code=&session_id=
//   Returns AI-generated rationale and learning tip for the current question,
//   or null fields if AI is unavailable or the question/session is not found.
//
// POST /ai/wrapup-summary { call_session_id }
//   Generates a wrap-up case note draft from session data.
//   Falls back to a rule-based template when AI is unavailable.
//
// GET  /ai/coaching/:sessionId
//   Returns after-call coaching feedback for the agent, or null if unavailable.

import type { FastifyInstance } from 'fastify';
import { db } from '../db/client.js';
import { getQuestionRationale } from '../ai/tasks/question-rationale.js';
import { generateWrapUpSummary } from '../ai/tasks/wrap-up-summary.js';
import { generateCoachingFeedback } from '../ai/tasks/coaching-feedback.js';

export async function aiRoute(app: FastifyInstance): Promise<void> {
  // ── GET /ai/question-rationale ────────────────────────────────────────────
  app.get<{
    Querystring: { question_code?: string; session_id?: string };
  }>('/ai/question-rationale', async (req, reply) => {
    const { question_code, session_id } = req.query;

    if (!question_code || !session_id) {
      return reply
        .code(400)
        .send({ error: '"question_code" and "session_id" query params are required' });
    }

    const session = await db.callSession.findUnique({
      where: { id: session_id },
      select: { current_path_code: true, workflow_version_id: true },
    });

    if (!session) {
      return reply.code(404).send({ error: 'Session not found' });
    }

    const questionDef = await db.questionStepDefinition.findFirst({
      where: {
        code: question_code,
        workflow_version_id: session.workflow_version_id,
      },
      select: { question_text: true },
    });

    const questionText = questionDef?.question_text ?? question_code;
    const primaryPath = session.current_path_code ?? null;

    const result = await getQuestionRationale(question_code, questionText, primaryPath);

    return {
      rationale: result?.rationale ?? null,
      learning_tip: result?.learning_tip ?? null,
    };
  });

  // ── POST /ai/wrapup-summary ───────────────────────────────────────────────
  app.post<{
    Body: { call_session_id?: string };
  }>('/ai/wrapup-summary', async (req, reply) => {
    const { call_session_id } = req.body ?? {};

    if (!call_session_id || typeof call_session_id !== 'string') {
      return reply.code(400).send({ error: '"call_session_id" is required' });
    }

    const result = await generateWrapUpSummary(call_session_id);

    if (!result) {
      return reply.code(404).send({ error: 'Session not found or could not generate summary' });
    }

    return result;
  });

  // ── GET /ai/coaching/:sessionId ───────────────────────────────────────────
  app.get<{ Params: { sessionId: string } }>(
    '/ai/coaching/:sessionId',
    async (req, _reply) => {
      const { sessionId } = req.params;
      const result = await generateCoachingFeedback(sessionId);
      return result ?? { well_handled: null, could_improve: null, learning_recommendation: null };
    },
  );
}
