import { z } from 'zod';

// AI output validation schemas — validate structured responses from the AI layer
// Source: docs/council_tax_call_coach_ai_prompt_architecture_v_0.md §18

const confidenceSchema = z.enum(['low', 'medium', 'high']);

export const QuestionRationaleOutputSchema = z.object({
  rationale_text: z.string().min(1).max(500),
  focus_area: z.string().min(1),
  warning_text: z.string().optional(),
  confidence: confidenceSchema,
});

export const PolicySimplifierOutputSchema = z.object({
  plain_english_explanation: z.string().min(1).max(800),
  source_domain_summary: z.string().min(1),
  important_limitations: z.string().min(1),
  confidence: confidenceSchema,
});

export const SuggestedWordingOutputSchema = z.object({
  suggested_wording_text: z.string().min(1).max(600),
  tone_label: z.string().min(1),
  usage_note: z.string().min(1),
  warning_text: z.string().optional(),
  confidence: confidenceSchema,
});

export const WrapUpSummaryOutputSchema = z.object({
  summary_text: z.string().min(1).max(2000),
  facts_structured: z.record(z.unknown()),
  actions_structured: z.record(z.unknown()),
  missing_information_warning: z.string().optional(),
  confidence: confidenceSchema,
});

export const CoachingFeedbackOutputSchema = z.object({
  what_went_well: z.string().min(1).max(300),
  missed_opportunity: z.string().min(1).max(300),
  next_time_tip: z.string().min(1).max(300),
  confidence: confidenceSchema,
});

export const MissedSupportOpportunityOutputSchema = z.object({
  missed_opportunity_detected: z.boolean(),
  opportunity_type: z.string().optional(),
  reason_text: z.string().optional(),
  evidence_points: z.array(z.string()).optional(),
  confidence: confidenceSchema,
});
