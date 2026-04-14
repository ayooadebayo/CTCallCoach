import { z } from 'zod';
export declare const QuestionRationaleOutputSchema: z.ZodObject<{
    rationale_text: z.ZodString;
    focus_area: z.ZodString;
    warning_text: z.ZodOptional<z.ZodString>;
    confidence: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    confidence: "low" | "medium" | "high";
    rationale_text: string;
    focus_area: string;
    warning_text?: string | undefined;
}, {
    confidence: "low" | "medium" | "high";
    rationale_text: string;
    focus_area: string;
    warning_text?: string | undefined;
}>;
export declare const PolicySimplifierOutputSchema: z.ZodObject<{
    plain_english_explanation: z.ZodString;
    source_domain_summary: z.ZodString;
    important_limitations: z.ZodString;
    confidence: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    confidence: "low" | "medium" | "high";
    plain_english_explanation: string;
    source_domain_summary: string;
    important_limitations: string;
}, {
    confidence: "low" | "medium" | "high";
    plain_english_explanation: string;
    source_domain_summary: string;
    important_limitations: string;
}>;
export declare const SuggestedWordingOutputSchema: z.ZodObject<{
    suggested_wording_text: z.ZodString;
    tone_label: z.ZodString;
    usage_note: z.ZodString;
    warning_text: z.ZodOptional<z.ZodString>;
    confidence: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    confidence: "low" | "medium" | "high";
    suggested_wording_text: string;
    tone_label: string;
    usage_note: string;
    warning_text?: string | undefined;
}, {
    confidence: "low" | "medium" | "high";
    suggested_wording_text: string;
    tone_label: string;
    usage_note: string;
    warning_text?: string | undefined;
}>;
export declare const WrapUpSummaryOutputSchema: z.ZodObject<{
    summary_text: z.ZodString;
    facts_structured: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    actions_structured: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    missing_information_warning: z.ZodOptional<z.ZodString>;
    confidence: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    summary_text: string;
    confidence: "low" | "medium" | "high";
    facts_structured: Record<string, unknown>;
    actions_structured: Record<string, unknown>;
    missing_information_warning?: string | undefined;
}, {
    summary_text: string;
    confidence: "low" | "medium" | "high";
    facts_structured: Record<string, unknown>;
    actions_structured: Record<string, unknown>;
    missing_information_warning?: string | undefined;
}>;
export declare const CoachingFeedbackOutputSchema: z.ZodObject<{
    what_went_well: z.ZodString;
    missed_opportunity: z.ZodString;
    next_time_tip: z.ZodString;
    confidence: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    confidence: "low" | "medium" | "high";
    what_went_well: string;
    missed_opportunity: string;
    next_time_tip: string;
}, {
    confidence: "low" | "medium" | "high";
    what_went_well: string;
    missed_opportunity: string;
    next_time_tip: string;
}>;
export declare const MissedSupportOpportunityOutputSchema: z.ZodObject<{
    missed_opportunity_detected: z.ZodBoolean;
    opportunity_type: z.ZodOptional<z.ZodString>;
    reason_text: z.ZodOptional<z.ZodString>;
    evidence_points: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    confidence: z.ZodEnum<["low", "medium", "high"]>;
}, "strip", z.ZodTypeAny, {
    confidence: "low" | "medium" | "high";
    missed_opportunity_detected: boolean;
    reason_text?: string | undefined;
    opportunity_type?: string | undefined;
    evidence_points?: string[] | undefined;
}, {
    confidence: "low" | "medium" | "high";
    missed_opportunity_detected: boolean;
    reason_text?: string | undefined;
    opportunity_type?: string | undefined;
    evidence_points?: string[] | undefined;
}>;
//# sourceMappingURL=index.d.ts.map