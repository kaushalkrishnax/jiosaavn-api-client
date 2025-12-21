/**
 * JioSaavn API Client - Complete Implementation
 * Clean, class-based API with proper error handling and no global state
 * @module jiosaavn-api-client
 * @version 2.0.0
 */

// Export the main client class
export { JioSaavnClient } from "./core/client.js";

// Export error classes and codes for consumers
export {
  JioSaavnError,
  NetworkError,
  ApiError,
  ValidationError,
  NotFoundError,
  type ErrorCode,
  normalizeError,
  createError,
  isJioSaavnError,
  hasErrorCode,
} from "./core/errors.js";

// Export Zod schemas and validators
export {
  ImageSourceSchema,
  DownloadLinkSchema,
  ArtistRefSchema,
  ArtistSummarySchema,
  ArtistsGroupSchema,
  SongSchema,
  AlbumSchema,
  PlaylistSchema,
  ArtistSchema,
  SongPreviewSchema,
  AlbumPreviewSchema,
  ArtistPreviewSchema,
  PlaylistPreviewSchema,
  validateWithDetails,
  type ImageSource,
  type DownloadLink,
  type ArtistRef,
  type ArtistSummary,
  type ArtistsGroup,
  type Song,
  type Album,
  type Playlist,
  type Artist,
  type SongPreview,
  type AlbumPreview,
  type ArtistPreview,
  type PlaylistPreview,
} from "./core/schemas.js";

// Default client instance for convenience functions
import { JioSaavnClient } from "./core/client.js";
import type {
  Models,
  Paginated,
  ApiResult,
  SearchOptions,
  GetSongsByIdOptions,
  GetSongByLinkOptions,
  GetSongSuggestionsOptions,
  GetAlbumByIdOptions,
  GetAlbumByLinkOptions,
  GetArtistByIdOptions,
  GetArtistByLinkOptions,
  GetArtistSongsOptions,
  GetArtistAlbumsOptions,
  GetPlaylistByIdOptions,
  GetPlaylistByLinkOptions,
  ArtistSongs,
  ArtistAlbums,
  ClientConfig,
} from "./index.d.js";

// Default client instance for convenience
let defaultClient: JioSaavnClient = new JioSaavnClient();

/**
 * Configure the default client with custom settings
 * This allows you to override the default API endpoint, fetch implementation, or timeout
 *
 * NOTE: This creates a new instance internally - no global state mutation
 *
 * @param {ClientConfig} [config] - Configuration options
 * @param {string} [config.baseUrl] - Custom API base URL (defaults to JioSaavn public API)
 * @param {Function} [config.fetch] - Custom fetch implementation (defaults to native fetch)
 * @param {number} [config.timeoutMs] - Request timeout in milliseconds
 * @returns {void}
 *
 * @example
 * ```typescript
 * // Use custom API endpoint
 * createClient({
 *   baseUrl: 'https://custom-api.example.com/api'
 * });
 *
 * // Use custom fetch (useful for proxies or custom headers)
 * createClient({
 *   fetch: async (url, options) => {
 *     const headers = {
 *       ...options?.headers,
 *       'X-Custom-Header': 'value'
 *     };
 *     return fetch(url, { ...options, headers });
 *   },
 *   timeoutMs: 5000
 * });
 * ```
 */
export function createClient(config: ClientConfig = {}): void {
  defaultClient = new JioSaavnClient(config);
}

/** Search across all entity types (songs, albums, artists, playlists) */
export async function searchAll(
  query: string
): Promise<ApiResult<Models.SearchAllResult>> {
  return defaultClient.searchAll(query);
}

/** Search for songs by query */
export async function searchSongs(
  options: SearchOptions
): Promise<ApiResult<Paginated<Models.SongPreview>>> {
  return defaultClient.searchSongs(options);
}

/** Search for albums by query */
export async function searchAlbums(
  options: SearchOptions
): Promise<ApiResult<Paginated<Models.AlbumPreview>>> {
  return defaultClient.searchAlbums(options);
}

/** Search for artists by query */
export async function searchArtists(
  options: SearchOptions
): Promise<ApiResult<Paginated<Models.ArtistPreview>>> {
  return defaultClient.searchArtists(options);
}

/**
 * Search for playlists by query
 */
export async function searchPlaylists(
  options: SearchOptions
): Promise<ApiResult<Paginated<Models.PlaylistPreview>>> {
  return defaultClient.searchPlaylists(options);
}

/**
 * Fetch complete song details by ID(s)
 */
export async function getSongsById(
  options: GetSongsByIdOptions
): Promise<ApiResult<Models.Song[]>> {
  return defaultClient.getSongsById(options);
}

/**
 * Fetch song details by JioSaavn share link
 */
export async function getSongByLink(
  options: GetSongByLinkOptions
): Promise<ApiResult<Models.Song>> {
  return defaultClient.getSongByLink(options);
}

/** Get song recommendations */
export async function getSongSuggestions(
  options: GetSongSuggestionsOptions
): Promise<ApiResult<Models.Song[]>> {
  return defaultClient.getSongSuggestions(options);
}

/** Fetch album details by ID */
export async function getAlbumById(
  options: GetAlbumByIdOptions
): Promise<ApiResult<Models.Album>> {
  return defaultClient.getAlbumById(options);
}

/** Fetch album details by share link */
export async function getAlbumByLink(
  options: GetAlbumByLinkOptions
): Promise<ApiResult<Models.Album>> {
  return defaultClient.getAlbumByLink(options);
}

/** Fetch artist details by ID */
export async function getArtistById(
  options: GetArtistByIdOptions
): Promise<ApiResult<Models.Artist>> {
  return defaultClient.getArtistById(options);
}

/** Fetch artist details by share link */
export async function getArtistByLink(
  options: GetArtistByLinkOptions
): Promise<ApiResult<Models.Artist>> {
  return defaultClient.getArtistByLink(options);
}

/** Get paginated songs for an artist */
export async function getArtistSongs(
  options: GetArtistSongsOptions
): Promise<ApiResult<ArtistSongs>> {
  return defaultClient.getArtistSongs(options);
}

/** Get paginated albums for an artist */
export async function getArtistAlbums(
  options: GetArtistAlbumsOptions
): Promise<ApiResult<ArtistAlbums>> {
  return defaultClient.getArtistAlbums(options);
}

/** Fetch playlist details by ID */
export async function getPlaylistById(
  options: GetPlaylistByIdOptions
): Promise<ApiResult<Models.Playlist>> {
  return defaultClient.getPlaylistById(options);
}

/** Fetch playlist details by share link */
export async function getPlaylistByLink(
  options: GetPlaylistByLinkOptions
): Promise<ApiResult<Models.Playlist>> {
  return defaultClient.getPlaylistByLink(options);
}

// Export all types
export type * from "./index.d.js";
