/**
 * JioSaavn API Client - Complete TypeScript Definitions
 * Class-based and function-first API with proper error handling
 * @module jiosaavn-api-client
 * @version 2.0.0
 */

/**
 * Base error class for all JioSaavn API errors
 * Preserves original error context for debugging
 */
export class JioSaavnError extends Error {
  public readonly code: ErrorCode;
  public readonly originalError?: unknown;
  public readonly statusCode?: number;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code?: ErrorCode,
    options?: {
      originalError?: unknown;
      statusCode?: number;
      context?: Record<string, unknown>;
    }
  );

  toJSON(): Record<string, unknown>;
}

/**
 * Network-related error
 */
export class NetworkError extends JioSaavnError {
  constructor(message: string, originalError?: unknown);
}

/**
 * API returned an error response
 */
export class ApiError extends JioSaavnError {
  constructor(message: string, statusCode?: number, originalError?: unknown);
}

/**
 * Invalid or malformed data from API
 */
export class ValidationError extends JioSaavnError {
  constructor(message: string, context?: Record<string, unknown>);
}

/**
 * Resource not found
 */
export class NotFoundError extends JioSaavnError {
  constructor(message: string, code?: ErrorCode);
}

/**
 * Normalize any error into a consistent format
 */
export function normalizeError(error: unknown): {
  message: string;
  originalError: unknown;
};

/**
 * Create a structured error from an unknown error
 */
export function createError(
  error: unknown,
  code: ErrorCode,
  context?: Record<string, unknown>
): JioSaavnError;

/**
 * Check if an error is a JioSaavn error
 */
export function isJioSaavnError(error: unknown): error is JioSaavnError;

/**
 * Check if an error has a specific code
 */
export function hasErrorCode(error: unknown, code: ErrorCode): boolean;

/**
 * Centralized error code registry for structured error handling
 */
export type ErrorCode =
  | "NETWORK_ERROR"
  | "API_ERROR"
  | "TIMEOUT_ERROR"
  | "INVALID_URL"
  | "INVALID_RESPONSE"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "SONG_NOT_FOUND"
  | "ALBUM_NOT_FOUND"
  | "ARTIST_NOT_FOUND"
  | "PLAYLIST_NOT_FOUND"
  | "SEARCH_ERROR"
  | "SEARCH_SONGS_ERROR"
  | "SEARCH_ALBUMS_ERROR"
  | "SEARCH_ARTISTS_ERROR"
  | "SEARCH_PLAYLISTS_ERROR"
  | "GET_SONGS_ERROR"
  | "GET_SONG_LINK_ERROR"
  | "GET_SUGGESTIONS_ERROR"
  | "GET_ALBUM_ERROR"
  | "GET_ALBUM_LINK_ERROR"
  | "GET_ARTIST_ERROR"
  | "GET_ARTIST_LINK_ERROR"
  | "GET_ARTIST_SONGS_ERROR"
  | "GET_ARTIST_ALBUMS_ERROR"
  | "GET_PLAYLIST_ERROR"
  | "GET_PLAYLIST_LINK_ERROR"
  | "UNKNOWN_ERROR";

declare namespace Raw {
  interface Artist {
    id?: string;
    name?: string;
    role?: string;
    type?: string;
    image?: string;
    image_url?: string;
    perma_url?: string;
  }

  interface ArtistMap {
    primary_artists?: Artist[];
    featured_artists?: Artist[];
    artists?: Artist[];
  }

  interface Song {
    id?: string;
    title?: string;
    type?: string;
    year?: string;
    image?: string;
    perma_url?: string;
    description?: string;
    language?: string;
    explicit_content?: string;
    more_info?: {
      album?: string | undefined;
      album_id?: string | undefined;
      album_url?: string | undefined;
      artistMap?: ArtistMap;
      duration?: string;
      label?: string;
      lyrics_id?: string | undefined;
      has_lyrics?: string;
      release_date?: string | undefined;
      encrypted_media_url?: string | undefined;
      copyright_text?: string | undefined;
      primary_artists?: string;
      singers?: string;
      language?: string;
    };
  }

  interface Album {
    id?: string;
    title?: string;
    year?: string;
    image?: string;
    perma_url?: string;
    language?: string;
    type?: string;
    description?: string;
    header_desc?: string;
    play_count?: string;
    explicit_content?: string;
    more_info?: {
      song_count?: string;
      artistMap?: ArtistMap;
      year?: string;
    };
    list?: Song[];
  }

