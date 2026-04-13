import { z } from 'zod';

export const WrapUpSummarySchema = z.object({
  summary_text: z.string().max(600),
  suggested_next_step: z.string().max(200),
  flags: z.array(z.string()).max(3),
});

export type WrapUpSummary = z.infer<typeof WrapUpSummarySchema>;
