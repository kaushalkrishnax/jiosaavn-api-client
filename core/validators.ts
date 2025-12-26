/**
 * Validation & type guards
 * Single-responsibility, null-free, composable helpers
 * @module validators
 */

import type { Models } from "./types";

/**
 * Check if value is defined
 */
export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

/**
 * Check if value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

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
 * Validate number is in range
 */
export function validateNumberRange(
  value: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
}

/**
 * Check if value is valid URL
 */
export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate song has required fields
 */
export function isValidSong(song: Models.Song): boolean {
  return (
    typeof song?.id === "string" &&
    song.id.length > 0 &&
    typeof song.title === "string" &&
    song.title.length > 0
  );
}

/**
 * Validate album has required fields
 */
export function isValidAlbum(album: Models.Album): boolean {
  return (
    typeof album?.id === "string" &&
    album.id.length > 0 &&
    typeof album.title === "string" &&
    album.title.length > 0
  );
}

/**
 * Validate artist has required fields
 */
export function isValidArtist(artist: Models.Artist): boolean {
  return (
    typeof artist?.id === "string" &&
    artist.id.length > 0 &&
    typeof artist.name === "string" &&
    artist.name.length > 0
  );
}

/**
 * Validate playlist has required fields
 */
export function isValidPlaylist(playlist: Models.Playlist): boolean {
  return (
    typeof playlist?.id === "string" &&
    playlist.id.length > 0 &&
    typeof playlist.title === "string" &&
    playlist.title.length > 0
  );
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
