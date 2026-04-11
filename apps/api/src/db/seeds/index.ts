// Seed entry point.
// Run via: pnpm --filter @ctcc/api db:seed
//
// Execution order matters — foreign-key dependencies must be seeded first:
//   1. workflow_versions, content_versions, prompt_versions
//   2. enquiry_types
//   3. question_step_definitions
//   4. guidance_cards (public_policy then acme_operations)
//   5. support_options
//   6. agents
//   7. residents / scenarios
//
// Seed data is sourced from packages/workflow-config and packages/content-bundles.
// Do NOT hard-code business rules or content here — import from those packages.

import { db } from '../client.js';

async function main(): Promise<void> {
  // TODO (Step 3): implement seed runners in order above
  console.log('Seed placeholder — no-op until Step 3 seed runners are implemented.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
