/**
 * Validation & type guards
 * Single-responsibility, null-free, composable helpers
 * @module validators
 */

import type { Models } from "./types";

/**
 * Check if value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
