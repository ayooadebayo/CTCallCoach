// Typed API client — all requests go through /api which Vite proxies to localhost:3001.
// No business logic here; just HTTP I/O with typed inputs/outputs.

import type { WorkflowEngineOutput } from '@ctcc/shared-types';

const BASE = '/api';

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const init: RequestInit =
    body !== undefined
      ? { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      : { method };
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

export interface ScenarioSummary {
  id: string;
  title: string;
  description: string;
  scenario_type: string;
  expected_primary_path: string;
  difficulty_level: number | null;
  tags: string[] | null;
}

export function listScenarios(): Promise<ScenarioSummary[]> {
  return request<{ scenarios: ScenarioSummary[] }>('GET', '/scenarios').then(
    (r) => r.scenarios,
  );
}

// ─── Agents ───────────────────────────────────────────────────────────────────

export interface AgentSummary {
  id: string;
  display_name: string;
  role: string;
  team: string;
  skill_level: number;
}

export function listAgents(): Promise<AgentSummary[]> {
  return request('GET', '/agents');
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export interface CreateSessionBody {
  agent_id: string;
  scenario_id?: string;
  session_mode: 'demo_guided' | 'scenario_replay' | 'manual_test' | 'future_live_call';
}

export interface SessionCreatedResponse {
  session: { id: string; stage: string };
  workflow: WorkflowEngineOutput;
}

export function createSession(body: CreateSessionBody): Promise<SessionCreatedResponse> {
  return request('POST', '/sessions', body);
}

export interface SessionDetailResponse {
  session: {
    id: string;
    stage: string;
    classification_status: string;
    current_path_code: string | null;
    overlay_path_codes_json: string[];
    scenario: { title: string; expected_primary_path: string } | null;
    resident: { display_label: string };
    agent: { id: string; display_name: string; role: string };
  };
  workflow: WorkflowEngineOutput;
}

export function getSession(id: string): Promise<SessionDetailResponse> {
  return request('GET', `/sessions/${id}`);
}

export function advanceStage(id: string, stage: string): Promise<{ id: string; stage: string }> {
  return request('PATCH', `/sessions/${id}/stage`, { stage });
}

export function closeSession(id: string): Promise<unknown> {
  return request('POST', `/sessions/${id}/close`, {});
}

// ─── Workflow ─────────────────────────────────────────────────────────────────

export interface SubmitResponseBody {
  call_session_id: string;
  question_code: string;
  response_status: 'answered' | 'skipped' | 'not_applicable';
  answer_text?: string;
  answer_boolean?: boolean;
  answer_number?: number;
  source: 'agent_input' | 'scenario_seed';
}

export interface SubmitResponseResult {
  response_id: string;
  workflow: WorkflowEngineOutput;
}

export function submitResponse(body: SubmitResponseBody): Promise<SubmitResponseResult> {
  return request('POST', '/workflow/respond', body);
}

export interface WorkflowNextResponse {
  current_stage: string;
  primary_path: string | null;
  overlay_paths: string[];
  classification_status: string;
  next_required_question: WorkflowEngineOutput['nextRequiredQuestion'];
  optional_clarifiers: WorkflowEngineOutput['optionalClarifiers'];
  support_options: string[];
  escalation_flags: WorkflowEngineOutput['escalationFlags'];
  warnings: WorkflowEngineOutput['warnings'];
  allowed_outcomes: string[];
}

export function getWorkflowNext(sessionId: string): Promise<WorkflowNextResponse> {
  return request('GET', `/workflow/${sessionId}/next`);
}

// ─── Support options ─────────────────────────────────────────────────────────

export interface ResolvedSupportOption {
  code: string;
  label: string;
  category: string;
  resident_explanation: string;
  internal_handling_note: string;
  requires_specialist_follow_up: boolean;
  source_domain?: 'public_policy' | 'acme_operations';
}

export interface SupportOptionsResponse {
  support_options: ResolvedSupportOption[];
}

export function getSupportOptions(sessionId: string): Promise<SupportOptionsResponse> {
  return request('GET', `/support/${sessionId}/options`);
}

// ─── Guidance ─────────────────────────────────────────────────────────────────

export interface GuidanceCard {
  code: string;
  title: string;
  summary: string;
  source_domain: 'public_policy' | 'acme_operations';
  body_markdown?: string;
  do_say_text?: string;
  do_not_say_text?: string;
  warning_text?: string;
}

export interface GuidanceResponse {
  public_policy: GuidanceCard[];
  acme_operations: GuidanceCard[];
}

export function getGuidance(paths: string[]): Promise<GuidanceResponse> {
  const qs = paths.map((p) => `path=${encodeURIComponent(p)}`).join('&');
  return request('GET', `/guidance?${qs}`);
}

// ─── AI assistance ───────────────────────────────────────────────────────────

export interface QuestionRationaleResponse {
  rationale: string | null;
  learning_tip: string | null;
}

export function getQuestionRationale(
  questionCode: string,
  sessionId: string,
): Promise<QuestionRationaleResponse> {
  return request(
    'GET',
    `/ai/question-rationale?question_code=${encodeURIComponent(questionCode)}&session_id=${encodeURIComponent(sessionId)}`,
  );
}

export interface WrapUpSummaryResponse {
  summary_text: string;
  suggested_next_step: string;
  flags: string[];
  source: 'ai' | 'template';
}

export function generateWrapUpSummary(sessionId: string): Promise<WrapUpSummaryResponse> {
  return request('POST', '/ai/wrapup-summary', { call_session_id: sessionId });
}

export interface CoachingFeedbackResponse {
  well_handled: string[] | null;
  could_improve: string[] | null;
  learning_recommendation: string | null;
}

export function getCoachingFeedback(sessionId: string): Promise<CoachingFeedbackResponse> {
  return request('GET', `/ai/coaching/${encodeURIComponent(sessionId)}`);
}

// ─── Wrap-up ──────────────────────────────────────────────────────────────────

export interface WrapUpBody {
  call_session_id: string;
  primary_outcome_code: string;
  owner_next_step: string;
  case_note_text: string;
}

export interface WrapUpResult {
  outcome_id: string;
  note_id: string;
}

export function submitWrapUp(body: WrapUpBody): Promise<WrapUpResult> {
  return request('POST', '/wrapup', body);
}

export interface WrapUpDetailResponse {
  session: {
    id: string;
    stage: string;
    current_path_code: string | null;
    overlay_path_codes_json: string[];
    classification_status: string;
    ended_at: string | null;
    scenario: { title: string; expected_primary_path: string } | null;
    resident: { display_label: string };
  };
  outcome: {
    id: string;
    primary_outcome_code: string;
    disposition: string;
    owner_next_step: string;
  } | null;
  note: {
    id: string;
    summary_text: string;
    status: string;
  } | null;
}

export function getWrapUpDetail(sessionId: string): Promise<WrapUpDetailResponse> {
  return request('GET', `/wrapup/${sessionId}`);
}
