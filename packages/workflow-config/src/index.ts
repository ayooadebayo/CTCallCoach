// @ctcc/workflow-config
//
// Loads and validates versioned workflow configuration.
// The active version is determined at runtime by the workflow engine.
//
// Usage:
//   import { loadWorkflowConfig } from '@ctcc/workflow-config';
//   const config = await loadWorkflowConfig('v1');

export * from './loader.js';

export const CURRENT_VERSION = 'v1';