  interface Playlist {
    id?: string;
    title?: string;
    description?: string;
    header_desc?: string;
    year?: string;
    image?: string;
    perma_url?: string;
    language?: string;
    type?: string;
    play_count?: string;
    explicit_content?: string;
    list_count?: string;
    more_info?: {
      song_count?: string;
      language?: string;
      artists?: Artist[];
    };
    list?: Song[];
  }

  interface ArtistPage {
    artistId?: string;
    id?: string;
    name?: string;
    perma_url?: string;
    type?: string;
    image?: string;
    follower_count?: string;
    fan_count?: string;
    isVerified?: boolean;
    dominantLanguage?: string;
    dominantType?: string;
    bio?: Array<{
      text?: string | undefined;
      title?: string | undefined;
      sequence?: number | undefined;
    }>;
    dob?: string | undefined;
    fb?: string | undefined;
    twitter?: string | undefined;
    wiki?: string | undefined;
    availableLanguages?: string[];
    isRadioPresent?: boolean;
    topSongs?: Song[];
    topAlbums?: Album[];
    singles?: Song[];
    similarArtists?: Artist[];
  }
}

export namespace Models {
  export interface ImageSource {
    /** Image resolution */
    resolution: string;
    /** HTTPS image URL */
    url: string;
  }

  export interface DownloadLink {
    /** Audio bitrate */
    bitrate: string;
    /** Audio file URL */
    url: string;
  }

  export interface ArtistsGroup {
    /** Primary artists */
    primary: ArtistPreview[];
    /** Featured artists */
    featured?: ArtistPreview[];
    /** All artists */
    all?: ArtistPreview[];
  }

  export interface Song {
    /** Unique song ID */
    id: string;
    /** Song title */
    title: string;
    /** Entity type discriminator */
    entityType: EntityType;
    /** Release year */
    releaseYear?: number | undefined;
    /** ISO 8601 release date */
    releaseDateISO?: string | undefined;
    /** Duration in seconds */
    durationSeconds?: number | undefined;
    /** Record label */
    label?: string | undefined;
    /** Explicit content flag */
    isExplicit: boolean;
    /** Play count */
    playCount?: number | undefined;
    /** Language code */
    language: string;
    /** Lyrics availability flag */
    hasLyrics: boolean;
    /** Lyrics identifier for lyrics API */
    lyricsId?: string | undefined;
    /** JioSaavn song page URL */
    url: string;
    /** Copyright text */
    copyright?: string | undefined;
    /** Album information */
    album: {
      /** Album ID */
      id: string | undefined;
      /** Album title */
      title: string | undefined;
      /** Album URL */
      url: string | undefined;
    };
    /** Primary and featured artists */
    artists: ArtistsGroup;
    /** Image sources in multiple resolutions */
    images: ImageSource[];
    /** Audio download links in multiple bitrates */
    downloadLinks: DownloadLink[];
  }

  export interface Album {
    /** Unique album ID */
    id: string;
    /** Album title */
    title: string;
    /** Album description */
    description?: string | undefined;
    /** Release year */
    releaseYear?: number | undefined;
    /** Entity type discriminator */
    entityType: EntityType;
    /** Play count */
    playCount?: number | undefined;
    /** Primary language code */
    language: string;
    /** Explicit content flag */
    isExplicit: boolean;
    /** Primary and featured artists */
    artists: ArtistsGroup;
    /** Total number of songs in album */
    songCount?: number | undefined;
    /** JioSaavn album page URL */
    url: string;
    /** Image sources in multiple resolutions */
    images: ImageSource[];
    /** Complete list of songs in album */
    songs?: SongPreview[] | undefined;
  }

  export interface Playlist {
    /** Unique playlist ID */
    id: string;
    /** Playlist title */
    title: string;
    /** Playlist description */
    description?: string | undefined;
    /** Creation year */
    releaseYear?: number | undefined;
    /** Entity type discriminator */
    entityType: EntityType;
    /** Play count */
    playCount?: number | undefined;
    /** Primary language code */
    language: string;
    /** Explicit content flag */
    isExplicit: boolean;
    /** Total number of songs in playlist */
    songCount?: number | undefined;
    /** JioSaavn playlist page URL */
    url: string;
    /** Image sources in multiple resolutions */
    images: ImageSource[];
    /** List of songs in playlist */
    songs?: SongPreview[] | undefined;
    /** Contributing artists */
    artists?: ArtistPreview[] | undefined;
  }

