// @ctcc/content-bundles
// Typed, validated loader for versioned guidance content, wording templates, and warnings.
//
// PRIMARY RULE: Public policy content and Acme operational content must ALWAYS
// be retrieved and handled as distinct sets. See .cursor/rules/content-separation-rules.mdc.
//
// Primary usage (guidance service, workflow engine):
//   import { loadContentBundle } from '@ctcc/content-bundles';
//   const bundle = loadContentBundle('v1');
//   // bundle.guidance_cards.public_policy   ← public policy cards
//   // bundle.guidance_cards.acme_operations ← Acme operational cards
//
// Direct v1 usage (seeds, scripts):
//   import { loadV1ContentBundle } from '@ctcc/content-bundles';
//   const { publicPolicyGuidanceCards, acmeOperationsGuidanceCards } = loadV1ContentBundle();

export { loadContentBundle, type ContentBundle } from './loader.js';
export { loadV1ContentBundle, type V1ContentBundle } from './loaders/v1.js';

export const CURRENT_VERSION = 'v1' as const;
