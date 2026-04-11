// @ctcc/shared-types — canonical TypeScript types for Council Tax Call Coach
//
// All domain types, workflow output types, analytics event types, and AI task types
// live here and are shared between apps/web and apps/api.
//
// Source of truth: docs/council_tax_call_coach_domain_model_and_data_schema_v_0.md
//
// Do NOT define types separately in apps/web or apps/api — import from here.

export * from './domain/index.js';
export * from './workflow/index.js';
export * from './analytics/index.js';
export * from './ai/index.js';
export * from './api/index.js';
