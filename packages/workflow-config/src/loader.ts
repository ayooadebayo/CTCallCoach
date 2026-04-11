// Workflow config loader — loads and validates a versioned config bundle.
// The workflow engine calls this on startup to load the active version.

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
  path_rules: Record<string, unknown>[];
  support_rules: SupportTriggerRule[];
  escalation_rules: EscalationTriggerRule[];
  outcome_rules: OutcomeRule[];
}

export async function loadWorkflowConfig(version: string): Promise<WorkflowConfigBundle> {
  // Dynamic import of JSON config files for the requested version.
  // Validation via shared-schemas happens here before returning.
  const [
    enquiryTypes,
    questionSteps,
    classificationRules,
    pathRules,
    supportRules,
    escalationRules,
    outcomeRules,
  ] = await Promise.all([
    import(`./versions/${version}/enquiry-types.json`, { assert: { type: 'json' } }),
    import(`./versions/${version}/question-steps.json`, { assert: { type: 'json' } }),
    import(`./versions/${version}/classification-rules.json`, { assert: { type: 'json' } }),
    import(`./versions/${version}/path-rules.json`, { assert: { type: 'json' } }),
    import(`./versions/${version}/support-rules.json`, { assert: { type: 'json' } }),
    import(`./versions/${version}/escalation-rules.json`, { assert: { type: 'json' } }),
    import(`./versions/${version}/outcome-rules.json`, { assert: { type: 'json' } }),
  ]);

  return {
    version,
    enquiry_types: enquiryTypes.default as EnquiryTypeConfig[],
    question_steps: questionSteps.default as QuestionStepConfig[],
    classification_rules: classificationRules.default as ClassificationRule[],
    path_rules: pathRules.default as Record<string, unknown>[],
    support_rules: supportRules.default as SupportTriggerRule[],
    escalation_rules: escalationRules.default as EscalationTriggerRule[],
    outcome_rules: outcomeRules.default as OutcomeRule[],
  };
}
