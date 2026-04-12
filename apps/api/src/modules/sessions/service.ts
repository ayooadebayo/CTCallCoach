// Session service — creates, loads, and manages CallSession records.
//
// Responsibilities:
//   - Active version lookup (workflow, content, prompt)
//   - Session creation with optional scenario context seeding
//   - Scenario context → intent signals and vulnerability signals pre-seed
//   - Session detail loading for API responses
//   - Stage advancement and session close
//   - Path/classification status persistence after workflow evaluation

import { db } from '../../db/client.js';
import type { CreateSessionInput } from '@ctcc/shared-schemas';

// ─── Version lookup ───────────────────────────────────────────────────────────

async function getActiveVersionIds(): Promise<{
  workflow_version_id: string;
  content_version_id: string;
  prompt_version_id: string;
}> {
  const [wv, cv, pv] = await Promise.all([
    db.workflowVersion.findFirstOrThrow({
      where: { status: 'active' },
      select: { id: true },
    }),
    db.contentVersion.findFirstOrThrow({
      where: { status: 'active' },
      select: { id: true },
    }),
    db.promptVersion.findFirstOrThrow({
      where: { status: 'active' },
      select: { id: true },
    }),
  ]);
  return {
    workflow_version_id: wv.id,
    content_version_id: cv.id,
    prompt_version_id: pv.id,
  };
}

// ─── Session creation ─────────────────────────────────────────────────────────

/**
 * Create a new CallSession.
 *
 * If scenario_id is supplied:
 *   - A synthetic resident is created from scenario.resident_profile_json.
 *   - Intent signals are seeded from scenario.account_context_json so the
 *     workflow engine can immediately classify even before questions are answered.
 *   - Vulnerability signals are seeded from scenario.resident_profile_json
 *     when vulnerability_categories is present.
 *
 * Returns the new session ID.
 */
