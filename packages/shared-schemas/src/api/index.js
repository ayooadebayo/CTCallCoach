import { z } from 'zod';
// API payload schemas — validate inbound HTTP request bodies
export const CreateSessionSchema = z.object({
    agent_id: z.string().uuid(),
    scenario_id: z.string().uuid().optional(),
    session_mode: z.enum(['demo_guided', 'scenario_replay', 'manual_test', 'future_live_call']),
});
export const ClassifyRequestSchema = z.object({
    call_session_id: z.string().uuid(),
    intake_reason_code: z.string().min(1),
    intent_signals: z
        .array(z.object({
        type: z.string(),
        value: z.string(),
    }))
        .optional()
        .default([]),
});
export const SubmitResponseSchema = z.object({
    call_session_id: z.string().uuid(),
    question_code: z.string().min(1),
    response_status: z.enum(['answered', 'skipped', 'not_applicable', 'overridden']),
    answer_text: z.string().optional(),
    answer_boolean: z.boolean().optional(),
    answer_number: z.number().optional(),
    answer_json: z.record(z.unknown()).optional(),
    source: z
        .enum(['agent_input', 'scenario_seed', 'future_transcript_inference', 'system_default'])
        .default('agent_input'),
});
export const OverrideClassificationSchema = z.object({
    call_session_id: z.string().uuid(),
    from_classification: z.string(),
    to_classification: z.string(),
    reason: z.string().min(1),
});
//# sourceMappingURL=index.js.map