  export interface Artist {
    /** Unique artist ID */
    id: string;
    /** Artist name */
    name: string;
    /** JioSaavn artist page URL */
    url: string;
    /** Entity type discriminator */
    entityType: EntityType;
    /** Image sources in multiple resolutions */
    images: ImageSource[];
    /** Follower count */
    followerCount?: number | undefined;
    /** Fan count as numeric value */
    fanCount?: number | undefined;
    /** Verification badge status */
    isVerified?: boolean | undefined;
    /** Primary language code */
    primaryLanguage?: string | undefined;
    /** Primary content type */
    primaryContentType?: string | undefined;
    /** Biography sections */
    bio?:
      | Array<{
          /** Biography text content */
          text: string | undefined;
          /** Biography section title */
          title: string | undefined;
          /** Display sequence order */
          sequence: number | undefined;
        }>
      | undefined;
    /** Date of birth in ISO 8601 format */
    dateOfBirthISO?: string | undefined;
    /** Facebook profile URL */
    facebookUrl?: string | undefined;
    /** Twitter handle */
    twitterHandle?: string | undefined;
    /** Wikipedia page URL */
    wikipediaUrl?: string | undefined;
    /** Available content languages */
    availableLanguages: string[];
    /** JioSaavn radio availability */
    hasRadio?: boolean | undefined;
    /** Most popular songs */
    topSongs?: SongPreview[] | undefined;
    /** Most popular albums */
    topAlbums?: AlbumPreview[] | undefined;
    /** Recently released singles */
    singles?: SongPreview[] | undefined;
    /** Similar recommended artists */
    similarArtists?: ArtistPreview[] | undefined;
  }

  export interface SongPreview {
    /** Unique song ID */
    id: string;
    /** Song title */
    title: string;
    /** Artist names */
    artistNames: string[];
    /** Album name */
    albumName: string;
    /** Image sources in multiple resolutions */
    images: ImageSource[];
    /** Duration in seconds */
    durationSeconds?: number;
    /** Play count */
    playCount?: number;
    /** JioSaavn song URL */
    url: string;
    /** Language code */
    language?: string;
  }

  export interface AlbumPreview {
    /** Unique album ID */
    id: string;
    /** Album title */
    title: string;
    /** Artist names */
    artistNames: string[];
    /** Image sources in multiple resolutions */
    images: ImageSource[];
    /** Release year */
    releaseYear?: number | undefined;
    /** JioSaavn album URL */
    url: string;
    /** Language code */
    language?: string;
  }

  export interface ArtistPreview {
    /** Unique artist ID */
    id: string;
    /** Artist name */
    name: string;
    /** Image sources in multiple resolutions */
    images: ImageSource[];
    /** JioSaavn artist URL */
    url: string;
  }

  export interface PlaylistPreview {
    /** Unique playlist ID */
    id: string;
    /** Playlist title */
    title: string;
    /** Image sources in multiple resolutions */
    images: ImageSource[];
    /** Language code */
    language?: string;
    /** JioSaavn playlist URL */
    url: string;
  }

  export interface SearchAllResult {
    /** List of song previews matching the search query */
    songs: SongPreview[];
    /** Categorized search results */
    albums: AlbumPreview[];
    artists: ArtistPreview[];
    playlists: PlaylistPreview[];
  }
}

/**
 * Entity type discriminator for all JioSaavn entities
 * Used to differentiate between songs, albums, artists, and playlists
 */
export type EntityType = "song" | "album" | "artist" | "playlist";

/**
 * Paginated result wrapper for list responses
 *
 * @typeParam T - Type of items in the results array
 */
export interface Paginated<T> {
  /** Total number of available items */
  total: number;
  /** Current page number (0-indexed) */
  page: number;
  /** Maximum items per page */
  limit: number;
  /** Array of items for current page */
  results: T[];
}

/**
 * Discriminated union for all API results
 * Use the `success` field to determine success/failure
 *
 * @typeParam T - Type of successful data payload
 */
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/**
 * Successful API response with data payload
 *
 * @typeParam T - Type of the data payload
 */
export interface ApiSuccess<T> {
  /** Always true for successful responses */
  success: true;
  /** Response data payload */
  data: T;
}

/**
 * Failed API response with error details
 */
export interface ApiFailure {
  /** Always false for failed responses */
  success: false;
  /** Human-readable error message */
  message: string;
  /** Structured error code for programmatic handling */
  code: ErrorCode;
}

