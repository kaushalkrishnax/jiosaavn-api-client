/**
 * General utilities for JioSaavn API client
 * Pure helpers only. No parsing or validation logic.
 * @module utils
 * @internal
 */

import type { ExtractedToken, Paginated } from "./types";
import { isObject } from "./validators";

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

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  options?: {
    retries?: number;
    baseDelayMs?: number;
  },
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

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      qs.set(key, String(value));
    }
  }

  return qs.toString();
}

export function truncate(
  value: string,
  maxLength: number,
  suffix = "...",
): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Remove undefined values only (nulls are not allowed in this codebase)
 */
export function removeUndefined<T extends Record<string, unknown>>(
  obj: T,
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

  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Deep merge without mutation
 */
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch: Partial<T>,
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
        value as Record<string, unknown>,
      ) as T[keyof T];
    } else if (value !== undefined) {
      result[key as keyof T] = value as T[keyof T];
    }
  }

  return result;
}

export function safeJsonParse<T>(input: string, fallback: T): T {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

/**
 * Build paginated result wrapper
 *
 * @param results - Array of results
 * @param total - Total count from API
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Paginated wrapper
 */
export function buildPaginated<T>(
  results: T[],
  total: number,
  page: number,
  limit: number,
): Paginated<T> {
  return {
    total: Number(total) ?? results.length,
    page: page >= 1 ? Number(page) : 1,
    limit: limit <= 40 ? Number(limit) : 40,
    results,
  };
}

/**
 * Extract entity type and token from a JioSaavn share URL
 * @param input - JioSaavn share URL or token
 * @returns Extracted token object or undefined if invalid
 */
export function extractToken(input: string): ExtractedToken | undefined {
  if (!input || typeof input !== "string") return undefined;

  let url: URL;
  try {
    url = input.startsWith("http")
      ? new URL(input)
      : new URL(input, "https://www.jiosaavn.com");
  } catch {
    return undefined;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 2) return undefined;

  const token = segments.at(-1);
  if (!token) return undefined;

  const root = segments[0] === "s" ? segments[1] : segments[0];

  switch (root) {
    case "song":
      return { type: "song", token };

    case "album":
      return { type: "album", token };

    case "artist":
      return { type: "artist", token };

    case "playlist":
    case "featured":
      return { type: "playlist", token };

    case "show":
      return { type: "show", token };

    default:
      return undefined;
  }
}

/**
 * Convert value to number if valid
 */
export function toNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Parse boolean from various types
 */
export function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return value === "1" || value === "true";
  return false;
}

/**
 * Clean and validate string input
 */
export function cleanString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const s = value.trim();
  return s.length > 0 ? s : undefined;
}

/**
 * String with explicit fallback (UI-facing only)
 */
export function safeString(value: unknown, fallback = ""): string {
  return cleanString(value) ?? fallback;
}

/**
 * Safely map over an array-like value
 */
export function safeArrayMap<T, R>(
  value: unknown,
  mapper: (item: T) => R,
): R[] {
  return Array.isArray(value) ? value.map(mapper) : [];
}

/**
 * Extract first defined field from object
 */
export function extractField(
  obj: unknown,
  ...keys: readonly string[]
): unknown {
  if (!isObject(obj)) return undefined;

  for (const key of keys) {
    const value = (obj as Record<string, unknown>)[key];
    if (value !== undefined) return value;
  }

  return undefined;
}

/**
 * Encode IDs to JSON array format
 */
export function encodeIdsToArray(ids: string | string[]): string {
  const arr = Array.isArray(ids) ? ids : [ids];
  return JSON.stringify(arr);
}

/**
 * Extract songs from radio payload
 */
export function extractRadioSongs(payload: any): any[] {
  if (!payload || typeof payload !== "object") return [];

  if (payload.song && typeof payload.song === "object") {
    return [payload.song];
  }

  return Object.values(payload)
    .filter(
      (v: any) =>
        v && typeof v === "object" && v.song && typeof v.song === "object",
    )
    .map((v: any) => v.song);
}

/**
 * Normalize IDs - convert array or string to comma-separated string
 */
export function normalizeIds(ids: string | readonly string[]): string {
  return Array.isArray(ids) ? ids.join(",") : String(ids);
}

/**
 * Normalize list response - handles both array and object with key
 */
export function normalizeList<T>(
  input: unknown,
  key: string,
): { items: T[]; total?: number } {
  if (Array.isArray(input)) {
    return { items: input };
  }

  if (
    typeof input === "object" &&
    input !== null &&
    Array.isArray((input as any)[key])
  ) {
    return {
      items: (input as any)[key],
      total: toNumber((input as any).total),
    };
  }

  return { items: [] };
}

/**
 * Recursively normalize response by removing undefined values
 */
export function normalizeResponse<T extends Record<string, any>>(obj: T): T {
  if (!isObject(obj)) return obj;

  const result: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        isObject(item) ? normalizeResponse(item) : item,
      );
      continue;
    }

    if (isObject(value)) {
      result[key] = normalizeResponse(value);
      continue;
    }

    result[key] = value;
  }

  return result;
}
