import { z } from 'zod';
// Analytics event validation schema
// Source: docs/council_tax_call_coach_analytics_and_qa_specification_v_0.md §14
export const AnalyticsEventSchema = z.object({
    event_id: z.string().uuid(),
    event_name: z.string().min(1),
    occurred_at: z.string().datetime(),
    call_session_id: z.string().uuid(),
    workflow_version_id: z.string().min(1),
    created_at: z.string().datetime(),
    agent_id: z.string().uuid().optional(),
    scenario_id: z.string().uuid().optional(),
    content_version_id: z.string().optional(),
    prompt_version_id: z.string().optional(),
    screen_name: z.string().optional(),
    payload_json: z.record(z.unknown()).optional(),
});
//# sourceMappingURL=index.js.map