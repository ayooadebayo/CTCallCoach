import { z } from 'zod';
export declare const CreateSessionSchema: z.ZodObject<{
    agent_id: z.ZodString;
    scenario_id: z.ZodOptional<z.ZodString>;
    session_mode: z.ZodEnum<["demo_guided", "scenario_replay", "manual_test", "future_live_call"]>;
}, "strip", z.ZodTypeAny, {
    agent_id: string;
    session_mode: "demo_guided" | "scenario_replay" | "manual_test" | "future_live_call";
    scenario_id?: string | undefined;
}, {
    agent_id: string;
    session_mode: "demo_guided" | "scenario_replay" | "manual_test" | "future_live_call";
    scenario_id?: string | undefined;
}>;
export declare const ClassifyRequestSchema: z.ZodObject<{
    call_session_id: z.ZodString;
    intake_reason_code: z.ZodString;
    intent_signals: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        type: string;
    }, {
        value: string;
        type: string;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    intent_signals: {
        value: string;
        type: string;
    }[];
    call_session_id: string;
    intake_reason_code: string;
}, {
    call_session_id: string;
    intake_reason_code: string;
    intent_signals?: {
        value: string;
        type: string;
    }[] | undefined;
}>;
export declare const SubmitResponseSchema: z.ZodObject<{
    call_session_id: z.ZodString;
    question_code: z.ZodString;
    response_status: z.ZodEnum<["answered", "skipped", "not_applicable", "overridden"]>;
    answer_text: z.ZodOptional<z.ZodString>;
    answer_boolean: z.ZodOptional<z.ZodBoolean>;
    answer_number: z.ZodOptional<z.ZodNumber>;
    answer_json: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    source: z.ZodDefault<z.ZodEnum<["agent_input", "scenario_seed", "future_transcript_inference", "system_default"]>>;
}, "strip", z.ZodTypeAny, {
    call_session_id: string;
    response_status: "overridden" | "answered" | "skipped" | "not_applicable";
    source: "agent_input" | "scenario_seed" | "future_transcript_inference" | "system_default";
    question_code: string;
    answer_text?: string | undefined;
    answer_boolean?: boolean | undefined;
    answer_number?: number | undefined;
    answer_json?: Record<string, unknown> | undefined;
}, {
    call_session_id: string;
    response_status: "overridden" | "answered" | "skipped" | "not_applicable";
    question_code: string;
    answer_text?: string | undefined;
    answer_boolean?: boolean | undefined;
    answer_number?: number | undefined;
    answer_json?: Record<string, unknown> | undefined;
    source?: "agent_input" | "scenario_seed" | "future_transcript_inference" | "system_default" | undefined;
}>;
export declare const OverrideClassificationSchema: z.ZodObject<{
    call_session_id: z.ZodString;
    from_classification: z.ZodString;
    to_classification: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    call_session_id: string;
    reason: string;
    from_classification: string;
    to_classification: string;
}, {
    call_session_id: string;
    reason: string;
    from_classification: string;
    to_classification: string;
}>;
export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;
export type ClassifyRequestInput = z.infer<typeof ClassifyRequestSchema>;
export type SubmitResponseInput = z.infer<typeof SubmitResponseSchema>;
export type OverrideClassificationInput = z.infer<typeof OverrideClassificationSchema>;
//# sourceMappingURL=index.d.ts.map