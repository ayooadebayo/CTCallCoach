// @ctcc/shared-schemas — Zod validation schemas for Council Tax Call Coach
//
// These schemas mirror the types in @ctcc/shared-types.
// Used to validate API payloads, workflow config files, AI outputs, and analytics events.
//
// Rule: do not create ad hoc inline schemas in apps/web or apps/api —
// import from here to ensure consistency.

export * from './api/index.js';
export * from './workflow/index.js';
export * from './analytics/index.js';
export * from './ai/index.js';
export * from './content/index.js';
