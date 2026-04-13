import { getOpenAIClient, isOpenAIAvailable } from '../clients/openai.js';
import { SYSTEM_PROMPT } from '../system/system-prompt.js';
import { QuestionRationaleSchema } from '../schemas/question-rationale.js';
import type { QuestionRationale } from '../schemas/question-rationale.js';

export async function getQuestionRationale(
  questionCode: string,
  questionText: string,
  primaryPath: string | null,
): Promise<QuestionRationale | null> {
  if (!isOpenAIAvailable()) return null;

  try {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `The agent is being asked: "${questionText}" (code: ${questionCode}). \
Current call classification: ${primaryPath ?? 'not yet determined'}. \
Return JSON with two fields: "rationale" (why this question matters right now, \
max 150 chars) and "learning_tip" (one practical tip for the agent, max 180 chars).`,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return null;

    const parsed = QuestionRationaleSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
