/**
 * Validation & normalization utilities
 * Single-responsibility, null-free, composable helpers
 * @module validators
 */

import type { Models } from "../index.js";

/* -------------------------------------------------------------------------- */
/* Core guards                                                                 */
/* -------------------------------------------------------------------------- */

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/* -------------------------------------------------------------------------- */
/* Array helpers                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Safely map over an array-like value
 */
export function safeArrayMap<T, R>(
  value: unknown,
  mapper: (item: T) => R
): R[] {
  return Array.isArray(value) ? value.map(mapper) : [];
}

/**
 * Extract values from object or array
 */
export function safeObjectValues<T>(
  value: unknown,
  guard?: (item: unknown) => item is T
): T[] {
  const values = Array.isArray(value)
    ? value
    : isObject(value)
      ? Object.values(value)
      : [];

  return guard ? values.filter(guard) : (values as T[]);
}

/**
 * Filter array by validator
 */
export function filterValid<T>(
  items: readonly T[],
  validator: (item: T) => boolean
): T[] {
  return items.filter(validator);
}

/* -------------------------------------------------------------------------- */
/* Primitive normalization                                                     */
/* -------------------------------------------------------------------------- */

export function toNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") return value === "1" || value === "true";
  return false;
}

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

/* -------------------------------------------------------------------------- */
/* Field extraction                                                            */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Validation helpers                                                          */
/* -------------------------------------------------------------------------- */

export function validateNumberRange(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  const n = toNumber(value);
  return n !== undefined && n >= min && n <= max ? n : fallback;
}

export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* Entity validators (hard guarantees)                                         */
/* -------------------------------------------------------------------------- */

export function isValidSong(song: Models.Song): boolean {
  return (
    typeof song?.id === "string" &&
    song.id.length > 0 &&
    typeof song.title === "string" &&
    song.title.length > 0
  );
}

export function isValidAlbum(album: Models.Album): boolean {
  return (
    typeof album?.id === "string" &&
    album.id.length > 0 &&
    typeof album.title === "string" &&
    album.title.length > 0
  );
}

export function isValidArtist(artist: Models.Artist): boolean {
  return (
    typeof artist?.id === "string" &&
    artist.id.length > 0 &&
    typeof artist.name === "string" &&
    artist.name.length > 0
  );
}

export function isValidPlaylist(playlist: Models.Playlist): boolean {
  return (
    typeof playlist?.id === "string" &&
    playlist.id.length > 0 &&
    typeof playlist.title === "string" &&
    playlist.title.length > 0
  );
}

/**
 * Normalize response for JSON serialization
 * - Arrays: default to []
 * - Objects: recursively normalized
 * - Undefined primitives: removed (key omitted)
 */
export function normalizeResponse<T extends Record<string, any>>(obj: T): T {
  if (!isObject(obj)) return obj;

  const result: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      // omit key entirely
      continue;
    }

    if (Array.isArray(value)) {
      result[key] = value.map(item =>
        isObject(item) ? normalizeResponse(item) : item
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

export function normalizeIds(ids: string | readonly string[]): string {
  return Array.isArray(ids) ? ids.join(",") : String(ids);
}

export function extractToken(
  url: string,
  type: "song" | "album" | "artist" | "playlist"
): string | undefined {
  const patterns: Record<typeof type, RegExp> = {
    song: /\/song\/[^/]+\/([^/]+)$/,
    album: /\/album\/[^/]+\/([^/]+)$/,
    artist: /\/artist\/[^/]+\/([^/]+)$/,
    playlist:
      /\/(?:featured|playlist)\/[^/]+\/([^/]+)$/
  };

  return url.match(patterns[type])?.[1];
}
