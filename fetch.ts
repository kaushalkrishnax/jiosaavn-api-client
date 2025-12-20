import { Endpoints, type EndpointValue } from './endpoints.js'
import { pickUserAgent } from './utils.js'

/**
 * API context/environment to use for requests
 * - 'web6dot0': Web API (default, more stable)
 * - 'android': Android app API (may have different rate limits)
 */
export type ApiContext = 'web6dot0' | 'android'

/**
 * Parameters for making an API request to JioSaavn
 */
export interface FetchParams {
  /** API endpoint to call (e.g., 'song.getDetails') */
  endpoint: EndpointValue
  /** Query parameters for the API endpoint */
  params?: Record<string, string | number | boolean>
  /** API context to use (default: 'web6dot0') */
  context?: ApiContext
  /** Custom HTTP headers to include in request */
  headers?: Record<string, string>
  /** Custom User-Agent strings to rotate from (optional) */
  userAgents?: string[]
}

/**
 * Standardized API response wrapper returned by all fetch operations
 * @template T - Type of the response data
 */
export interface FetchResponse<T> {
  /** The actual response data from JioSaavn API */
  data: T
  /** Whether the HTTP request was successful (2xx status) */
  ok: boolean
  /** HTTP status code returned by the server */
  status: number
}

/**
 * JioSaavn API base URL
 * @internal
 */
const BASE_URL = 'https://www.jiosaavn.com/api.php'

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
  context = 'web6dot0',
  headers = {},
  userAgents
}: FetchParams): Promise<FetchResponse<T>> => {
  const url = new URL(BASE_URL)

  // Add required API parameters
  url.searchParams.append('__call', endpoint)
  url.searchParams.append('_format', 'json')
  url.searchParams.append('_marker', '0')
  url.searchParams.append('api_version', '4')
  url.searchParams.append('ctx', context)

  // Add endpoint-specific parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    url.searchParams.append(key, String(value))
  })

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': pickUserAgent(userAgents),
      ...(headers || {})
    }
  })

  const data = await response.json()

  return { data: data as T, ok: response.ok, status: response.status }
}

/**
 * Exported endpoints object for use in API calls
 */
export const endpoints = Endpoints
