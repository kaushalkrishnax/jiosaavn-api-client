/**
 * JioSaavn API Client - Complete Implementation
 * Clean, class-based API with proper error handling and no global state
 * @module jiosaavn-api-client
 * @version 2.0.0
 */

// Export the main client class
export { JioSaavnClient } from "./core/client";

export * from "./core/errors";
export * from "./core/utils";
export * from "./core/fetch";
export * from "./core/endpoints";

// Export public types
export type {
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
  GetTrendingContentOptions,
} from "./core/types";

import { JioSaavnClient } from "./core/client";
import type { ClientConfig } from "./core/types";
type MethodOptions<M extends keyof JioSaavnClient> =
  Parameters<JioSaavnClient[M]>[0];
type MethodResult<M extends keyof JioSaavnClient> = ReturnType<JioSaavnClient[M]>;

let defaultClient: JioSaavnClient = new JioSaavnClient();

/**
 * Configure the default client with custom settings
 * This allows you to override the default API endpoint, fetch implementation, or timeout
 *
 * NOTE: This creates a new instance internally - no global state mutation
 *
 */
export function createClient(config: ClientConfig = {}): void {
  defaultClient = new JioSaavnClient(config);
}

/** Search across all entity types (songs, albums, artists, playlists) */
export function searchAll(
  options: MethodOptions<"searchAll">
): MethodResult<"searchAll"> {
  return defaultClient.searchAll(options);
}

/** Search for songs by query */
export function searchSongs(
  options: MethodOptions<"searchSongs">
): MethodResult<"searchSongs"> {
  return defaultClient.searchSongs(options);
}

/** Search for albums by query */
export function searchAlbums(
  options: MethodOptions<"searchAlbums">
): MethodResult<"searchAlbums"> {
  return defaultClient.searchAlbums(options);
}

/** Search for artists by query */
export function searchArtists(
  options: MethodOptions<"searchArtists">
): MethodResult<"searchArtists"> {
  return defaultClient.searchArtists(options);
}

/** Search for playlists by query */
export function searchPlaylists(
  options: MethodOptions<"searchPlaylists">
): MethodResult<"searchPlaylists"> {
  return defaultClient.searchPlaylists(options);
}

/** Fetch complete song details by ID(s) */
export function getSongsById(
  options: MethodOptions<"getSongsById">
): MethodResult<"getSongsById"> {
  return defaultClient.getSongsById(options);
}

/** Fetch song details by JioSaavn share link */
export function getSongByLink(
  options: MethodOptions<"getSongByLink">
): MethodResult<"getSongByLink"> {
  return defaultClient.getSongByLink(options);
}

/** Get song suggestions */
export function getSongSuggestions(
  options: MethodOptions<"getSongSuggestions">
): MethodResult<"getSongSuggestions"> {
  return defaultClient.getSongSuggestions(options);
}

/** Fetch album details by ID */
export function getAlbumById(
  options: MethodOptions<"getAlbumById">
): MethodResult<"getAlbumById"> {
  return defaultClient.getAlbumById(options);
}

/** Fetch album details by share link */
export function getAlbumByLink(
  options: MethodOptions<"getAlbumByLink">
): MethodResult<"getAlbumByLink"> {
  return defaultClient.getAlbumByLink(options);
}

/** Fetch artist details by ID */
export function getArtistById(
  options: MethodOptions<"getArtistById">
): MethodResult<"getArtistById"> {
  return defaultClient.getArtistById(options);
}

/**  Fetch artist details by share link */
export function getArtistByLink(
  options: MethodOptions<"getArtistByLink">
): MethodResult<"getArtistByLink"> {
  return defaultClient.getArtistByLink(options);
}

/** Get paginated songs for an artist */
export function getArtistSongs(
  options: MethodOptions<"getArtistSongs">
): MethodResult<"getArtistSongs"> {
  return defaultClient.getArtistSongs(options);
}

/** Get paginated albums for an artist */
export function getArtistAlbums(
  options: MethodOptions<"getArtistAlbums">
): MethodResult<"getArtistAlbums"> {
  return defaultClient.getArtistAlbums(options);
}

/** Fetch playlist details by ID */
export function getPlaylistById(
  options: MethodOptions<"getPlaylistById">
): MethodResult<"getPlaylistById"> {
  return defaultClient.getPlaylistById(options);
}

/** Fetch playlist details by share link */
export function getPlaylistByLink(
  options: MethodOptions<"getPlaylistByLink">
): MethodResult<"getPlaylistByLink"> {
  return defaultClient.getPlaylistByLink(options);
}

/** Fetch browse modules */
export function getBrowseModules(): MethodResult<"getBrowseModules"> {
  return defaultClient.getBrowseModules();
}

/** Fetch trending content */
export function getTrendingContent(
  options: MethodOptions<"getTrendingContent">
): MethodResult<"getTrendingContent"> {
  return defaultClient.getTrendingContent(options);
}
