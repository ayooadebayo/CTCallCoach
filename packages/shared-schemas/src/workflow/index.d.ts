import { z } from 'zod';
export declare const EnquiryTypeConfigSchema: z.ZodObject<{
    code: z.ZodEnum<["PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD8"]>;
    label: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    is_overlay: z.ZodBoolean;
    sort_order: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    code: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8";
    label: string;
    category: string;
    description: string;
    is_overlay: boolean;
    sort_order?: number | undefined;
}, {
    code: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8";
    label: string;
    category: string;
    description: string;
    is_overlay: boolean;
    sort_order?: number | undefined;
}>;
export declare const QuestionStepConfigSchema: z.ZodObject<{
    code: z.ZodString;
    stage: z.ZodEnum<["intake", "classification", "fact_gathering", "path_determination", "support_and_explanation", "escalation_review", "wrap_up", "closed"]>;
    question_text: z.ZodString;
    question_type: z.ZodEnum<["single_select", "multi_select", "free_text", "boolean", "numeric", "date"]>;
    mandatory: z.ZodBoolean;
    why_it_matters_text: z.ZodOptional<z.ZodString>;
    sensitivity_warning: z.ZodOptional<z.ZodString>;
    answer_options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    trigger_conditions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    skip_conditions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    sort_order: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    code: string;
    stage: "intake" | "classification" | "fact_gathering" | "path_determination" | "support_and_explanation" | "escalation_review" | "wrap_up" | "closed";
    question_text: string;
    question_type: "boolean" | "date" | "single_select" | "multi_select" | "free_text" | "numeric";
    mandatory: boolean;
    why_it_matters_text?: string | undefined;
    sensitivity_warning?: string | undefined;
    sort_order?: number | undefined;
    answer_options?: string[] | undefined;
    trigger_conditions?: Record<string, unknown> | undefined;
    skip_conditions?: Record<string, unknown> | undefined;
}, {
    code: string;
    stage: "intake" | "classification" | "fact_gathering" | "path_determination" | "support_and_explanation" | "escalation_review" | "wrap_up" | "closed";
    question_text: string;
    question_type: "boolean" | "date" | "single_select" | "multi_select" | "free_text" | "numeric";
    mandatory: boolean;
    why_it_matters_text?: string | undefined;
    sensitivity_warning?: string | undefined;
    sort_order?: number | undefined;
    answer_options?: string[] | undefined;
    trigger_conditions?: Record<string, unknown> | undefined;
    skip_conditions?: Record<string, unknown> | undefined;
}>;
export declare const ClassificationRuleSchema: z.ZodObject<{
    rule_code: z.ZodString;
    description: z.ZodString;
    conditions: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    output_path: z.ZodEnum<["PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD8"]>;
    is_overlay: z.ZodDefault<z.ZodBoolean>;
    confidence: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    confidence: "low" | "medium" | "high";
    description: string;
    is_overlay: boolean;
    rule_code: string;
    conditions: Record<string, unknown>;
    output_path: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8";
}, {
    description: string;
    rule_code: string;
    conditions: Record<string, unknown>;
    output_path: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8";
    confidence?: "low" | "medium" | "high" | undefined;
    is_overlay?: boolean | undefined;
}>;
export declare const SupportTriggerRuleSchema: z.ZodObject<{
    rule_code: z.ZodString;
    support_option_code: z.ZodString;
    trigger_conditions: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    trigger_conditions: Record<string, unknown>;
    rule_code: string;
    support_option_code: string;
}, {
    description: string;
    trigger_conditions: Record<string, unknown>;
    rule_code: string;
    support_option_code: string;
}>;
export declare const EscalationTriggerRuleSchema: z.ZodObject<{
    rule_code: z.ZodString;
    escalation_code: z.ZodString;
    category: z.ZodString;
    severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
    trigger_conditions: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    category: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    trigger_conditions: Record<string, unknown>;
    rule_code: string;
    escalation_code: string;
}, {
    category: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    trigger_conditions: Record<string, unknown>;
    rule_code: string;
    escalation_code: string;
}>;
export declare const OutcomeRuleSchema: z.ZodObject<{
    path_code: z.ZodEnum<["PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD8"]>;
    allowed_outcomes: z.ZodArray<z.ZodEnum<["info_only", "support_signposted", "specialist_review_referred", "debt_advice_signposted", "vulnerability_flag_raised", "callback_required", "pending_further_evidence", "redirected"]>, "many">;
}, "strip", z.ZodTypeAny, {
    path_code: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8";
    allowed_outcomes: ("callback_required" | "info_only" | "support_signposted" | "specialist_review_referred" | "debt_advice_signposted" | "vulnerability_flag_raised" | "pending_further_evidence" | "redirected")[];
}, {
    path_code: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8";
    allowed_outcomes: ("callback_required" | "info_only" | "support_signposted" | "specialist_review_referred" | "debt_advice_signposted" | "vulnerability_flag_raised" | "pending_further_evidence" | "redirected")[];
}>;
export declare const PathRuleSchema: z.ZodObject<{
    rule_code: z.ZodString;
    description: z.ZodString;
    from_path: z.ZodNullable<z.ZodEnum<["PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD8"]>>;
    to_path: z.ZodEnum<["PD1", "PD2", "PD3", "PD4", "PD5", "PD6", "PD7", "PD8"]>;
    trigger_conditions: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    next_stage: z.ZodEnum<["intake", "classification", "fact_gathering", "path_determination", "support_and_explanation", "escalation_review", "wrap_up", "closed"]>;
    guidance_card_codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    support_check_codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    escalation_check_codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description: string;
    trigger_conditions: Record<string, unknown>;
    rule_code: string;
    from_path: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8" | null;
    to_path: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8";
    next_stage: "intake" | "classification" | "fact_gathering" | "path_determination" | "support_and_explanation" | "escalation_review" | "wrap_up" | "closed";
    guidance_card_codes?: string[] | undefined;
    support_check_codes?: string[] | undefined;
    escalation_check_codes?: string[] | undefined;
}, {
    description: string;
    trigger_conditions: Record<string, unknown>;
    rule_code: string;
    from_path: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8" | null;
    to_path: "PD1" | "PD2" | "PD3" | "PD4" | "PD5" | "PD6" | "PD7" | "PD8";
    next_stage: "intake" | "classification" | "fact_gathering" | "path_determination" | "support_and_explanation" | "escalation_review" | "wrap_up" | "closed";
    guidance_card_codes?: string[] | undefined;
    support_check_codes?: string[] | undefined;
    escalation_check_codes?: string[] | undefined;
}>;
export type EnquiryTypeConfig = z.infer<typeof EnquiryTypeConfigSchema>;
export type QuestionStepConfig = z.infer<typeof QuestionStepConfigSchema>;
export type ClassificationRule = z.infer<typeof ClassificationRuleSchema>;
export type SupportTriggerRule = z.infer<typeof SupportTriggerRuleSchema>;
export type EscalationTriggerRule = z.infer<typeof EscalationTriggerRuleSchema>;
export type PathRule = z.infer<typeof PathRuleSchema>;
export type OutcomeRule = z.infer<typeof OutcomeRuleSchema>;
//# sourceMappingURL=index.d.ts.map