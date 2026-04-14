import type { PathRule } from '@ctcc/shared-schemas';
import type { EnquiryTypeConfig, QuestionStepConfig, ClassificationRule, SupportTriggerRule, EscalationTriggerRule, OutcomeRule } from '@ctcc/shared-schemas';
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
/**
 * Load a named version of the workflow config.
 * Results are cached after first load. Pass force=true to invalidate.
 * Throws if the version is unknown or any file fails validation.
 */
export declare function loadWorkflowConfig(version: string, force?: boolean): WorkflowConfigBundle;
//# sourceMappingURL=loader.d.ts.map