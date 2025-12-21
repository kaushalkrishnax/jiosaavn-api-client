/**
 * General utilities for JioSaavn API client
 * Pure helpers only. No parsing or validation logic.
 * @module utils
 * @internal
 */

/* -------------------------------------------------------------------------- */
/* User-Agent utilities                                                        */
/* -------------------------------------------------------------------------- */

const DEFAULT_USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
] as const;

export function pickUserAgent(custom?: readonly string[]): string {
  const agents =
    Array.isArray(custom) && custom.length > 0 ? custom : DEFAULT_USER_AGENTS;

  return agents[Math.floor(Math.random() * agents.length)]!;
}

/* -------------------------------------------------------------------------- */
/* Timing utilities                                                            */
/* -------------------------------------------------------------------------- */

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  options?: {
    retries?: number;
    baseDelayMs?: number;
  }
): Promise<T> {
  const retries = options?.retries ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 1000;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await delay(baseDelayMs * 2 ** attempt);
      }
    }
  }

  throw lastError;
}

/* -------------------------------------------------------------------------- */
/* Query & URL utilities                                                       */
/* -------------------------------------------------------------------------- */

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      qs.set(key, String(value));
    }
  }

  return qs.toString();
}

/* -------------------------------------------------------------------------- */
/* Token extraction                                                            */
/* -------------------------------------------------------------------------- */

type EntityType = "song" | "album" | "artist" | "playlist";

const TOKEN_PATTERNS: Record<EntityType, RegExp> = {
  song: /\/song\/[^/]+\/([^/]+)$/,
  album: /\/album\/[^/]+\/([^/]+)$/,
  artist: /\/artist\/[^/]+\/([^/]+)$/,
  playlist: /\/(?:featured|playlist)\/[^/]+\/([^/]+)$/,
};

export function extractToken(
  url: string,
  type: EntityType
): string | undefined {
  return url.match(TOKEN_PATTERNS[type])?.[1];
}

/* -------------------------------------------------------------------------- */
/* String utilities                                                            */
/* -------------------------------------------------------------------------- */

export function truncate(
  value: string,
  maxLength: number,
  suffix = "..."
): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - suffix.length) + suffix;
}

/* -------------------------------------------------------------------------- */
/* Object utilities                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Remove undefined values only (nulls are not allowed in this codebase)
 */
export function removeUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key as keyof T] = value as T[keyof T];
    }
  }

  return result;
}

/**
 * Safe structured clone
 * Uses native structuredClone when available
 */
export function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  // Fallback (documented limitation)
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Deep merge without mutation
 */
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: Partial<T>
): T {
  const result = { ...base } as T;

  for (const [key, value] of Object.entries(patch)) {
    const existing = result[key as keyof T];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      existing &&
      typeof existing === "object" &&
      !Array.isArray(existing)
    ) {
      result[key as keyof T] = deepMerge(
        existing as Record<string, unknown>,
        value as Record<string, unknown>
      ) as T[keyof T];
    } else if (value !== undefined) {
      result[key as keyof T] = value as T[keyof T];
    }
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* JSON utilities                                                              */
/* -------------------------------------------------------------------------- */

export function safeJsonParse<T>(input: string, fallback: T): T {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}
