import { z } from 'zod';

export const CoachingFeedbackSchema = z.object({
  well_handled: z.array(z.string()).max(2),
  could_improve: z.array(z.string()).max(2),
  learning_recommendation: z.string().max(250),
});

export type CoachingFeedback = z.infer<typeof CoachingFeedbackSchema>;
