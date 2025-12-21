/**
 * JioSaavn API Client - Class-based implementation
 * Eliminates global state, provides clean instance-based API
 * @module client
 */

import {
  fetchFromSaavn,
  type FetchResponse,
  type ApiContext,
} from "./fetch.js";
import { Endpoints } from "./endpoints.js";
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
} from "../index.js";
import {
  parseSong,
  parseAlbum,
  parsePlaylist,
  parseArtistDetail,
  parseSongPreview,
  parseAlbumPreview,
  parseArtistPreview,
  parsePlaylistPreview,
  buildPaginated,
} from "./parsers.js";
import {
  isValidSong,
  isValidAlbum,
  isValidPlaylist,
  isValidArtist,
  extractToken,
  normalizeIds,
  safeArrayMap,
  safeObjectValues,
  toNumber,
  normalizeResponse,
} from "./validators.js";
import {
  ErrorCode,
  createError,
  NotFoundError,
  ValidationError,
  normalizeError,
} from "./errors.js";

function success<T extends Record<string, any>>(data: T): ApiResult<T> {
  return {
    success: true,
    data: normalizeResponse(data) as T,
  };
}

function failure(error: unknown, code: ErrorCode): ApiResult<never> {
  const normalized = normalizeError(error);
  return {
    success: false,
    message: normalized.message,
    code,
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
        throw createError(
          new ValidationError("API returned null or undefined data"),
          ErrorCode.API_ERROR
        );
      }

      const errorData = response.data as any;
      if (errorData.error) {
        throw createError(
          errorData.error.message || errorData.error || "API error",
          ErrorCode.API_ERROR
        );
      }

      throw createError(
        `API request failed with status ${response.status}`,
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
  public async searchAll(
    query: string
  ): Promise<ApiResult<Models.SearchAllResult>> {
    try {
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
      return failure(error, ErrorCode.SEARCH_ERROR);
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
      const { query, page = 0, limit = 10 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.search.songs,
        params: { q: query, page: String(page), n: String(limit) },
      });

      const data = this.handleResponse(response);
      const results = safeArrayMap(data?.results, parseSongPreview);

      return success(
        buildPaginated(
          results,
          toNumber(data?.total) ?? results.length,
          page,
          limit
        )
      );
    } catch (error: unknown) {
      return failure(error, ErrorCode.SEARCH_SONGS_ERROR);
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
      const { query, page = 0, limit = 10 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.search.albums,
        params: { q: query, page: String(page), n: String(limit) },
      });

      const data = this.handleResponse(response);
      const results = safeArrayMap(data?.results, parseAlbumPreview);

      return success(
        buildPaginated(
          results,
          toNumber(data?.total) ?? results.length,
          page,
          limit
        )
      );
    } catch (error: unknown) {
      return failure(error, ErrorCode.SEARCH_ALBUMS_ERROR);
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
      const { query, page = 0, limit = 10 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.search.artists,
        params: { q: query, page: String(page), n: String(limit) },
      });

      const data = this.handleResponse(response);
      const results = safeArrayMap(data?.results, parseArtistPreview);

      return success(
        buildPaginated(
          results,
          toNumber(data?.total) ?? results.length,
          page,
          limit
        )
      );
    } catch (error: unknown) {
      return failure(error, ErrorCode.SEARCH_ARTISTS_ERROR);
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
      const { query, page = 0, limit = 10 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.search.playlists,
        params: { q: query, page: String(page), n: String(limit) },
      });

      const data = this.handleResponse(response);
      const results = safeArrayMap(data?.results, parsePlaylistPreview);

      return success(
        buildPaginated(
          results,
          toNumber(data?.total) ?? results.length,
          page,
          limit
        )
      );
    } catch (error: unknown) {
      return failure(error, ErrorCode.SEARCH_PLAYLISTS_ERROR);
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
      });

      const data = this.handleResponse(response);
      const songsList = data?.songs || data;
      const songsArray = safeObjectValues(
        songsList,
        (item): item is any =>
          typeof item === "object" && item !== null && "id" in item
      );

      const songs = safeArrayMap(songsArray, parseSong);

      return success(songs);
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_SONGS_ERROR);
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
      const token = extractToken(options.link, "song");
      if (!token) {
        throw new ValidationError("Invalid JioSaavn song URL");
      }

      const response = await this.request<any>({
        endpoint: Endpoints.songs.link,
        params: { token, type: "song" },
      });

      const data = this.handleResponse(response);
      const songs = safeArrayMap(data?.songs, parseSong);

      if (songs.length === 0) {
        throw new NotFoundError(
          "Song not found or invalid data",
          ErrorCode.SONG_NOT_FOUND
        );
      }

      const song = songs[0]!;
      if (!isValidSong(song)) {
        throw new NotFoundError(
          "Song not found or invalid data",
          ErrorCode.SONG_NOT_FOUND
        );
      }

      return success(song);
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_SONG_LINK_ERROR);
    }
  }

  /**
   * Get song suggestions/recommendations similar to a given song
   *
   * @param options - Song ID and optional limit for suggestions
   * @returns Array of recommended songs based on the provided song
   */
  public async getSongSuggestions(
    options: GetSongSuggestionsOptions
  ): Promise<ApiResult<Models.Song[]>> {
    try {
      const { id, limit = 10 } = options;

      const stationResponse = await this.request<any>({
        endpoint: Endpoints.songs.station,
        params: { entity_id: id, entity_type: "song" },
      });

      const stationData = this.handleResponse(stationResponse);
      const stationId = stationData?.stationid;

      if (!stationId) {
        return success([]);
      }

      const songsResponse = await this.request<any>({
        endpoint: Endpoints.songs.suggestions,
        params: { stationid: stationId, k: String(limit) },
      });

      const songsData = this.handleResponse(songsResponse);
      const songsArray = safeObjectValues(songsData);
      const songs = safeArrayMap(songsArray, parseSong).filter(isValidSong);

      return success(songs);
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_SUGGESTIONS_ERROR);
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
        throw new NotFoundError(
          "Album not found or invalid data",
          ErrorCode.ALBUM_NOT_FOUND
        );
      }

      return success(album);
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_ALBUM_ERROR);
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
      const token = extractToken(options.link, "album");
      if (!token) {
        throw new ValidationError("Invalid JioSaavn album URL");
      }

      const response = await this.request<any>({
        endpoint: Endpoints.albums.link,
        params: { token, type: "album" },
      });

      const data = this.handleResponse(response);
      const album = parseAlbum(data);

      if (!isValidAlbum(album)) {
        throw new NotFoundError(
          "Album not found or invalid data",
          ErrorCode.ALBUM_NOT_FOUND
        );
      }

      return success(album);
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_ALBUM_LINK_ERROR);
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
      const response = await this.request<any>({
        endpoint: Endpoints.artists.id,
        params: { artistId: options.id },
      });

      const data = this.handleResponse(response);
      const artist = parseArtistDetail(data);

      if (!isValidArtist(artist)) {
        throw new NotFoundError(
          "Artist not found or invalid data",
          ErrorCode.ARTIST_NOT_FOUND
        );
      }

      return success(artist);
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_ARTIST_ERROR);
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
      const token = extractToken(options.link, "artist");
      if (!token) {
        throw new ValidationError("Invalid JioSaavn artist URL");
      }

      const response = await this.request<any>({
        endpoint: Endpoints.artists.link,
        params: { token, type: "artist" },
      });

      const data = this.handleResponse(response);
      const artist = parseArtistDetail(data);

      if (!isValidArtist(artist)) {
        throw new NotFoundError(
          "Artist not found or invalid data",
          ErrorCode.ARTIST_NOT_FOUND
        );
      }

      return success(artist);
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_ARTIST_LINK_ERROR);
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
        page = 0,
        sortBy = "popularity",
        sortOrder = "desc",
      } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.artists.songs,
        params: {
          artistId: id,
          page: String(page),
          sort_order: sortBy,
          category: sortOrder,
        },
      });

      const data = this.handleResponse(response);
      const songs = safeArrayMap(data?.topSongs?.songs, parseSongPreview);

      return success(
        buildPaginated(
          songs,
          toNumber(data?.topSongs?.total) ?? songs.length,
          page,
          songs.length
        )
      );
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_ARTIST_SONGS_ERROR);
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
        page = 0,
        sortBy = "popularity",
        sortOrder = "desc",
      } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.artists.albums,
        params: {
          artistId: id,
          page: String(page),
          sort_order: sortBy,
          category: sortOrder,
        },
      });

      const data = this.handleResponse(response);
      const albums = safeArrayMap(data?.topAlbums?.albums, parseAlbumPreview);

      return success(
        buildPaginated(
          albums,
          toNumber(data?.topAlbums?.total) ?? albums.length,
          page,
          albums.length
        )
      );
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_ARTIST_ALBUMS_ERROR);
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
      const { id, page = 0, limit = 10 } = options;

      const response = await this.request<any>({
        endpoint: Endpoints.playlists.id,
        params: { listid: id, page: String(page), n: String(limit) },
      });

      const data = this.handleResponse(response);
      const playlist = parsePlaylist(data);

      if (!isValidPlaylist(playlist)) {
        throw new NotFoundError(
          "Playlist not found or invalid data",
          ErrorCode.PLAYLIST_NOT_FOUND
        );
      }

      return success(playlist);
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_PLAYLIST_ERROR);
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
      const { link, page = 0, limit = 10 } = options;

      const token = extractToken(link, "playlist");
      if (!token) {
        throw new ValidationError("Invalid JioSaavn playlist URL");
      }

      const response = await this.request<any>({
        endpoint: Endpoints.playlists.link,
        params: {
          token,
          type: "playlist",
          page: String(page),
          n: String(limit),
        },
      });

      const data = this.handleResponse(response);
      const playlist = parsePlaylist(data);

      if (!isValidPlaylist(playlist)) {
        throw new NotFoundError(
          "Playlist not found or invalid data",
          ErrorCode.PLAYLIST_NOT_FOUND
        );
      }

      return success(playlist);
    } catch (error: unknown) {
      return failure(error, ErrorCode.GET_PLAYLIST_LINK_ERROR);
    }
  }
}
