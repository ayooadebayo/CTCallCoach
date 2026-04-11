// Seed entry point — CTCallCoach database initialisation
// Run via: pnpm --filter @ctcc/api db:seed
// Or via root convenience alias: pnpm db:setup (also builds packages and runs migration)
//
// Execution order (FK dependency chain):
//   1. workflow_versions, content_versions, prompt_versions  ← must come first
//   2. enquiry_types                                         ← no FK deps
//   3. question_step_definitions                             ← references workflow_version
//   4. guidance_cards                                        ← references content_version
//   5. support_options                                       ← no FK deps
//   6. suggested_wording (curated templates)                 ← references content_version
//   7. agents                                                ← no FK deps
//   8. residents                                             ← no FK deps
//   9. scenarios                                             ← no FK deps (resident link is optional)
//
// Escalation definitions: loaded from workflow-config JSON at runtime by the workflow engine.
// No DB table for escalation rule definitions — the engine evaluates them per-session.
//
// All runners are idempotent — safe to re-run.

import { db } from '../client.js';
import { loadV1WorkflowConfig } from '@ctcc/workflow-config';

import { seedVersions } from './01-versions.js';
import { seedEnquiryTypes } from './02-enquiry-types.js';
import { seedQuestionSteps } from './03-question-steps.js';
import { seedGuidanceCards } from './04-guidance-cards.js';
import { seedSupportOptions } from './05-support-options.js';
import { seedWordingTemplates } from './06-wording-templates.js';
import { seedAgents } from './07-agents.js';
import { seedResidents } from './08-residents.js';
import { seedScenarios } from './09-scenarios.js';

async function main(): Promise<void> {
  console.log('▶ CTCallCoach seed starting...\n');

  // Pre-flight: validate all config and content files before touching the DB.
  // loadV1WorkflowConfig() throws if any JSON file fails Zod validation.
  const { escalationRules } = loadV1WorkflowConfig();
  console.log(
    `  ✓ Workflow config validated (${escalationRules.length} escalation rules ready for runtime)\n`,
  );

  console.log('[1/9] Version records');
  const { workflowVersion, contentVersion } = await seedVersions();

  console.log('\n[2/9] Enquiry types');
  await seedEnquiryTypes();

  console.log('\n[3/9] Question step definitions');
  await seedQuestionSteps(workflowVersion.id);

  console.log('\n[4/9] Guidance cards');
  await seedGuidanceCards(contentVersion.id);

  console.log('\n[5/9] Support options');
  await seedSupportOptions();

  console.log('\n[6/9] Wording templates');
  await seedWordingTemplates(contentVersion.id);

  console.log('\n[7/9] Demo agents');
  await seedAgents();

  console.log('\n[8/9] Synthetic residents');
  const { ids: residentIds } = await seedResidents();

  console.log('\n[9/9] Demo scenarios');
  await seedScenarios(residentIds);

  console.log('\n✅ Seed complete.\n');
}

main()
  .catch((err: unknown) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