/**
 * Client configuration options
 */
export interface ClientConfig {
  /** Custom API base URL (defaults to official JioSaavn API) */
  baseUrl?: string;
  /** Custom fetch implementation (defaults to global fetch) */
  fetch?: typeof fetch;
  /** Request timeout in milliseconds (defaults to 10000) */
  timeoutMs?: number;
}

/** Sort order for artist content */
export type SortBy = "popularity" | "latest" | "alphabetical";

/** Sort direction */
export type SortOrder = "asc" | "desc";

/**
 * Search configuration for query-based endpoints
 */
export interface SearchOptions {
  /** Search query string */
  query: string;
  /** Page number (0-indexed) */
  page?: number;
  /** Maximum results per page */
  limit?: number;
}

/**
 * Options for fetching songs by ID
 */
export interface GetSongsByIdOptions {
  /** Single song ID or array of song IDs */
  ids: string | string[];
}

/**
 * Options for fetching song by share link
 */
export interface GetSongByLinkOptions {
  /** JioSaavn song share URL */
  link: string;
}

/**
 * Options for fetching song suggestions
 */
export interface GetSongSuggestionsOptions {
  /** Song ID to get suggestions for */
  id: string;
  /** Maximum number of suggestions */
  limit?: number;
}

/**
 * Options for fetching album by ID
 */
export interface GetAlbumByIdOptions {
  /** JioSaavn album ID */
  id: string;
}

/**
 * Options for fetching album by share link
 */
export interface GetAlbumByLinkOptions {
  /** JioSaavn album share URL */
  link: string;
}

/**
 * Options for fetching artist by ID
 */
export interface GetArtistByIdOptions {
  /** JioSaavn artist ID */
  id: string;
  /** Page number for paginated content */
  page?: number;
  /** Number of songs to fetch */
  songCount?: number;
  /** Number of albums to fetch */
  albumCount?: number;
  /** Sort method for content */
  sortBy?: SortBy;
  /** Sort direction */
  sortOrder?: SortOrder;
}

/**
 * Options for fetching artist by share link
 */
export interface GetArtistByLinkOptions {
  /** JioSaavn artist share URL */
  link: string;
  /** Page number for paginated content */
  page?: number;
  /** Number of songs to fetch */
  songCount?: number;
  /** Number of albums to fetch */
  albumCount?: number;
  /** Sort method for content */
  sortBy?: SortBy;
  /** Sort direction */
  sortOrder?: SortOrder;
}

/**
 * Options for fetching artist songs
 */
export interface GetArtistSongsOptions {
  /** JioSaavn artist ID */
  id: string;
  /** Page number (0-indexed) */
  page?: number;
  /** Sort method */
  sortBy?: SortBy;
  /** Sort direction */
  sortOrder?: SortOrder;
}

/**
 * Options for fetching artist albums
 */
export interface GetArtistAlbumsOptions {
  /** JioSaavn artist ID */
  id: string;
  /** Page number (0-indexed) */
  page?: number;
  /** Sort method */
  sortBy?: SortBy;
  /** Sort direction */
  sortOrder?: SortOrder;
}

/**
 * Options for fetching playlist by ID
 */
export interface GetPlaylistByIdOptions {
  /** JioSaavn playlist ID */
  id: string;
  /** Page number (0-indexed) */
  page?: number;
  /** Maximum tracks per page */
  limit?: number;
}

/**
 * Options for fetching playlist by share link
 */
export interface GetPlaylistByLinkOptions {
  /** JioSaavn playlist share URL */
  link: string;
  /** Page number (0-indexed) */
  page?: number;
  /** Maximum tracks per page */
  limit?: number;
}

/** Paginated artist songs result */
export type ArtistSongs = Paginated<Models.SongPreview>;

/** Paginated artist albums result */
export type ArtistAlbums = Paginated<Models.AlbumPreview>;

/**
 * Class-based JioSaavn API Client
 * Provides instance-specific configuration without global state
 *
 * @example
 * ```typescript
 * const client = new JioSaavnClient({
 *   baseUrl: 'https://custom-api.example.com',
 *   timeoutMs: 5000
 * });
 *
 * const result = await client.searchSongs({ query: 'test' });
 * if (result.success) {
 *   console.log(result.data.results);
 * } else {
 *   console.error(result.message, result.code);
 * }
 * ```
 */
export class JioSaavnClient {
  constructor(config?: ClientConfig);

