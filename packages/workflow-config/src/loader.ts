// Workflow config general loader
// Provides a version-agnostic loadWorkflowConfig(version) API for the workflow engine.
// Validation is delegated to the version-specific loader which uses fs + Zod.
//
// Add future version loaders alongside v1 and extend the switch below.

import { loadV1WorkflowConfig, type V1WorkflowConfig } from './loaders/v1.js';
import type { PathRule } from '@ctcc/shared-schemas';
import type {
  EnquiryTypeConfig,
  QuestionStepConfig,
  ClassificationRule,
  SupportTriggerRule,
  EscalationTriggerRule,
  OutcomeRule,
} from '@ctcc/shared-schemas';

export interface WorkflowConfigBundle {
  version: string;
  enquiry_types: EnquiryTypeConfig[];
  question_steps: QuestionStepConfig[];
  classification_rules: ClassificationRule[];
  path_rules: PathRule[];
  support_rules: SupportTriggerRule[];
  escalation_rules: EscalationTriggerRule[];
  outcome_rules: OutcomeRule[];
}

function toBundle(version: string, cfg: V1WorkflowConfig): WorkflowConfigBundle {
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
export function loadWorkflowConfig(version: string, force = false): WorkflowConfigBundle {
  switch (version) {
    case 'v1':
      return toBundle('v1', loadV1WorkflowConfig(force));
    default:
      throw new Error(`Unknown workflow config version: "${version}". Supported: v1`);
  }
}
