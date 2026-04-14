// Seed: support_options
// Source: packages/content-bundles/src/versions/v1/support-options/catalog.json
// Upserts by code — idempotent.

import { Prisma } from '@prisma/client';
import { db } from '../client.js';
import { loadV1ContentBundle } from '@ctcc/content-bundles';

export async function seedSupportOptions(): Promise<void> {
  const { supportOptions } = loadV1ContentBundle();

  for (const so of supportOptions) {
    // Prisma Json? fields require Prisma.JsonNull (not JS null/undefined) when absent.
    const triggerJson: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue =
      so.trigger_conditions !== undefined
        ? (so.trigger_conditions as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull;

    await db.supportOption.upsert({
      where: { code: so.code },
      update: {
        label: so.label,
        category: so.category,
        resident_explanation: so.resident_explanation,
        internal_handling_note: so.internal_handling_note,
        requires_specialist_follow_up: so.requires_specialist_follow_up,
        source_domain: so.source_domain ?? null,
        trigger_conditions_json: triggerJson,
        status: 'active',
      },
      create: {
        code: so.code,
        label: so.label,
        category: so.category,
        resident_explanation: so.resident_explanation,
        internal_handling_note: so.internal_handling_note,
        requires_specialist_follow_up: so.requires_specialist_follow_up,
        source_domain: so.source_domain ?? null,
        trigger_conditions_json: triggerJson,
        status: 'active',
      },
    });
  }

  console.log(`  ✓ ${supportOptions.length} support options`);
}