  /**
   * Update client configuration
   *
   * @param config - Partial configuration to merge with existing config
   */
  updateConfig(config: Partial<ClientConfig>): void;

  /**
   * Get current client configuration
   *
   * @returns Immutable copy of current configuration
   */
  getConfig(): Readonly<ClientConfig>;

  /**
   * Search across all entity types simultaneously
   *
   * @param query - Search query string
   * @returns Categorized search cards for songs, albums, artists, and playlists
   *
   * @example
   * ```typescript
   * const result = await client.searchAll('Believer');
   * if (result.success) {
   *   console.log(result.data.songs);
   *   console.log(result.data.albums);
   * }
   * ```
   */
  searchAll(query: string): Promise<ApiResult<Models.SearchAllResult>>;

  /**
   * Search for songs
   *
   * @param options - Search configuration with query, pagination
   * @returns Paginated list of song previews
   *
   * @example
   * ```typescript
   * const result = await client.searchSongs({
   *   query: 'Believer',
   *   page: 0,
   *   limit: 20
   * });
   * if (result.success) {
   *   result.data.results.forEach(song => console.log(song.title));
   * }
   * ```
   */
  searchSongs(
    options: SearchOptions
  ): Promise<ApiResult<Paginated<Models.SongPreview>>>;

  /**
   * Search for albums
   *
   * @param options - Search configuration with query, pagination
   * @returns Paginated list of album previews
   *
   * @example
   * ```typescript
   * const result = await client.searchAlbums({ query: 'Evolve' });
   * if (result.success) {
   *   result.data.results.forEach(album => console.log(album.title));
   * }
   * ```
   */
  searchAlbums(
    options: SearchOptions
  ): Promise<ApiResult<Paginated<Models.AlbumPreview>>>;

  /**
   * Search for artists
   *
   * @param options - Search configuration with query, pagination
   * @returns Paginated list of artist previews
   *
   * @example
   * ```typescript
   * const result = await client.searchArtists({ query: 'Imagine Dragons' });
   * if (result.success) {
   *   result.data.results.forEach(artist => console.log(artist.name));
   * }
   * ```
   */
  searchArtists(
    options: SearchOptions
  ): Promise<ApiResult<Paginated<Models.ArtistPreview>>>;

  /**
   * Search for playlists
   *
   * @param options - Search configuration with query, pagination
   * @returns Paginated list of playlist previews
   *
   * @example
   * ```typescript
   * const result = await client.searchPlaylists({ query: 'Top 50' });
   * if (result.success) {
   *   result.data.results.forEach(playlist => console.log(playlist.title));
   * }
   * ```
   */
  searchPlaylists(
    options: SearchOptions
  ): Promise<ApiResult<Paginated<Models.PlaylistPreview>>>;

  /**
   * Fetch complete song details by ID
   *
   * @param options - Single song ID or array of song IDs
   * @returns Array of complete song entities with metadata, lyrics info, and download links
   *
   * @example
   * ```typescript
   * const result = await client.getSongsById({ ids: ['abc123', 'def456'] });
   * if (result.success) {
   *   result.data.forEach(song => {
   *     console.log(song.title, song.artists.primary);
   *     console.log(song.downloadLinks);
   *   });
   * }
   * ```
   */
  getSongsById(options: GetSongsByIdOptions): Promise<ApiResult<Models.Song[]>>;

  /**
   * Fetch song details from JioSaavn share link
   *
   * @param options - JioSaavn song share URL
   * @returns Complete song entity extracted from the share link
   *
   * @example
   * ```typescript
   * const result = await client.getSongByLink({
   *   link: 'https://www.jiosaavn.com/song/believer/...'
   * });
   * if (result.success) {
   *   console.log(result.data.title);
   *   console.log(result.data.downloadLinks);
   * }
   * ```
   */
  getSongByLink(options: GetSongByLinkOptions): Promise<ApiResult<Models.Song>>;

  /**
   * Get song recommendations based on a seed song
   *
   * @param options - Song ID and optional result limit
   * @returns Array of recommended similar songs
   *
   * @example
   * ```typescript
   * const result = await client.getSongSuggestions({
   *   id: 'abc123',
   *   limit: 10
   * });
   * if (result.success) {
   *   console.log('Similar songs:', result.data.map(s => s.title));
   * }
   * ```
   */
  getSongSuggestions(
    options: GetSongSuggestionsOptions
  ): Promise<ApiResult<Models.Song[]>>;

