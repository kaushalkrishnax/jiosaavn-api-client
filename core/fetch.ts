import { Endpoints, type EndpointValue } from "./endpoints";
import { pickUserAgent } from "./utils";
import { createValidationError } from "./errors";

/**
 * API context/environment to use for requests
 * - 'web6dot0': Web API (default, more stable)
 * - 'android': Android app API (may have different rate limits)
 */
export type ApiContext = "web6dot0" | "wap6dot0" | "android";

/**
 * Parameters for making an API request to JioSaavn
 */
export interface FetchParams {
  /** API endpoint to call (e.g., 'song.getDetails') */
  endpoint: EndpointValue;
  /** Query parameters for the API endpoint */
  params?: Record<string, string | number | boolean>;
  /** API context to use (default: 'web6dot0') */
  context?: ApiContext;
  /** Custom HTTP headers to include in request */
  headers?: Record<string, string>;
  /** Custom User-Agent strings to rotate from (optional) */
  userAgents?: string[];
  /** Override base URL (advanced, defaults to JioSaavn API) */
  baseUrl?: string;
  /** Custom fetch implementation (e.g., for environments without global fetch) */
  fetchImpl?: typeof fetch;
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}

/**
 * Standardized API response wrapper returned by all fetch operations
 * @template T - Type of the response data
 */
export interface FetchResponse<T> {
  /** The actual response data from JioSaavn API */
  data: T;
  /** Whether the HTTP request was successful (2xx status) */
  ok: boolean;
  /** HTTP status code returned by the server */
  status: number;
}

/**
 * JioSaavn API base URL
 * @internal
 */
const BASE_URL = "https://www.jiosaavn.com/api.php";

/**
 * Makes a request to JioSaavn's API with proper parameter encoding and headers
 *
 * Features:
 * - Automatic URL construction with all required parameters
 * - Random User-Agent rotation to avoid rate limiting
 * - JSON response parsing
 * - Works in Node.js, Bun, Cloudflare Workers, Vercel Edge, and Deno
 *
 * @template T - Type of the response data from the API
 * @param params - Configuration for the API request
 * @returns Promise resolving to standardized API response
 * @throws Network or parsing errors bubble up, must be handled by caller
 *
 * @example
 * const response = await fetchFromSaavn<{ songs: Song[] }>({
 *   endpoint: 'song.getDetails',
 *   params: { pids: 'song-id-123' }
 * });
 *
 * if (response.ok) {
 *   console.log(response.data.songs);
 * }
 *
 * @example
 * // With custom headers and Android context
 * const response = await fetchFromSaavn({
 *   endpoint: 'webradio.getSong',
 *   params: { stationid: 'station-123', k: 10 },
 *   context: 'android',
 *   headers: { 'X-Custom': 'value' }
 * });
 */
export const fetchFromSaavn = async <T = unknown>({
  endpoint,
  params = {},
  context = "web6dot0",
  headers = {},
  userAgents,
  baseUrl = BASE_URL,
  fetchImpl = fetch,
  timeoutMs,
}: FetchParams): Promise<FetchResponse<T>> => {
  if (!fetchImpl) {
    throw createValidationError("fetch implementation is required", {
      providedFetchImpl: typeof fetchImpl,
    });
  }

  const url = new URL(baseUrl);

  url.searchParams.append("__call", endpoint);
  url.searchParams.append("_format", "json");
  url.searchParams.append("_marker", "0");
  url.searchParams.append("api_version", "4");
  url.searchParams.append("ctx", context);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.append(key, String(value));
  });

  const controller = timeoutMs ? new AbortController() : undefined;
  const timeout = timeoutMs
    ? setTimeout(() => controller?.abort(), timeoutMs)
    : undefined;

  const response = await fetchImpl(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": pickUserAgent(userAgents),
      ...(headers || {}),
    },
    signal: controller?.signal,
  });

  if (timeout) {
    clearTimeout(timeout);
  }

  console.log(`Fetched URL: ${url.toString()} - Status: ${response.status}`);

  const data = await response.json();

  const data = await response.json();
  
  if (data === null || data === undefined) {
    return { data: null as unknown as T, ok: false, status: response.status };
  }
  
  const dataAny = data as any;
  if (
    dataAny.error ||
    dataAny.status === "failure" ||
    dataAny.status === "error"
  ) {
    return { data: data as T, ok: false, status: response.status };
  }

  return { data: data as T, ok: response.ok, status: response.status };
};

/**
 * Exported endpoints object for use in API calls
 */
export const endpoints = Endpoints;
