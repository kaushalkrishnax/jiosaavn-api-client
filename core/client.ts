/**
 * JioSaavn API Client - Class-based implementation
 * Eliminates global state, provides clean instance-based API
 * @module client
 */

import { fetchFromSaavn, type FetchResponse, type ApiContext } from "./fetch";
import { Endpoints } from "./endpoints";
import {
  buildPaginated,
  normalizeIds,
  encodeIdsToArray,
  extractRadioSongs,
  extractToken,
} from "./utils";
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
  GetTrendingContentOptions,
} from "./types";
import {
  parseSong,
  parseAlbum,
  parsePlaylist,
  parseArtist,
  parseSongPreview,
  parseAlbumPreview,
  parseArtistPreview,
  parsePlaylistPreview,
  parseBrowseModules,
  parseTrendingContent,
} from "./parsers";
import {
  isValidSong,
  isValidAlbum,
  isValidPlaylist,
  isValidArtist,
  safeArrayMap,
  normalizeResponse,
} from "./validators";
import {
  ErrorCode,
  createError,
  wrapError,
  createValidationError,
  createNotFoundError,
} from "./errors";

function success<T extends Record<string, any>>(data: T): ApiResult<T> {
  return {
    success: true,
    data: normalizeResponse(data) as T,
  };
}

function failure(error: unknown, code: ErrorCode): ApiResult<never> {
  const wrappedError = wrapError(error, code);
  return {
    success: false,
    message: wrappedError.message,
    code: code as any, // Cast to resolve type mismatch between enum and string union
  };
}

/**
 * Class-based JioSaavn API Client
 * No global state, instance-specific configuration
 *
 * @example
 * ```typescript
 * const client = new JioSaavnClient({
 *   baseUrl: 'https://custom-api.example.com',
 *   timeoutMs: 5000
 * });
 *
 * const songs = await client.searchSongs({ query: 'test' });
 * ```
 */
export class JioSaavnClient {
  private config: ClientConfig;

  constructor(config: ClientConfig = {}) {
    this.config = config;
  }