  /**
   * Fetch complete album details by ID
   *
   * @param options - JioSaavn album ID
   * @returns Complete album entity with track listing, artists, and metadata
   *
   * @example
   * ```typescript
   * const result = await client.getAlbumById({ id: 'abc123' });
   * if (result.success) {
   *   console.log(result.data.title);
   *   result.data.songs?.forEach(song => console.log(song.title));
   * }
   * ```
   */
  getAlbumById(options: GetAlbumByIdOptions): Promise<ApiResult<Models.Album>>;

  /**
   * Fetch album details from JioSaavn share link
   *
   * @param options - JioSaavn album share URL
   * @returns Complete album entity extracted from the share link
   *
   * @example
   * ```typescript
   * const result = await client.getAlbumByLink({
   *   link: 'https://www.jiosaavn.com/album/evolve/...'
   * });
   * if (result.success) {
   *   console.log(result.data.songs?.length);
   * }
   * ```
   */
  getAlbumByLink(
    options: GetAlbumByLinkOptions
  ): Promise<ApiResult<Models.Album>>;

  /**
   * Fetch complete artist profile by ID
   *
   * @param options - JioSaavn artist ID
   * @returns Complete artist profile with bio, top songs, albums, and similar artists
   *
   * @example
   * ```typescript
   * const result = await client.getArtistById({ id: 'abc123' });
   * if (result.success) {
   *   console.log(result.data.name, result.data.fanCount);
   *   result.data.topSongs?.forEach(song => console.log(song.title));
   * }
   * ```
   */
  getArtistById(
    options: GetArtistByIdOptions
  ): Promise<ApiResult<Models.Artist>>;

  /**
   * Fetch artist profile from JioSaavn share link
   *
   * @param options - JioSaavn artist share URL
   * @returns Complete artist profile extracted from the share link
   *
   * @example
   * ```typescript
   * const result = await client.getArtistByLink({
   *   link: 'https://www.jiosaavn.com/artist/imagine-dragons/...'
   * });
   * if (result.success) {
   *   console.log(result.data.bio);
   * }
   * ```
   */
  getArtistByLink(
    options: GetArtistByLinkOptions
  ): Promise<ApiResult<Models.Artist>>;

  /**
   * Fetch paginated songs for an artist
   *
   * @param options - Artist ID, page number, and sort preferences
   * @returns Paginated list of artist's songs
   *
   * @example
   * ```typescript
   * const result = await client.getArtistSongs({
   *   id: 'abc123',
   *   page: 0,
   *   sortBy: 'popularity',
   *   sortOrder: 'desc'
   * });
   * if (result.success) {
   *   console.log(`Total: ${result.data.total}`);
   *   result.data.results.forEach(song => console.log(song.title));
   * }
   * ```
   */
  getArtistSongs(
    options: GetArtistSongsOptions
  ): Promise<ApiResult<ArtistSongs>>;

  /**
   * Fetch paginated albums for an artist
   *
   * @param options - Artist ID, page number, and sort preferences
   * @returns Paginated list of artist's albums
   *
   * @example
   * ```typescript
   * const result = await client.getArtistAlbums({
   *   id: 'abc123',
   *   sortBy: 'latest'
   * });
   * if (result.success) {
   *   result.data.results.forEach(album => console.log(album.title));
   * }
   * ```
   */
  getArtistAlbums(
    options: GetArtistAlbumsOptions
  ): Promise<ApiResult<ArtistAlbums>>;

  /**
   * Fetch complete playlist details by ID
   *
   * @param options - Playlist ID with optional pagination
   * @returns Complete playlist entity with track listing and metadata
   *
   * @example
   * ```typescript
   * const result = await client.getPlaylistById({
   *   id: 'abc123',
   *   page: 0,
   *   limit: 50
   * });
   * if (result.success) {
   *   console.log(result.data.title, result.data.songCount);
   *   result.data.songs?.forEach(song => console.log(song.title));
   * }
   * ```
   */
  getPlaylistById(
    options: GetPlaylistByIdOptions
  ): Promise<ApiResult<Models.Playlist>>;

  /**
   * Fetch playlist details from JioSaavn share link
   *
   * @param options - JioSaavn playlist share URL with optional pagination
   * @returns Complete playlist entity with track listing and metadata extracted from the share link
   *
   * @example
   * ```typescript
   * const result = await client.getPlaylistByLink({
   *   link: 'https://www.jiosaavn.com/featured/top-50/...',
   *   limit: 100
   * });
   * if (result.success) {
   *   console.log(result.data.songs?.length);
   * }
   * ```
   */
  getPlaylistByLink(
    options: GetPlaylistByLinkOptions
  ): Promise<ApiResult<Models.Playlist>>;
}

