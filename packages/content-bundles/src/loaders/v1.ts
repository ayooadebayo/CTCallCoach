// Content bundle v1 loader
// Reads JSON content files from src/versions/v1/, validates with Zod schemas, returns typed bundle.
//
// Path resolution is correct from both src/loaders/ (source) and dist/loaders/ (compiled).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import type { ZodType } from 'zod';
import {
  GuidanceCardContentSchema,
  SupportOptionContentSchema,
  WordingTemplateContentSchema,
  WarningContentSchema,
  type GuidanceCardContent,
  type SupportOptionContent,
  type WordingTemplateContent,
  type WarningContent,
} from '@ctcc/shared-schemas';

const _dir = dirname(fileURLToPath(import.meta.url));
// Goes up two levels from {src|dist}/loaders/ to package root, then into src/versions/v1/
const V1_DIR = join(_dir, '../../src/versions/v1');

function loadAndValidate<T>(relPath: string, schema: ZodType<T>): T {
  const raw: unknown = JSON.parse(readFileSync(join(V1_DIR, relPath), 'utf-8'));
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Content bundle validation failed for ${relPath}:\n${result.error.toString()}`,
    );
  }
  return result.data;
}

export interface V1ContentBundle {
  publicPolicyGuidanceCards: GuidanceCardContent[];
  acmeOperationsGuidanceCards: GuidanceCardContent[];
  supportOptions: SupportOptionContent[];
  wordingTemplates: WordingTemplateContent[];
  warnings: WarningContent[];
}

let _cache: V1ContentBundle | null = null;

/**
 * Load and validate the v1 content bundle from JSON files.
 * Results are cached after the first call; pass force=true to reload.
 * Throws if any file fails Zod validation.
 * Public policy and Acme operations cards are kept as separate arrays.
 */
export function loadV1ContentBundle(force = false): V1ContentBundle {
  if (_cache !== null && !force) return _cache;

  _cache = {
    publicPolicyGuidanceCards: loadAndValidate(
      'public-policy/guidance-cards.json',
      GuidanceCardContentSchema.array(),
    ),
    acmeOperationsGuidanceCards: loadAndValidate(
      'acme-operations/guidance-cards.json',
      GuidanceCardContentSchema.array(),
    ),
    supportOptions: loadAndValidate(
      'support-options/catalog.json',
      SupportOptionContentSchema.array(),
    ),
    wordingTemplates: loadAndValidate(
      'wording/templates.json',
      WordingTemplateContentSchema.array(),
    ),
    warnings: loadAndValidate('warnings/catalog.json', WarningContentSchema.array()),
  };

  return _cache;
}
