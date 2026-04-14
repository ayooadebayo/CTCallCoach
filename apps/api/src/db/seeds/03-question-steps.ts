// Seed: question_step_definitions
// Source: packages/workflow-config/src/versions/v1/question-steps.json
// Upserts by (code, workflow_version_id) — idempotent.

import { Prisma } from '@prisma/client';
import { db } from '../client.js';
import { loadV1WorkflowConfig } from '@ctcc/workflow-config';

export async function seedQuestionSteps(workflowVersionId: string): Promise<void> {
  const { questionSteps } = loadV1WorkflowConfig();

  for (const qs of questionSteps) {
    // Prisma Json? fields require Prisma.JsonNull (not JS null/undefined) when absent.
    const answerOptionsJson: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue =
      qs.answer_options !== undefined
        ? (qs.answer_options as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull;

    await db.questionStepDefinition.upsert({
      where: {
        code_workflow_version_id: {
          code: qs.code,
          workflow_version_id: workflowVersionId,
        },
      },
      update: {
        stage: qs.stage,
        question_text: qs.question_text,
        question_type: qs.question_type,
        mandatory: qs.mandatory,
        why_it_matters_text: qs.why_it_matters_text ?? null,
        sensitivity_warning: qs.sensitivity_warning ?? null,
        answer_options_json: answerOptionsJson,
        sort_order: qs.sort_order ?? null,
        active: true,
      },
      create: {
        code: qs.code,
        stage: qs.stage,
        question_text: qs.question_text,
        question_type: qs.question_type,
        mandatory: qs.mandatory,
        active: true,
        why_it_matters_text: qs.why_it_matters_text ?? null,
        sensitivity_warning: qs.sensitivity_warning ?? null,
        answer_options_json: answerOptionsJson,
        sort_order: qs.sort_order ?? null,
        workflow_version_id: workflowVersionId,
      },
    });
  }

  console.log(`  ✓ ${questionSteps.length} question step definitions`);
}