/**
 * Search across all entity types simultaneously
 *
 * @param query - Search query string
 * @returns Categorized search cards for songs, albums, artists, and playlists
 *
 * @example
 * ```typescript
 * const result = await searchAll('Believer');
 * if (result.success) {
 *   console.log(result.data.songs);
 * }
 * ```
 */
export function searchAll(
  query: string
): Promise<ApiResult<Models.SearchAllResult>>;

/**
 * Search for songs
 *
 * @param options - Search configuration with query, pagination
 * @returns Paginated list of song previews
 *
 * @example
 * ```typescript
 * const result = await searchSongs({ query: 'Believer', limit: 20 });
 * if (result.success) {
 *   result.data.results.forEach(song => console.log(song.title));
 * }
 * ```
 */
export function searchSongs(
  options: SearchOptions
): Promise<ApiResult<Paginated<Models.SongPreview>>>;

/**
 * Search for albums
 *
 * @param options - Search configuration with query, pagination
 * @returns Paginated list of album previews
 *
 * @example
 * ```typescript
 * const result = await searchAlbums({ query: 'Evolve' });
 * if (result.success) {
 *   result.data.results.forEach(album => console.log(album.title));
 * }
 * ```
 */
export function searchAlbums(
  options: SearchOptions
): Promise<ApiResult<Paginated<Models.AlbumPreview>>>;

/**
 * Search for artists
 *
 * @param options - Search configuration with query, pagination
 * @returns Paginated list of artist previews
 *
 * @example
 * ```typescript
 * const result = await searchArtists({ query: 'Imagine Dragons' });
 * if (result.success) {
 *   result.data.results.forEach(artist => console.log(artist.name));
 * }
 * ```
 */
export function searchArtists(
  options: SearchOptions
): Promise<ApiResult<Paginated<Models.ArtistPreview>>>;

/**
 * Search for playlists
 *
 * @param options - Search configuration with query, pagination
 * @returns Paginated list of playlist previews
 *
 * @example
 * ```typescript
 * const result = await searchPlaylists({ query: 'Top 50' });
 * if (result.success) {
 *   result.data.results.forEach(playlist => console.log(playlist.title));
 * }
 * ```
 */
export function searchPlaylists(
  options: SearchOptions
): Promise<ApiResult<Paginated<Models.PlaylistPreview>>>;

/**
 * Fetch complete song details by ID
 *
 * @param options - Single song ID or array of song IDs
 * @returns Array of complete song entities with metadata, lyrics info, and download links
 *
 * @example
 * ```typescript
 * const result = await getSongsById({ ids: ['abc123', 'def456'] });
 * if (result.success) {
 *   result.data.forEach(song => {
 *     console.log(song.title, song.artists.primary);
 *     console.log(song.downloadLinks);
 *   });
 * }
 * ```
 */
export function getSongsById(
  options: GetSongsByIdOptions
): Promise<ApiResult<Models.Song[]>>;

/**
 * Fetch song details from JioSaavn share link
 *
 * @param options - JioSaavn song share URL
 * @returns Complete song entity extracted from the share link
 *
 * @example
 * ```typescript
 * const result = await getSongByLink({
 *   link: 'https://www.jiosaavn.com/song/believer/...'
 * });
 * if (result.success) {
 *   console.log(result.data.title);
 *   console.log(result.data.downloadLinks);
 * }
 * ```
 */
export function getSongByLink(
  options: GetSongByLinkOptions
): Promise<ApiResult<Models.Song>>;

/**
 * Get song recommendations based on a seed song
 *
 * @param options - Song ID and optional result limit
 * @returns Array of recommended similar songs
 *
 * @example
 * ```typescript
 * const result = await getSongSuggestions({ id: 'abc123', limit: 10 });
 * if (result.success) {
 *   console.log('Similar songs:', result.data.map(s => s.title));
 * }
 * ```
 */
export function getSongSuggestions(
  options: GetSongSuggestionsOptions
): Promise<ApiResult<Models.Song[]>>;

