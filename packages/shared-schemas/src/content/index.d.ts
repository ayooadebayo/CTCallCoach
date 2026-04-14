import { z } from 'zod';
export declare const GuidanceCardContentSchema: z.ZodObject<{
    code: z.ZodString;
    title: z.ZodString;
    summary: z.ZodString;
    source_domain: z.ZodEnum<["public_policy", "acme_operations"]>;
    body_markdown: z.ZodOptional<z.ZodString>;
    do_say_text: z.ZodOptional<z.ZodString>;
    do_not_say_text: z.ZodOptional<z.ZodString>;
    warning_text: z.ZodOptional<z.ZodString>;
    applicable_contexts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    code: string;
    source_domain: "public_policy" | "acme_operations";
    title: string;
    summary: string;
    warning_text?: string | undefined;
    body_markdown?: string | undefined;
    do_say_text?: string | undefined;
    do_not_say_text?: string | undefined;
    applicable_contexts?: string[] | undefined;
    tags?: string[] | undefined;
}, {
    code: string;
    source_domain: "public_policy" | "acme_operations";
    title: string;
    summary: string;
    warning_text?: string | undefined;
    body_markdown?: string | undefined;
    do_say_text?: string | undefined;
    do_not_say_text?: string | undefined;
    applicable_contexts?: string[] | undefined;
    tags?: string[] | undefined;
}>;
export declare const SupportOptionContentSchema: z.ZodObject<{
    code: z.ZodString;
    label: z.ZodString;
    category: z.ZodEnum<["payment_difficulty", "council_tax_reduction_signpost", "discount_exemption_signpost", "debt_advice", "specialist_review", "communication_support"]>;
    resident_explanation: z.ZodString;
    internal_handling_note: z.ZodString;
    requires_specialist_follow_up: z.ZodDefault<z.ZodBoolean>;
    source_domain: z.ZodOptional<z.ZodEnum<["public_policy", "acme_operations"]>>;
    trigger_conditions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    label: string;
    category: "payment_difficulty" | "council_tax_reduction_signpost" | "discount_exemption_signpost" | "debt_advice" | "specialist_review" | "communication_support";
    resident_explanation: string;
    internal_handling_note: string;
    requires_specialist_follow_up: boolean;
    source_domain?: "public_policy" | "acme_operations" | undefined;
    trigger_conditions?: Record<string, unknown> | undefined;
}, {
    code: string;
    label: string;
    category: "payment_difficulty" | "council_tax_reduction_signpost" | "discount_exemption_signpost" | "debt_advice" | "specialist_review" | "communication_support";
    resident_explanation: string;
    internal_handling_note: string;
    requires_specialist_follow_up?: boolean | undefined;
    source_domain?: "public_policy" | "acme_operations" | undefined;
    trigger_conditions?: Record<string, unknown> | undefined;
}>;
export declare const WordingTemplateContentSchema: z.ZodObject<{
    code: z.ZodString;
    context_code: z.ZodString;
    tone_type: z.ZodString;
    text: z.ZodString;
    applicable_contexts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    prohibited_use_notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    text: string;
    context_code: string;
    tone_type: string;
    applicable_contexts?: string[] | undefined;
    prohibited_use_notes?: string | null | undefined;
}, {
    code: string;
    text: string;
    context_code: string;
    tone_type: string;
    applicable_contexts?: string[] | undefined;
    prohibited_use_notes?: string | null | undefined;
}>;
export declare const WarningContentSchema: z.ZodObject<{
    code: z.ZodString;
    severity: z.ZodEnum<["informational", "caution", "high_risk"]>;
    message: z.ZodString;
    applicable_contexts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    severity: "informational" | "caution" | "high_risk";
    applicable_contexts?: string[] | undefined;
}, {
    code: string;
    message: string;
    severity: "informational" | "caution" | "high_risk";
    applicable_contexts?: string[] | undefined;
}>;
export type GuidanceCardContent = z.infer<typeof GuidanceCardContentSchema>;
export type SupportOptionContent = z.infer<typeof SupportOptionContentSchema>;
export type WarningContent = z.infer<typeof WarningContentSchema>;
export type WordingTemplateContent = z.infer<typeof WordingTemplateContentSchema>;
//# sourceMappingURL=index.d.ts.map