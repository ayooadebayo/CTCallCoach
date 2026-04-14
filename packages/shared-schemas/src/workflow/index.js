import { z } from 'zod';
// Workflow config file validation schemas
// Used to validate packages/workflow-config/src/versions/v1/*.json on load
export const EnquiryTypeConfigSchema = z.object({
    code: z.enum(['PD1', 'PD2', 'PD3', 'PD4', 'PD5', 'PD6', 'PD7', 'PD8']),
    label: z.string().min(1),
    description: z.string().min(1),
    category: z.string(),
    is_overlay: z.boolean(),
    sort_order: z.number().optional(),
});
export const QuestionStepConfigSchema = z.object({
    code: z.string().min(1),
    stage: z.enum([
        'intake',
        'classification',
        'fact_gathering',
        'path_determination',
        'support_and_explanation',
        'escalation_review',
        'wrap_up',
        'closed',
    ]),
    question_text: z.string().min(1),
    question_type: z.enum(['single_select', 'multi_select', 'free_text', 'boolean', 'numeric', 'date']),
    mandatory: z.boolean(),
    why_it_matters_text: z.string().optional(),
    sensitivity_warning: z.string().optional(),
    answer_options: z.array(z.string()).optional(),
    trigger_conditions: z.record(z.unknown()).optional(),
    skip_conditions: z.record(z.unknown()).optional(),
    sort_order: z.number().optional(),
});
export const ClassificationRuleSchema = z.object({
    rule_code: z.string().min(1),
    description: z.string(),
    conditions: z.record(z.unknown()),
    output_path: z.enum(['PD1', 'PD2', 'PD3', 'PD4', 'PD5', 'PD6', 'PD7', 'PD8']),
    is_overlay: z.boolean().default(false),
    confidence: z.enum(['low', 'medium', 'high']).default('medium'),
});
export const SupportTriggerRuleSchema = z.object({
    rule_code: z.string().min(1),
    support_option_code: z.string(),
    trigger_conditions: z.record(z.unknown()),
    description: z.string(),
});
export const EscalationTriggerRuleSchema = z.object({
    rule_code: z.string().min(1),
    escalation_code: z.string(),
    category: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    trigger_conditions: z.record(z.unknown()),
    description: z.string(),
});
export const OutcomeRuleSchema = z.object({
    path_code: z.enum(['PD1', 'PD2', 'PD3', 'PD4', 'PD5', 'PD6', 'PD7', 'PD8']),
    allowed_outcomes: z.array(z.enum([
        'info_only',
        'support_signposted',
        'specialist_review_referred',
        'debt_advice_signposted',
        'vulnerability_flag_raised',
        'callback_required',
        'pending_further_evidence',
        'redirected',
    ])),
});
export const PathRuleSchema = z.object({
    rule_code: z.string().min(1),
    description: z.string(),
    from_path: z.enum(['PD1', 'PD2', 'PD3', 'PD4', 'PD5', 'PD6', 'PD7', 'PD8']).nullable(),
    to_path: z.enum(['PD1', 'PD2', 'PD3', 'PD4', 'PD5', 'PD6', 'PD7', 'PD8']),
    trigger_conditions: z.record(z.unknown()),
    next_stage: z.enum([
        'intake',
        'classification',
        'fact_gathering',
        'path_determination',
        'support_and_explanation',
        'escalation_review',
        'wrap_up',
        'closed',
    ]),
    guidance_card_codes: z.array(z.string()).optional(),
    support_check_codes: z.array(z.string()).optional(),
    escalation_check_codes: z.array(z.string()).optional(),
});
//# sourceMappingURL=index.js.map