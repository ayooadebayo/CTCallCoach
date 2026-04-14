import { z } from 'zod';
export declare const AnalyticsEventSchema: z.ZodObject<{
    event_id: z.ZodString;
    event_name: z.ZodString;
    occurred_at: z.ZodString;
    call_session_id: z.ZodString;
    workflow_version_id: z.ZodString;
    created_at: z.ZodString;
    agent_id: z.ZodOptional<z.ZodString>;
    scenario_id: z.ZodOptional<z.ZodString>;
    content_version_id: z.ZodOptional<z.ZodString>;
    prompt_version_id: z.ZodOptional<z.ZodString>;
    screen_name: z.ZodOptional<z.ZodString>;
    payload_json: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    workflow_version_id: string;
    created_at: string;
    call_session_id: string;
    event_id: string;
    event_name: string;
    occurred_at: string;
    agent_id?: string | undefined;
    scenario_id?: string | undefined;
    content_version_id?: string | undefined;
    prompt_version_id?: string | undefined;
    screen_name?: string | undefined;
    payload_json?: Record<string, unknown> | undefined;
}, {
    workflow_version_id: string;
    created_at: string;
    call_session_id: string;
    event_id: string;
    event_name: string;
    occurred_at: string;
    agent_id?: string | undefined;
    scenario_id?: string | undefined;
    content_version_id?: string | undefined;
    prompt_version_id?: string | undefined;
    screen_name?: string | undefined;
    payload_json?: Record<string, unknown> | undefined;
}>;
export type AnalyticsEventInput = z.infer<typeof AnalyticsEventSchema>;
//# sourceMappingURL=index.d.ts.map