  /**
   * Update client configuration (merges with existing config)
   *
   * @param config - Partial configuration to merge
   */
  public updateConfig(config: Partial<ClientConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration (returns immutable copy)
   *
   * @returns Readonly copy of current client configuration
   */
  public getConfig(): Readonly<ClientConfig> {
    return { ...this.config };
  }

  /**
   * Internal request method
   */
  private async request<T>(params: {
    endpoint: string;
    params?: Record<string, string | number | boolean>;
    context?: ApiContext;
  }): Promise<FetchResponse<T>> {
    const response = await fetchFromSaavn<T>({
      ...params,
      endpoint: params.endpoint as any,
      baseUrl: this.config.baseUrl,
      fetchImpl: this.config.fetch,
      timeoutMs: this.config.timeoutMs,
    });

    return response;
  }

  /**
   * Handle API response with error checking
   */
  private handleResponse<T>(response: FetchResponse<T>): T {
    if (!response.ok) {
      if (response.data === null || response.data === undefined) {
        throw createValidationError("API returned null or undefined data", {
          status: response.status,
        });
      }

      const errorData = response.data as any;
      if (errorData.error) {
        throw createError(
          errorData.error.message || errorData.error || "API error",
          ErrorCode.API_ERROR
        );
      }
      if(errorData.status === "failure" && errorData.msg) {
        throw createError(
          `API request failed: ${errorData.msg}`,
          ErrorCode.API_ERROR,
        );
      }

      throw createError(
        `API request failed with unknown error (status: ${response.status})`,
        ErrorCode.API_ERROR
      );
    }

    return response.data;
  }

  /**
   * Search across all entity types (songs, albums, artists, playlists)
   *
   * @param query - Search query string
   * @returns Categorized search cards for each entity type
   */
  public async searchAll(options: {
    query: string;
  }): Promise<ApiResult<Models.SearchAllResult>> {
    try {
      const { query } = options;
      const response = await this.request<any>({
        endpoint: Endpoints.search.all,
        params: { query },
      });

      const data = this.handleResponse(response);

      const songs = safeArrayMap(data?.songs?.data, parseSongPreview);
      const albums = safeArrayMap(data?.albums?.data, parseAlbumPreview);
      const artists = safeArrayMap(data?.artists?.data, parseArtistPreview);
      const playlists = safeArrayMap(
        data?.playlists?.data,
        parsePlaylistPreview
      );

      return success({
        songs,
        albums,
        artists,
        playlists,
      });
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Search for songs by query
   *
   * @param options - Search configuration (query, page, limit)
   * @returns Paginated list of song previews matching the query
   */
  public async searchSongs(
    options: SearchOptions
  ): Promise<ApiResult<Paginated<Models.SongPreview>>> {
    try {
      const { query, page = 1, limit = 10 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.search.songs,
        params: { q: query, p: page, n: limit },
      });

      const data = this.handleResponse(response);
      const results = safeArrayMap(data?.results, parseSongPreview);

      return success(buildPaginated(results, data.total, page, limit));
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Search for albums by query
   *
   * @param options - Search configuration (query, page, limit)
   * @returns Paginated list of album previews matching the query
   */
  public async searchAlbums(
    options: SearchOptions
  ): Promise<ApiResult<Paginated<Models.AlbumPreview>>> {
    try {
      const { query, page = 1, limit = 10 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.search.albums,
        params: { q: query, p: page, n: limit },
      });

      const data = this.handleResponse(response);
      const results = safeArrayMap(data?.results, parseAlbumPreview);

      return success(buildPaginated(results, data?.total, page, limit));
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Search for artists by query
   *
   * @param options - Search configuration (query, page, limit)
   * @returns Paginated list of artist previews matching the query
   */
  public async searchArtists(
    options: SearchOptions
  ): Promise<ApiResult<Paginated<Models.ArtistPreview>>> {
    try {
      const { query, page = 1, limit = 10 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.search.artists,
        params: { q: query, p: page, n: limit },
      });

      const data = this.handleResponse(response);
      const results = safeArrayMap(data?.results, parseArtistPreview);

      return success(buildPaginated(results, data?.total, page, limit));
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Search for playlists by query
   *
   * @param options - Search configuration (query, page, limit)
   * @returns Paginated list of playlist previews matching the query
   */
  public async searchPlaylists(
    options: SearchOptions
  ): Promise<ApiResult<Paginated<Models.PlaylistPreview>>> {
    try {
      const { query, page = 1, limit = 10 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.search.playlists,
        params: { q: query, p: page, n: limit },
      });

      const data = this.handleResponse(response);
      const results = safeArrayMap(data?.results, parsePlaylistPreview);

      return success(buildPaginated(results, data?.total, page, limit));
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Fetch complete song details by ID(s)
   *
   * @param options - Song ID or array of song IDs
   * @returns Array of complete song entities with metadata and download links
   */
  public async getSongsById(
    options: GetSongsByIdOptions
  ): Promise<ApiResult<Models.Song[]>> {
    try {
      const ids = normalizeIds(options.ids);

      const response = await this.request<any>({
        endpoint: Endpoints.songs.id,
        params: { pids: ids },
        context: "web6dot0",
      });

      const data = this.handleResponse(response);
      const songsList = data?.songs || data;
      const songs = safeArrayMap(songsList, parseSong);

      return success(songs);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Fetch song details by JioSaavn share link
   *
   * @param options - JioSaavn song share URL
   * @returns Complete song entity extracted from share link
   */
  public async getSongByLink(
    options: GetSongByLinkOptions
  ): Promise<ApiResult<Models.Song>> {
    try {
      const extractedToken = extractToken(options.link);

      if (!extractedToken || extractedToken.type !== "song") {
        throw createValidationError("Invalid song link", {
          songLink: options.link,
        });
      }

      const response = await this.request<any>({
        endpoint: Endpoints.songs.link,
        params: { token: extractedToken.token, type: extractedToken.type },
        context: "web6dot0",
      });

      const data = this.handleResponse(response);
      const songsList = data?.songs || data;
      const song = parseSong(songsList[0]);

      if (!isValidSong(song)) {
        throw createNotFoundError(
          "Song not found or invalid data",
          ErrorCode.NOT_FOUND,
          { songLink: options.link }
        );
      }

      return success(song);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Get song suggestions similar to a given song/songs
   *
   * @param options - Song IDs and optional limit for suggestions
   * @returns Array of recommended songs based on the provided song
   */
  public async getSongSuggestions(
    options: GetSongSuggestionsOptions
  ): Promise<ApiResult<Models.SongPreview[]>> {
    try {
      const { ids, limit = 10 } = options;
      const encodedIds = encodeIdsToArray(ids);

      const stationResponse = await this.request<any>({
        endpoint: Endpoints.songs.station,
        params: { entity_id: encodedIds, entity_type: "queue" },
        context: "android",
      });

      const stationData = this.handleResponse(stationResponse);
      const stationId = stationData?.stationid;

      const songsResponse = await this.request<any>({
        endpoint: Endpoints.songs.suggestions,
        params: { stationid: stationId, k: limit, next: 1 },
        context: "android",
      });

      const songsData = this.handleResponse(songsResponse);
      const songsArray = extractRadioSongs(songsData);
      const songs = safeArrayMap(songsArray, parseSongPreview);

      return success(songs);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Fetch complete album details by ID
   *
   * @param options - JioSaavn album ID
   * @returns Complete album entity with track listing and metadata
   */
  public async getAlbumById(
    options: GetAlbumByIdOptions
  ): Promise<ApiResult<Models.Album>> {
    try {
      const response = await this.request<any>({
        endpoint: Endpoints.albums.id,
        params: { albumid: options.id },
      });

      const data = this.handleResponse(response);
      const album = parseAlbum(data);

      if (!isValidAlbum(album)) {
        throw createNotFoundError(
          "Album not found or invalid data",
          ErrorCode.NOT_FOUND,
          { albumId: options.id }
        );
      }

      return success(album);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Fetch album details by JioSaavn share link
   *
   * @param options - JioSaavn album share URL
   * @returns Complete album entity extracted from share link
   */
  public async getAlbumByLink(
    options: GetAlbumByLinkOptions
  ): Promise<ApiResult<Models.Album>> {
    try {
      const extractedToken = extractToken(options.link);

      if (!extractedToken || extractedToken.type !== "album") {
        throw createValidationError("Invalid album link", {
          albumLink: options.link,
        });
      }

      const response = await this.request<any>({
        endpoint: Endpoints.albums.link,
        params: { token: extractedToken.token, type: extractedToken.type },
      });

      const data = this.handleResponse(response);
      const album = parseAlbum(data);

      if (!isValidAlbum(album)) {
        throw createNotFoundError(
          "Album not found or invalid data",
          ErrorCode.NOT_FOUND,
          { albumLink: options.link }
        );
      }

      return success(album);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Fetch complete artist details by ID
   *
   * @param options - JioSaavn artist ID
   * @returns Complete artist profile with bio, top songs, albums, and similar artists
   */
  public async getArtistById(
    options: GetArtistByIdOptions
  ): Promise<ApiResult<Models.Artist>> {
    try {
      const { id, songCount = 10, albumCount = 10 } = options;
      const response = await this.request<any>({
        endpoint: Endpoints.artists.id,
        params: { artistId: id, n_song: songCount, n_album: albumCount },
      });

      const data = this.handleResponse(response);
      const artist = parseArtist(data);

      if (!isValidArtist(artist)) {
        throw createNotFoundError(
          "Artist not found or invalid data",
          ErrorCode.NOT_FOUND,
          { artistId: options.id }
        );
      }

      return success(artist);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Fetch artist details by JioSaavn share link
   *
   * @param options - JioSaavn artist share URL
   * @returns Complete artist profile extracted from share link
   */
  public async getArtistByLink(
    options: GetArtistByLinkOptions
  ): Promise<ApiResult<Models.Artist>> {
    try {
      const { link, songCount = 10, albumCount = 10 } = options;
      const extractedToken = extractToken(link);

      if (!extractedToken || extractedToken.type !== "artist") {
        throw createValidationError("Invalid artist link", {
          artistLink: link,
        });
      }

      const response = await this.request<any>({
        endpoint: Endpoints.artists.link,
        params: {
          token: extractedToken.token,
          type: extractedToken.type,
          n_song: songCount,
          n_album: albumCount,
        },
      });

      const data = this.handleResponse(response);
      const artist = parseArtist(data);

      if (!isValidArtist(artist)) {
        throw createNotFoundError(
          "Artist not found or invalid data",
          ErrorCode.NOT_FOUND,
          { artistLink: options.link }
        );
      }

      return success(artist);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Get paginated songs for an artist
   *
   * @param options - Artist ID, page number, and sort preferences
   * @returns Paginated list of artist's songs
   */
  public async getArtistSongs(
    options: GetArtistSongsOptions
  ): Promise<ApiResult<ArtistSongs>> {
    try {
      const {
        id,
        page = 1,
        sortBy = "alphabetical",
        sortOrder = "asc",
      } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.artists.songs,
        params: {
          artistId: id,
          page: page - 1, // API uses 0-based indexing for pages (here)
          category: sortBy,
          sort_order: sortOrder,
        },
      });

      const data = this.handleResponse(response);
      const songs = safeArrayMap(data?.topSongs?.songs, parseSongPreview);

      return success(
        buildPaginated(songs, data?.topSongs?.total, page, songs.length)
      );
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Get paginated albums for an artist
   *
   * @param options - Artist ID, page number, and sort preferences
   * @returns Paginated list of artist's albums
   */
  public async getArtistAlbums(
    options: GetArtistAlbumsOptions
  ): Promise<ApiResult<ArtistAlbums>> {
    try {
      const {
        id,
        page = 1,
        sortBy = "alphabetical",
        sortOrder = "asc",
      } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.artists.albums,
        params: {
          artistId: id,
          page: page - 1, // API uses 0-based indexing for pages (here)
          category: sortBy,
          sort_order: sortOrder,
        },
      });

      const data = this.handleResponse(response);
      const albums = safeArrayMap(data?.topAlbums?.albums, parseAlbumPreview);

      return success(
        buildPaginated(albums, data?.topAlbums?.total, page, albums.length)
      );
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Fetch complete playlist details by ID
   *
   * @param options - Playlist ID with optional pagination
   * @returns Complete playlist entity with track listing
   */
  public async getPlaylistById(
    options: GetPlaylistByIdOptions
  ): Promise<ApiResult<Models.Playlist>> {
    try {
      const { id, page = 1, songCount = 1 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.playlists.id,
        params: { listid: id, p: page, n: songCount },
      });

      const data = this.handleResponse(response);
      const playlist = parsePlaylist(data);

      if (!isValidPlaylist(playlist)) {
        throw createNotFoundError(
          "Playlist not found or invalid data",
          ErrorCode.NOT_FOUND,
          { playlistId: id }
        );
      }

      return success(playlist);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Fetch playlist details by JioSaavn share link
   *
   * @param options - JioSaavn playlist share URL with optional pagination
   * @returns Complete playlist entity extracted from share link
   */
  public async getPlaylistByLink(
    options: GetPlaylistByLinkOptions
  ): Promise<ApiResult<Models.Playlist>> {
    try {
      const { link, page = 1, songCount = 1 } = options;
      const extractedToken = extractToken(link);

      if (!extractedToken || extractedToken.type !== "playlist") {
        throw createValidationError("Invalid playlist link", {
          playlistLink: link,
        });
      }

      const response = await this.request<any>({
        endpoint: Endpoints.playlists.link,
        params: {
          token: extractedToken.token,
          type: extractedToken.type,
          p: page,
          n: songCount,
        },
      });

      const data = this.handleResponse(response);
      const playlist = parsePlaylist(data);

      if (!isValidPlaylist(playlist)) {
        throw createNotFoundError(
          "Playlist not found or invalid data",
          ErrorCode.NOT_FOUND,
          { playlistLink: link }
        );
      }

      return success(playlist);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Browse JioSaavn home/discover modules
   *
   * @returns Browse modules with categorized content sections
   */
  public async getBrowseModules(): Promise<ApiResult<Models.BrowseModules>> {
    try {
      const response = await this.request<any>({
        endpoint: Endpoints.modules,
      });

      const raw = this.handleResponse(response);
      const modules = parseBrowseModules(raw);

      return success(modules);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }

  /**
   * Get Trending categorised contents
   * @param
   * @returns Trending content with categories
   */
  public async getTrendingContent(
    options: GetTrendingContentOptions
  ): Promise<ApiResult<Models.TrendingContent>> {
    try {
      const { type = "song", language = "hindi" } = options;
      const response = await this.request<any>({
        endpoint: Endpoints.trending,
        params: { entity_type: type, entity_language: language },
      });

      const data = this.handleResponse(response);
      const trendingContent = parseTrendingContent(data);

      return success(trendingContent);
    } catch (error: unknown) {
      return failure(error, ErrorCode.API_ERROR);
    }
  }
}
