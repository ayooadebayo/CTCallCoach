// API request and response envelope types shared between web and api
// These wrap the domain types for the HTTP layer.

export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}

// Session creation
export interface CreateSessionRequest {
  agent_id: string;
  scenario_id?: string;
  session_mode: string;
}

// Workflow step submission
export interface SubmitResponseRequest {
  call_session_id: string;
  question_code: string;
  response_status: string;
  answer_text?: string;
  answer_boolean?: boolean;
  answer_number?: number;
  answer_json?: Record<string, unknown>;
  source: string;
}

// Classification
export interface ClassifyRequest {
  call_session_id: string;
  intent_signals: Array<{ type: string; value: string }>;
  intake_reason_code: string;
}
