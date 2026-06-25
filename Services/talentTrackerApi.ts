const API_BASE_URL = "https://playground.4geeks.com/tracker/api/v1";

export type CandidateStatus = "received" | "in_progress" | "selected" | "discarded";
export type CandidateStage =
  | "pending"
  | "review"
  | "personal_interview"
  | "technical_interview"
  | "offer_presented";

export interface CandidateRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number;
  notes_count: number;
  applied_at: string;
  updated_at: string;
}

interface ListRecordsResponse {
  total: number;
  page: number;
  limit: number;
  data: CandidateRecord[];
}

export interface ListRecordsParams {
  status?: CandidateStatus;
  stage?: CandidateStage;
  search?: string;
  page?: number;
  limit?: number;
}

export const STATUS_LABELS: Record<CandidateStatus, string> = {
  received: "Recibida",
  in_progress: "En proceso",
  selected: "Seleccionada",
  discarded: "Descartada",
};

export const STAGE_LABELS: Record<CandidateStage, string> = {
  pending: "Pendiente de revision",
  review: "En revision",
  personal_interview: "Entrevista personal",
  technical_interview: "Entrevista tecnica",
  offer_presented: "Oferta presentada",
};

export class ApiError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

function buildQueryParams(params: ListRecordsParams): string {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.stage) {
    searchParams.set("stage", params.stage);
  }

  if (params.search && params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }

  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 100));

  return searchParams.toString();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;

    try {
      const errorBody = (await response.json()) as { detail?: unknown };
      if (typeof errorBody.detail === "string") {
        errorMessage = errorBody.detail;
      }
    } catch {
      // Keep fallback status based message when response body is not JSON.
    }

    throw new ApiError(errorMessage, response.status);
  }

  return (await response.json()) as T;
}

export async function listCandidateRecords(
  params: ListRecordsParams = {},
): Promise<ListRecordsResponse> {
  const query = buildQueryParams(params);
  const path = query ? `/records?${query}` : "/records";

  return request<ListRecordsResponse>(path);
}
