import { z } from 'zod';

// Content bundle validation schemas
// Used to validate packages/content-bundles/src/versions/v1/**/*.json on load

export const GuidanceCardContentSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  source_domain: z.enum(['public_policy', 'acme_operations']),
  body_markdown: z.string().optional(),
  do_say_text: z.string().optional(),
  do_not_say_text: z.string().optional(),
  warning_text: z.string().optional(),
  applicable_contexts: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const SupportOptionContentSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  category: z.enum([
    'payment_difficulty',
    'council_tax_reduction_signpost',
    'discount_exemption_signpost',
    'debt_advice',
    'specialist_review',
    'communication_support',
  ]),
  resident_explanation: z.string().min(1),
  internal_handling_note: z.string().min(1),
  requires_specialist_follow_up: z.boolean().default(false),
  source_domain: z.enum(['public_policy', 'acme_operations']).optional(),
  trigger_conditions: z.record(z.unknown()).optional(),
});

export const WordingTemplateContentSchema = z.object({
  code: z.string().min(1),
  context_code: z.string().min(1),
  tone_type: z.string().min(1),
  text: z.string().min(1),
  applicable_contexts: z.array(z.string()).optional(),
  prohibited_use_notes: z.string().optional(),
});

export const WarningContentSchema = z.object({
  code: z.string().min(1),
  severity: z.enum(['informational', 'caution', 'high_risk']),
  message: z.string().min(1),
  applicable_contexts: z.array(z.string()).optional(),
});

export type GuidanceCardContent = z.infer<typeof GuidanceCardContentSchema>;
export type SupportOptionContent = z.infer<typeof SupportOptionContentSchema>;
export type WarningContent = z.infer<typeof WarningContentSchema>;
export type WordingTemplateContent = z.infer<typeof WordingTemplateContentSchema>;
