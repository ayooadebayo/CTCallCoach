import { db } from '../../db/client.js';
import { getOpenAIClient, isOpenAIAvailable } from '../clients/openai.js';
import { SYSTEM_PROMPT } from '../system/system-prompt.js';
import { CoachingFeedbackSchema } from '../schemas/coaching-feedback.js';
import type { CoachingFeedback } from '../schemas/coaching-feedback.js';

export async function generateCoachingFeedback(
  sessionId: string,
): Promise<CoachingFeedback | null> {
  if (!isOpenAIAvailable()) return null;

  // ── Load session data ─────────────────────────────────────────────────────
  const session = await db.callSession.findUnique({
    where: { id: sessionId },
    include: {
      question_responses: {
        include: {
          question_step_definition: {
            select: { question_text: true, mandatory: true },
          },
        },
        orderBy: { created_at: 'asc' },
      },
      surfaced_support_options: {
        include: {
          support_option: { select: { label: true } },
        },
      },
      escalation_flags: {
        select: { code: true, severity: true, reason: true },
      },
      call_outcome: {
        select: { primary_outcome_code: true, owner_next_step: true },
      },
      case_note: {
        select: { summary_text: true },
      },
    },
  });

  if (!session) return null;

  // ── Build context ──────────────────────────────────────────────────────────
  const answered = session.question_responses.filter(
    (r) => r.response_status === 'answered',
  );
  const skipped = session.question_responses.filter(
    (r) => r.response_status !== 'answered',
  );
  const mandatorySkipped = skipped.filter(
    (r) => r.question_step_definition.mandatory,
  );

  const supportLabels = session.surfaced_support_options
    .map((s) => s.support_option.label)
    .join(', ') || 'none';

  const escalationSummary = session.escalation_flags
    .map((e) => `${e.code} (${e.severity})`)
    .join(', ') || 'none';

  const context = [
    `Call path: ${session.current_path_code ?? 'not classified'}`,
    `Questions answered: ${answered.length}, skipped/not-applicable: ${skipped.length}`,
    mandatorySkipped.length > 0
      ? `Mandatory questions not answered: ${mandatorySkipped
          .map((r) => r.question_step_definition.question_text)
          .join('; ')}`
      : 'All mandatory questions addressed.',
    `Support options surfaced: ${supportLabels}`,
    `Escalation flags: ${escalationSummary}`,
    session.call_outcome
      ? `Outcome: ${session.call_outcome.primary_outcome_code}. Next step: ${session.call_outcome.owner_next_step}`
      : 'No outcome recorded.',
    session.case_note?.summary_text
      ? `Case note: ${session.case_note.summary_text.slice(0, 200)}`
      : null,
  ]
    .filter(Boolean)
    .join('\n');

  // ── AI call ────────────────────────────────────────────────────────────────
  try {
    const client = getOpenAIClient();

    const aiResponse = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 350,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content:
            `Generate short after-call coaching feedback for the agent based on this session:\n\n${context}\n\n` +
            `Return JSON with three fields:\n` +
            `- "well_handled": array of up to 2 short strings describing what went well (grounded in session evidence)\n` +
            `- "could_improve": array of up to 2 short constructive suggestions\n` +
            `- "learning_recommendation": one specific, actionable tip (max 250 chars, non-punitive, UK English)`,
        },
      ],
    });

    const raw = aiResponse.choices[0]?.message?.content;
    if (!raw) return null;

    const parsed = CoachingFeedbackSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
