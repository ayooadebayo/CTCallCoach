// Workflow engine input and output types
// Source: docs/council_tax_call_coach_domain_model_and_data_schema_v_0.md §10
//         docs/council_tax_call_coach_workflow_specification_v_0.md §4
//         docs/council_tax_call_coach_technical_prd_v_0.md §10

import type {
  EnquiryTypeCode,
  SessionStage,
  ClassificationStatus,
  QuestionType,
} from '../domain/index.js';

export interface WorkflowEngineInput {
  callSessionId: string;
  residentContext: Record<string, unknown>;
  scenarioContext: Record<string, unknown>;
  capturedFacts: CapturedFact[];
  intentSignals: WorkflowIntentSignal[];
  vulnerabilitySignals: string[];
  currentClassification: EnquiryTypeCode | null;
  currentStage: SessionStage;
  workflowVersionId: string;
}

export interface WorkflowEngineOutput {
  primaryPath: EnquiryTypeCode | null;
  overlayPaths: EnquiryTypeCode[];
  nextRequiredQuestion: WorkflowQuestion | null;
  optionalClarifiers: WorkflowQuestion[];
  supportOptions: string[];
  escalationFlags: WorkflowEscalationFlag[];
  warnings: WorkflowWarning[];
  trace: WorkflowTrace;
  classificationStatus: ClassificationStatus;
  allowedOutcomes: string[];
}

export interface WorkflowQuestion {
  code: string;
  stage: SessionStage;
  question_text: string;
  question_type: QuestionType;
  mandatory: boolean;
  why_it_matters_text?: string;
  sensitivity_warning?: string;
  answer_options?: string[];
}

export interface WorkflowEscalationFlag {
  code: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  trigger_facts: string[];
}

export interface WorkflowWarning {
  code: string;
  severity: 'informational' | 'caution' | 'high_risk';
  message: string;
}

export interface WorkflowTrace {
  decisions: WorkflowDecision[];
  workflow_version_id: string;
  evaluated_at: string;
}

export interface WorkflowDecision {
  rule_code: string;
  decision_type: string;
  triggered: boolean;
  trigger_facts: string[];
  result: string;
  explanation: string;
}

export interface CapturedFact {
  question_code: string;
  fact_key: string;
  value: unknown;
  source: string;
  confidence: 'low' | 'medium' | 'high';
}

export interface WorkflowIntentSignal {
  signal_type: string;
  signal_value: string;
  source: string;
  confidence: 'low' | 'medium' | 'high';
}

// Session state shape for the frontend
export interface SessionState {
  sessionId: string;
  currentStage: SessionStage;
  currentClassification: EnquiryTypeCode | null;
  classificationStatus: ClassificationStatus;
  currentPrimaryPath: EnquiryTypeCode | null;
  activeOverlays: EnquiryTypeCode[];
  capturedFacts: CapturedFact[];
  vulnerabilitySignals: string[];
  surfacedGuidanceCardIds: string[];
  surfacedSupportOptionIds: string[];
  activeEscalationFlags: WorkflowEscalationFlag[];
  activeWarnings: WorkflowWarning[];
  lastTrace: WorkflowTrace | null;
}
