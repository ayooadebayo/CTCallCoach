// Seed: guidance_cards
// Source: packages/content-bundles/src/versions/v1/{public-policy,acme-operations}/guidance-cards.json
// Upserts by (code, content_version_id) — idempotent.

import { Prisma } from '@prisma/client';
import { db } from '../client.js';
import { loadV1ContentBundle } from '@ctcc/content-bundles';

export async function seedGuidanceCards(contentVersionId: string): Promise<void> {
  const { publicPolicyGuidanceCards, acmeOperationsGuidanceCards } = loadV1ContentBundle();

  const allCards = [...publicPolicyGuidanceCards, ...acmeOperationsGuidanceCards];

  for (const card of allCards) {
    // Prisma Json? fields require Prisma.JsonNull (not JS null/undefined) when absent.
    const contextsJson: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue =
      card.applicable_contexts !== undefined
        ? (card.applicable_contexts as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull;

    await db.guidanceCard.upsert({
      where: {
        code_content_version_id: {
          code: card.code,
          content_version_id: contentVersionId,
        },
      },
      update: {
        title: card.title,
        summary: card.summary,
        source_domain: card.source_domain,
        body_markdown: card.body_markdown ?? null,
        do_say_text: card.do_say_text ?? null,
        do_not_say_text: card.do_not_say_text ?? null,
        warning_text: card.warning_text ?? null,
        applicable_contexts_json: contextsJson,
        tags: card.tags ?? [],
        status: 'active',
      },
      create: {
        code: card.code,
        title: card.title,
        summary: card.summary,
        source_domain: card.source_domain,
        body_markdown: card.body_markdown ?? null,
        do_say_text: card.do_say_text ?? null,
        do_not_say_text: card.do_not_say_text ?? null,
        warning_text: card.warning_text ?? null,
        applicable_contexts_json: contextsJson,
        tags: card.tags ?? [],
        status: 'active',
        content_version_id: contentVersionId,
      },
    });
  }

  console.log(`  ✓ ${publicPolicyGuidanceCards.length} public_policy guidance cards`);
  console.log(`  ✓ ${acmeOperationsGuidanceCards.length} acme_operations guidance cards`);
}