/**
 * Fetch complete album details by ID
 *
 * @param options - JioSaavn album ID
 * @returns Complete album entity with track listing, artists, and metadata
 *
 * @example
 * ```typescript
 * const result = await getAlbumById({ id: 'abc123' });
 * if (result.success) {
 *   console.log(result.data.title);
 *   result.data.songs?.forEach(song => console.log(song.title));
 * }
 * ```
 */
export function getAlbumById(
  options: GetAlbumByIdOptions
): Promise<ApiResult<Models.Album>>;

/**
 * Fetch album details from JioSaavn share link
 *
 * @param options - JioSaavn album share URL
 * @returns Complete album entity extracted from the share link
 *
 * @example
 * ```typescript
 * const result = await getAlbumByLink({
 *   link: 'https://www.jiosaavn.com/album/evolve/...'
 * });
 * if (result.success) {
 *   console.log(result.data.songs?.length);
 * }
 * ```
 */
export function getAlbumByLink(
  options: GetAlbumByLinkOptions
): Promise<ApiResult<Models.Album>>;

/**
 * Fetch complete artist profile by ID
 *
 * @param options - JioSaavn artist ID
 * @returns Complete artist profile with bio, top songs, albums, and similar artists
 *
 * @example
 * ```typescript
 * const result = await getArtistById({ id: 'abc123' });
 * if (result.success) {
 *   console.log(result.data.name, result.data.fanCount);
 *   result.data.topSongs?.forEach(song => console.log(song.title));
 * }
 * ```
 */
export function getArtistById(
  options: GetArtistByIdOptions
): Promise<ApiResult<Models.Artist>>;

/**
 * Fetch artist profile from JioSaavn share link
 *
 * @param options - JioSaavn artist share URL
 * @returns Complete artist profile extracted from the share link
 *
 * @example
 * ```typescript
 * const result = await getArtistByLink({
 *   link: 'https://www.jiosaavn.com/artist/imagine-dragons/...'
 * });
 * if (result.success) {
 *   console.log(result.data.bio);
 * }
 * ```
 */
export function getArtistByLink(
  options: GetArtistByLinkOptions
): Promise<ApiResult<Models.Artist>>;

/**
 * Fetch paginated songs for an artist
 *
 * @param options - Artist ID, page number, and sort preferences
 * @returns Paginated list of artist's songs
 *
 * @example
 * ```typescript
 * const result = await getArtistSongs({
 *   id: 'abc123',
 *   page: 0,
 *   sortBy: 'popularity',
 *   sortOrder: 'desc'
 * });
 * if (result.success) {
 *   console.log(`Total: ${result.data.total}`);
 *   result.data.results.forEach(song => console.log(song.title));
 * }
 * ```
 */
export function getArtistSongs(
  options: GetArtistSongsOptions
): Promise<ApiResult<ArtistSongs>>;

/**
 * Fetch paginated albums for an artist
 *
 * @param options - Artist ID, page number, and sort preferences
 * @returns Paginated list of artist's albums
 *
 * @example
 * ```typescript
 * const result = await getArtistAlbums({
 *   id: 'abc123',
 *   sortBy: 'latest'
 * });
 * if (result.success) {
 *   result.data.results.forEach(album => console.log(album.title));
 * }
 * ```
 */
export function getArtistAlbums(
  options: GetArtistAlbumsOptions
): Promise<ApiResult<ArtistAlbums>>;

/**
 * Fetch complete playlist details by ID
 *
 * @param options - Playlist ID with optional pagination
 * @returns Complete playlist entity with track listing and metadata
 *
 * @example
 * ```typescript
 * const result = await getPlaylistById({
 *   id: 'abc123',
 *   page: 0,
 *   limit: 50
 * });
 * if (result.success) {
 *   console.log(result.data.title, result.data.songCount);
 *   result.data.songs?.forEach(song => console.log(song.title));
 * }
 * ```
 */
export function getPlaylistById(
  options: GetPlaylistByIdOptions
): Promise<ApiResult<Models.Playlist>>;

/**
 * Fetch playlist details from JioSaavn share link
 *
 * @param options - JioSaavn playlist share URL with optional pagination
 * @returns Complete playlist entity with track listing and metadata extracted from the share link
 *
 * @example
 * ```typescript
 * const result = await getPlaylistByLink({
 *   link: 'https://www.jiosaavn.com/featured/top-50/...',
 *   limit: 100
 * });
 * if (result.success) {
 *   console.log(result.data.songs?.length);
 * }
 * ```
 */
export function getPlaylistByLink(
  options: GetPlaylistByLinkOptions
): Promise<ApiResult<Models.Playlist>>;
