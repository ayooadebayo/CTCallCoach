// Seed: suggested_wording (curated templates)
// Source: packages/content-bundles/src/versions/v1/wording/templates.json
// Upserts by code — idempotent.
// These are the canonical curated templates. Session-specific wording is created at runtime.

import { db } from '../client.js';
import { loadV1ContentBundle } from '@ctcc/content-bundles';

export async function seedWordingTemplates(contentVersionId: string): Promise<void> {
  const { wordingTemplates } = loadV1ContentBundle();

  for (const wt of wordingTemplates) {
    await db.suggestedWording.upsert({
      where: { code: wt.code },
      update: {
        context_code: wt.context_code,
        tone_type: wt.tone_type,
        text: wt.text,
        source_type: 'curated',
        status: 'active',
        prohibited_use_notes: wt.prohibited_use_notes ?? null,
        applicable_contexts_json: wt.applicable_contexts ?? null,
        content_version_id: contentVersionId,
      },
      create: {
        code: wt.code,
        context_code: wt.context_code,
        tone_type: wt.tone_type,
        text: wt.text,
        source_type: 'curated',
        status: 'active',
        prohibited_use_notes: wt.prohibited_use_notes ?? null,
        applicable_contexts_json: wt.applicable_contexts ?? null,
        content_version_id: contentVersionId,
      },
    });
  }

  console.log(`  ✓ ${wordingTemplates.length} curated wording templates`);
}
