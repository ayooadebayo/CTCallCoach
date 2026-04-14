// Workflow config general loader
// Provides a version-agnostic loadWorkflowConfig(version) API for the workflow engine.
// Validation is delegated to the version-specific loader which uses fs + Zod.
//
// Add future version loaders alongside v1 and extend the switch below.
import { loadV1WorkflowConfig } from './loaders/v1.js';
function toBundle(version, cfg) {
    return {
        version,
        enquiry_types: cfg.enquiryTypes,
        question_steps: cfg.questionSteps,
        classification_rules: cfg.classificationRules,
        path_rules: cfg.pathRules,
        support_rules: cfg.supportRules,
        escalation_rules: cfg.escalationRules,
        outcome_rules: cfg.outcomeRules,
    };
}
/**
 * Load a named version of the workflow config.
 * Results are cached after first load. Pass force=true to invalidate.
 * Throws if the version is unknown or any file fails validation.
 */
export function loadWorkflowConfig(version, force = false) {
    switch (version) {
        case 'v1':
            return toBundle('v1', loadV1WorkflowConfig(force));
        default:
            throw new Error(`Unknown workflow config version: "${version}". Supported: v1`);
    }
}
//# sourceMappingURL=loader.js.map