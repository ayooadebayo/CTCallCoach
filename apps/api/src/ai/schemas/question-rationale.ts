import { z } from 'zod';

export const QuestionRationaleSchema = z.object({
  rationale: z.string().max(150),
  learning_tip: z.string().max(180),
});

export type QuestionRationale = z.infer<typeof QuestionRationaleSchema>;
