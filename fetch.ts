import { Endpoints, type EndpointValue } from './endpoints'
import { pickUserAgent } from './utils'

type ApiContext = 'web6dot0' | 'android'

export interface FetchParams {
  endpoint: EndpointValue
  params?: Record<string, string | number | boolean>
  context?: ApiContext
  headers?: Record<string, string>
  userAgents?: string[]
}

export interface FetchResponse<T> {
  data: T
  ok: boolean
  status: number
}

const BASE_URL = 'https://www.jiosaavn.com/api.php'

export const fetchFromSaavn = async <T = unknown>({
  endpoint,
  params = {},
  context = 'web6dot0',
  headers = {},
  userAgents
}: FetchParams): Promise<FetchResponse<T>> => {
  const url = new URL(BASE_URL)

  url.searchParams.append('__call', endpoint)
  url.searchParams.append('_format', 'json')
  url.searchParams.append('_marker', '0')
  url.searchParams.append('api_version', '4')
  url.searchParams.append('ctx', context)

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

export const endpoints = Endpoints
