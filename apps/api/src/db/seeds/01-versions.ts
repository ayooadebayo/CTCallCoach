// Seed: workflow_versions, content_versions, prompt_versions
// Must run first — all session-scoped entities reference one of these three IDs.

import { db } from '../client.js';
import type { WorkflowVersion, ContentVersion, PromptVersion } from '@prisma/client';

export interface SeededVersions {
  workflowVersion: WorkflowVersion;
  contentVersion: ContentVersion;
  promptVersion: PromptVersion;
}

export async function seedVersions(): Promise<SeededVersions> {
  const publishedAt = new Date('2026-01-01T00:00:00Z');

  const workflowVersion = await db.workflowVersion.upsert({
    where: { version_label: 'v1' },
    update: {},
    create: {
      version_label: 'v1',
      status: 'active',
      description: 'Initial MVP workflow configuration — payment difficulty and arrears handling',
      change_summary:
        '8 enquiry types (PD1-PD8), 13 question steps, 8 classification rules, ' +
        '5 path rules, 5 support trigger rules, 4 escalation trigger rules, 8 outcome rules',
      published_at: publishedAt,
    },
  });

  const contentVersion = await db.contentVersion.upsert({
    where: { version_label: 'v1' },
    update: {},
    create: {
      version_label: 'v1',
      status: 'active',
      description:
        'Initial MVP content bundle — public policy guidance and Acme operations guidance',
      change_summary:
        '5 public_policy guidance cards, 4 acme_operations guidance cards, ' +
        '5 support options, 7 wording templates, 6 warnings',
      published_at: publishedAt,
    },
  });

  const promptVersion = await db.promptVersion.upsert({
    where: { version_label: 'v1' },
    update: {},
    create: {
      version_label: 'v1',
      status: 'active',
      description: 'Placeholder prompt version — AI layer is partially active',
      change_summary: 'Placeholder. No prompt tasks wired yet.',
      published_at: publishedAt,
    },
  });

  console.log(`  ✓ WorkflowVersion v1 (${workflowVersion.id})`);
  console.log(`  ✓ ContentVersion v1  (${contentVersion.id})`);
  console.log(`  ✓ PromptVersion v1   (${promptVersion.id})`);

  return { workflowVersion, contentVersion, promptVersion };
}
