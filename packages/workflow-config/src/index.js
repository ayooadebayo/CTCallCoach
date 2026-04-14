// @ctcc/workflow-config
// Typed, validated loader for the versioned workflow rule definitions.
//
// Primary usage (workflow engine):
//   import { loadWorkflowConfig } from '@ctcc/workflow-config';
//   const config = loadWorkflowConfig('v1');  // config.enquiry_types, .classification_rules, ...
//
// Direct v1 usage (seeds, scripts):
//   import { loadV1WorkflowConfig } from '@ctcc/workflow-config';
//   const { enquiryTypes, escalationRules } = loadV1WorkflowConfig();
//
// All JSON files are validated against @ctcc/shared-schemas on first load.
// Results are cached — pass force=true to reload.
export { loadWorkflowConfig } from './loader.js';
export { loadV1WorkflowConfig } from './loaders/v1.js';
export const CURRENT_VERSION = 'v1';
//# sourceMappingURL=index.js.map