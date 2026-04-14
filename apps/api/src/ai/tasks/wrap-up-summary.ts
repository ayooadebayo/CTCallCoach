import { db } from '../../db/client.js';
import { getOpenAIClient, isOpenAIAvailable } from '../clients/openai.js';
import { SYSTEM_PROMPT } from '../system/system-prompt.js';
import { WrapUpSummarySchema } from '../schemas/wrap-up-summary.js';

type WrapUpResult = {
  summary_text: string;
  suggested_next_step: string;
  flags: string[];
  source: 'ai' | 'template';
};

export async function generateWrapUpSummary(sessionId: string): Promise<WrapUpResult | null> {
  // ── Load session data ─────────────────────────────────────────────────────
  const session = await db.callSession.findUnique({
    where: { id: sessionId },
    include: {
      question_responses: {
        where: { response_status: 'answered' },
        include: {
          question_step_definition: { select: { question_text: true } },
        },
        orderBy: { created_at: 'asc' },
      },
      surfaced_support_options: {
        include: {
          support_option: { select: { label: true } },
        },
      },
      escalation_flags: {
        select: { code: true, severity: true, reason_text: true },
      },
      call_outcome: {
        select: { primary_outcome_code: true, owner_next_step: true },
      },
    },
  });

  if (!session) return null;

  const path = session.current_path_code ?? null;
  const overlayPaths = Array.isArray(session.overlay_path_codes_json)
    ? (session.overlay_path_codes_json as string[])
    : [];
  const responses = session.question_responses;
  const supportLabels = session.surfaced_support_options
    .map((s) => s.support_option.label)
    .join(', ') || 'none identified';
  const escalations = session.escalation_flags;

  // ── Template fallback (always available) ─────────────────────────────────
  function templateFallback(): WrapUpResult {
    const pathDesc = path
      ? `${path}${overlayPaths.length > 0 ? ` with overlays: ${overlayPaths.join(', ')}` : ''}`
      : 'council tax payment difficulty';

    const summary_text =
      `Resident called regarding ${pathDesc}. ` +
      `${responses.length} question${responses.length !== 1 ? 's' : ''} answered. ` +
      `Support options identified: ${supportLabels}.` +
      (escalations.length > 0
        ? ` Escalation flags raised: ${escalations.map((e) => e.code).join(', ')}.`
        : '');

    const suggested_next_step =
      escalations.length > 0
        ? 'Refer to specialist team — escalation flag raised.'
        : 'Follow up as agreed with resident.';

    return {
      summary_text,
      suggested_next_step,
      flags: escalations.map((e) => e.code),
      source: 'template',
    };
  }

  if (!isOpenAIAvailable()) return templateFallback();

  // ── Build AI context ──────────────────────────────────────────────────────
  const qaLines = responses
    .map((r) => {
      const q = r.question_step_definition.question_text;
      const a =
        r.answer_boolean !== null && r.answer_boolean !== undefined
          ? r.answer_boolean
            ? 'Yes'
            : 'No'
          : r.answer_text ?? (r.answer_number !== null && r.answer_number !== undefined ? String(r.answer_number) : '?');
      return `Q: ${q}\nA: ${a}`;
    })
    .join('\n');

  const escalationLines = escalations
    .map((e) => `${e.code} (${e.severity}): ${e.reason_text}`)
    .join('; ');

  const context = [
    `Path: ${path ?? 'not classified'}`,
    overlayPaths.length > 0 ? `Overlay paths: ${overlayPaths.join(', ')}` : null,
    qaLines ? `\nQ&A answers:\n${qaLines}` : 'No questions answered.',
    `Support options surfaced: ${supportLabels}`,
    escalations.length > 0 ? `Escalation flags: ${escalationLines}` : 'No escalation flags.',
    session.call_outcome
      ? `Outcome recorded: ${session.call_outcome.primary_outcome_code}`
      : null,
  ]
    .filter(Boolean)
    .join('\n');

  // ── AI call ────────────────────────────────────────────────────────────────
  try {
    const client = getOpenAIClient();

    const aiResponse = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 400,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content:
            `Generate an internal case note draft from this council tax call session data:\n\n${context}\n\n` +
            `Return JSON with three fields:\n` +
            `- "summary_text": concise internal case note (max 600 chars, UK English)\n` +
            `- "suggested_next_step": one clear action for the agent (max 200 chars)\n` +
            `- "flags": array of up to 3 short alert strings for the case handler (e.g. escalation or specialist needed)`,
        },
      ],
    });

    const raw = aiResponse.choices[0]?.message?.content;
    if (!raw) return templateFallback();

    const parsed = WrapUpSummarySchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return templateFallback();

    return { ...parsed.data, source: 'ai' };
  } catch {
    return templateFallback();
  }
}
