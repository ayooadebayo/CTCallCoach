// @ctcc/content-bundles
//
// Loads versioned content bundles: guidance cards, support options, wording templates.
//
// IMPORTANT: Public policy content and Acme operational content are stored separately
// and must NEVER be combined into a single undifferentiated source.
//
// Source domains:
//   - public_policy: guidance grounded in publicly available UK council tax guidance principles
//   - acme_operations: fictional Acme City Council internal handling instructions
//
// See docs/council_tax_call_coach_technical_prd_v_0.md §11 for content architecture.

export * from './loader.js';

export const CURRENT_VERSION = 'v1';