export async function createSession(input: CreateSessionInput): Promise<{ id: string }> {
  const versionIds = await getActiveVersionIds();

  let residentId: string;

  if (input.scenario_id) {
    const scenario = await db.scenario.findUniqueOrThrow({
      where: { id: input.scenario_id },
    });

    const profile = scenario.resident_profile_json as Record<string, unknown>;
    const accountCtx = scenario.account_context_json as Record<string, unknown>;

    const resident = await db.resident.create({
      data: {
        display_label: String(profile['display_label'] ?? 'Synthetic Resident'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        caller_role: (profile['caller_role'] as any) ?? 'account_holder',
        authentication_status: 'authenticated',
        data_origin: 'synthetic',
        account_reference: accountCtx['account_reference']
          ? String(accountCtx['account_reference'])
          : null,
      },
    });
    residentId = resident.id;
  } else {
    const resident = await db.resident.create({
      data: {
        display_label: 'Unknown Resident',
        caller_role: 'unknown',
        authentication_status: 'unknown',
        data_origin: 'synthetic',
      },
    });
    residentId = resident.id;
  }

  const session = await db.callSession.create({
    data: {
      agent_id: input.agent_id,
      resident_id: residentId,
      scenario_id: input.scenario_id ?? null,
      session_mode: input.session_mode,
      stage: 'intake',
      classification_status: 'unclassified',
      ...versionIds,
    },
    select: { id: true },
  });

  // Seed context signals from scenario so the engine has data immediately.
  if (input.scenario_id) {
    await seedScenarioSignals(session.id, residentId, input.scenario_id);
  }

  return { id: session.id };
}

async function seedScenarioSignals(
  sessionId: string,
  residentId: string,
  scenarioId: string,
): Promise<void> {
  const scenario = await db.scenario.findUnique({ where: { id: scenarioId } });
  if (!scenario) return;

  const ctx = scenario.account_context_json as Record<string, unknown>;
  const profile = scenario.resident_profile_json as Record<string, unknown>;

  // Intent signals from account context + resident profile.
  const signals: Array<{ signal_type: string; signal_value: string }> = [];

  if (ctx['notice_type']) {
    signals.push({ signal_type: 'notice_type', signal_value: String(ctx['notice_type']) });
  }
  if (ctx['intent']) {
    signals.push({ signal_type: 'intent', signal_value: String(ctx['intent']) });
  }
  if (profile['income_change'] === true) {
    signals.push({ signal_type: 'income_changed', signal_value: 'true' });
  }
  if (profile['benefits_or_low_income'] === true) {
    signals.push({ signal_type: 'benefits_or_low_income', signal_value: 'true' });
  }
  if (profile['vulnerability_detected'] === true) {
    signals.push({ signal_type: 'vulnerability_detected', signal_value: 'true' });
  }

  if (signals.length > 0) {
    await db.intentSignal.createMany({
      data: signals.map((s) => ({
        call_session_id: sessionId,
        ...s,
        source: 'scenario_seed',
        confidence: 'high',
      })),
    });
  }

  // Vulnerability signals from resident profile.
  const vulnCategories = profile['vulnerability_categories'];
  if (Array.isArray(vulnCategories) && vulnCategories.length > 0) {
    await db.vulnerabilitySignal.createMany({
      data: vulnCategories.map((cat: unknown) => ({
        call_session_id: sessionId,
        resident_id: residentId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: cat as any,
        source: 'scenario_seed',
        confidence: 'high',
        requires_sensitive_handling: true,
      })),
    });
  }
}

// ─── Session detail loading ───────────────────────────────────────────────────

/**
 * Load a session with all related data needed for an API response.
 * Returns the Prisma record — routes serialise it to JSON directly.
 */
export async function getSessionDetails(id: string) {
  return db.callSession.findUniqueOrThrow({
    where: { id },
    include: {
      agent: {
        select: { id: true, display_name: true, role: true, team: true },
      },
      resident: true,
      scenario: {
        select: {
          id: true,
          title: true,
          description: true,
          expected_primary_path: true,
          expected_overlay_paths_json: true,
          difficulty_level: true,
          tags: true,
        },
      },
      question_responses: {
        include: {
          question_step_definition: {
            select: { code: true, question_text: true, stage: true, mandatory: true },
          },
        },
        orderBy: { created_at: 'asc' },
      },
      escalation_flags: true,
      vulnerability_signals: true,
      surfaced_support_options: {
        include: {
          support_option: {
            select: { code: true, label: true, category: true, resident_explanation: true },
          },
        },
      },
    },
  });
}

// ─── Stage management ─────────────────────────────────────────────────────────

const ALLOWED_STAGES = [
  'intake',
  'classification',
  'fact_gathering',
  'path_determination',
  'support_and_explanation',
  'escalation_review',
  'wrap_up',
  'closed',
] as const;

export type SessionStageValue = (typeof ALLOWED_STAGES)[number];

export function isValidStage(value: string): value is SessionStageValue {
  return (ALLOWED_STAGES as readonly string[]).includes(value);
}

export async function advanceSessionStage(id: string, stage: SessionStageValue) {
  return db.callSession.update({
    where: { id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { stage: stage as any },
    select: { id: true, stage: true },
  });
}

export async function closeSession(id: string, endReason?: string) {
  return db.callSession.update({
    where: { id },
    data: {
      stage: 'closed',
      ended_at: new Date(),
      end_reason: endReason ?? null,
    },
    select: { id: true, stage: true, ended_at: true },
  });
}

// ─── Path / classification state persistence ──────────────────────────────────

/**
 * Persist the workflow engine's resolved paths back to the session record.
 * Called after each POST /workflow/respond so the session row stays in sync.
 */
export async function updateSessionPaths(
  id: string,
  primaryPath: string | null,
  overlayPaths: string[],
  classificationStatus: string,
): Promise<void> {
  await db.callSession.update({
    where: { id },
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      current_path_code: primaryPath as any,
      overlay_path_codes_json: overlayPaths,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      classification_status: classificationStatus as any,
    },
  });
}
