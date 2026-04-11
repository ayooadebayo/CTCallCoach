// Seed: question_step_definitions
// Source: packages/workflow-config/src/versions/v1/question-steps.json
// Upserts by (code, workflow_version_id) — idempotent.

import { db } from '../client.js';
import { loadV1WorkflowConfig } from '@ctcc/workflow-config';

export async function seedQuestionSteps(workflowVersionId: string): Promise<void> {
  const { questionSteps } = loadV1WorkflowConfig();

  for (const qs of questionSteps) {
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
        answer_options_json: qs.answer_options ?? null,
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
        answer_options_json: qs.answer_options ?? null,
        sort_order: qs.sort_order ?? null,
        workflow_version_id: workflowVersionId,
      },
    });
  }

  console.log(`  ✓ ${questionSteps.length} question step definitions`);
}
