import { tokenStore } from './token';

// Empty by default so requests go through the CRA dev proxy (see "proxy" in package.json).
const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/** ASP.NET validation errors, keyed by property name (e.g. { Title: ['...'] }). */
export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldErrors;

  constructor(message: string, status: number, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

interface ProblemDetails {
  title?: string;
  detail?: string;
  errors?: FieldErrors;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function toApiError(response: Response, body: unknown): ApiError {
  const fallbacks: Record<number, string> = {
    401: 'You are not authorised to perform this action.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
  };

  const problem = body && typeof body === 'object' ? (body as ProblemDetails) : undefined;
  const message =
    problem?.title ||
    problem?.detail ||
    (typeof body === 'string' && body) ||
    fallbacks[response.status] ||
    `Request failed with status ${response.status}`;

  return new ApiError(message, response.status, problem?.errors ?? {});
}

export async function request<T>(
  path: string,
  { method = 'GET', body, headers, signal }: RequestOptions = {}
): Promise<T> {
  const token = tokenStore.get();
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && path.startsWith('/api/notifications') && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ApiError('Unable to reach the server. Is the API running?', 0);
  }

  const data = await parseBody(response);
  // Expired/invalid token: drop it and send the user back to login.
  // Auth endpoints are exempt so a wrong password just shows an error.
  if (response.status === 401 && !path.startsWith('/api/auth')) {
    tokenStore.clear();
    window.location.assign('/login');
  }
  if (!response.ok) throw toApiError(response, data);
  return data as T;
}

type Options = Omit<RequestOptions, 'method' | 'body'>;

export const http = {
  get: <T>(path: string, options?: Options) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T = void>(path: string, options?: Options) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
