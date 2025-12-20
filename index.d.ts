/**
 * JioSaavn API Client - Type Definitions
 * @module jiosaavn-api-client
 */

/**
 * Image quality and URL pair
 */
export interface ImageLink {
  /** Image quality identifier (e.g., "50x50", "150x150", "500x500") */
  quality: string
  /** Direct image URL */
  url: string
}

/**
 * Audio download quality and URL pair
 */
export interface DownloadLink {
  /** Audio quality/bitrate (e.g., "96kbps", "160kbps", "320kbps") */
  quality: string
  /** Direct download URL */
  url: string
}

/**
 * Complete Song object with all available metadata
 */
export interface Song {
  /** Unique song identifier */
  id: string
  /** Song title */
  title: string
  /** Subtitle or alternate title */
  subtitle?: string
  /** Song description */
  description?: string
  /** Primary artist information */
  artist: {
    id: string
    name: string
    role?: string
    image?: ImageLink[]
    url?: string
  }
  /** Array of featuring/additional artists */
  artists?: {
    id: string
    name: string
    role?: string
    image?: ImageLink[]
    url?: string
  }[]
  /** Album information */
  album: {
    id: string
    name: string
    description?: string
    image?: ImageLink[]
    url?: string
  }
  /** Primary cover image */
  image: ImageLink[]
  /** Song language (e.g., "hindi", "english") */
  language?: string
  /** Song genre(s) */
  genre?: string[]
  /** Release/publish date in ISO format */
  date?: string
  /** Duration in seconds */
  duration: number
  /** Number of times the song has been played/listened */
  playCount?: number
  /** Number of user favorites/saves */
  favoriteCount?: number
  /** Lyrics availability */
  lyrics?: string | null
  /** Encrypted media URL for decryption */
  encryptedMediaUrl?: string
  /** Available download links in different qualities */
  downloadLinks?: DownloadLink[]
  /** Whether the song can be played */
  playable?: boolean
  /** Whether the song can be downloaded */
  downloadable?: boolean
  /** JioSaavn website URL */
  url?: string
  /** Additional metadata or raw response fields */
  [key: string]: any
}

/**
 * Complete Album object
 */
export interface Album {
  /** Unique album identifier */
  id: string
  /** Album title */
  title: string
  /** Album description */
  description?: string
  /** Primary artist */
  artist: {
    id: string
    name: string
    image?: ImageLink[]
    url?: string
  }
  /** Album cover image */
  image: ImageLink[]
  /** Array of songs in the album */
  songs?: Song[]
  /** Number of songs in album */
  songCount?: number
  /** Album language */
  language?: string
  /** Album genre(s) */
  genre?: string[]
  /** Release/publish date */
  date?: string
  /** Number of plays/listens */
  playCount?: number
  /** JioSaavn website URL */
  url?: string
  /** Additional metadata or raw response fields */
  [key: string]: any
}

/**
 * Complete Artist object
 */
export interface Artist {
  /** Unique artist identifier */
  id: string
  /** Artist name */
  name: string
  /** Artist description/bio */
  description?: string
  /** Artist profile image */
  image: ImageLink[]
  /** Array of top songs by this artist */
  topSongs?: Song[]
  /** Array of albums by this artist */
  albums?: Album[]
  /** Total number of songs */
  songCount?: number
  /** Total number of albums */
  albumCount?: number
  /** Most popular language */
  language?: string
  /** Primary genres */
  genre?: string[]
  /** Total followers/fans */
  followerCount?: number
  /** JioSaavn website URL */
  url?: string
  /** Additional metadata or raw response fields */
  [key: string]: any
}

/**
 * Complete Playlist object
 */
export interface Playlist {
  /** Unique playlist identifier */
  id: string
  /** Playlist title */
  title: string
  /** Playlist description */
  description?: string
  /** Playlist cover image */
  image: ImageLink[]
  /** Creator/owner information */
  owner?: {
    id?: string
    name: string
    image?: ImageLink[]
  }
  /** Array of songs in the playlist */
  songs?: Song[]
  /** Total number of songs in playlist */
  songCount: number
  /** Playlist visibility (public/private) */
  isPublic?: boolean
  /** Total number of followers */
  followerCount?: number
  /** Total number of plays */
  playCount?: number
  /** Playlist language */
  language?: string
  /** Genre tags */
  genre?: string[]
  /** Creation date */
  createdDate?: string
  /** Last modification date */
  modifiedDate?: string
  /** JioSaavn website URL */
  url?: string
  /** Additional metadata or raw response fields */
  [key: string]: any
}

/**
 * Search result item (generic)
 */
export interface SearchResult {
  /** Item type */
  type: 'song' | 'album' | 'artist' | 'playlist'
  /** Unique identifier */
  id: string
  /** Title/Name */
  title: string
  /** Image/Cover art */
  image?: ImageLink[]
  /** Description or additional info */
  description?: string
  /** JioSaavn website URL */
  url?: string
}

/**
 * Paginated search response
 */
export interface PaginatedResponse<T> {
  /** Array of search results */
  results: T[]
  /** Total number of results available */
  total: number
  /** Current page number (0-indexed) */
  page?: number
  /** Number of results per page */
  limit?: number
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T
  /** Whether request was successful */
  ok: boolean
  /** HTTP status code */
  status: number
}

/**
 * Common sorting types
 */
export type SortBy = 'popularity' | 'latest' | 'alphabetical'

/**
 * Sort order direction
 */
export type SortOrder = 'asc' | 'desc'

/**
 * API context/environment
 */
export type ApiContext = 'web6dot0' | 'android'

// ============================================================================
// SEARCH FUNCTION ARGUMENTS
// ============================================================================

/**
 * Arguments for search functions
 */
export interface SearchArgs {
  /** Search query string */
  query: string
  /** Page number (0-indexed, default: 0) */
  page?: number
  /** Number of results per page (default: 10) */
  limit?: number
}

// ============================================================================
// SONG FUNCTION ARGUMENTS
// ============================================================================

/**
 * Arguments for getting songs by ID(s)
 */
export interface GetSongsByIdArgs {
  /** Single song ID or array of song IDs */
  ids: string | string[]
}

/**
 * Arguments for getting songs by JioSaavn link
 */
export interface GetSongsByLinkArgs {
  /** JioSaavn song URL */
  link: string
}

/**
 * Arguments for song suggestions/radio
 */
export interface GetSongSuggestionsArgs {
  /** Song ID to base suggestions on */
  songId: string
  /** Number of suggestions to return (default: 10) */
  limit?: number
}

// ============================================================================
// ALBUM FUNCTION ARGUMENTS
// ============================================================================

/**
 * Arguments for getting album by ID
 */
export interface GetAlbumByIdArgs {
  /** Album identifier */
  id: string
}

/**
 * Arguments for getting album by JioSaavn link
 */
export interface GetAlbumByLinkArgs {
  /** JioSaavn album URL */
  link: string
}

// ============================================================================
// ARTIST FUNCTION ARGUMENTS
// ============================================================================

/**
 * Arguments for getting artist by ID
 */
export interface GetArtistByIdArgs {
  /** Artist identifier */
  id: string
  /** Page number (0-indexed, default: 0) */
  page?: number
  /** Number of songs to fetch (default: 10) */
  songCount?: number
  /** Number of albums to fetch (default: 10) */
  albumCount?: number
  /** Sort songs/albums by this criterion (default: 'popularity') */
  sortBy?: SortBy
  /** Sort order (default: 'asc') */
  sortOrder?: SortOrder
}

/**
 * Arguments for getting artist by JioSaavn link
 */
export interface GetArtistByLinkArgs
  extends Omit<GetArtistByIdArgs, 'id'> {
  /** JioSaavn artist URL */
  link: string
}

/**
 * Arguments for getting artist's songs
 */
export interface GetArtistSongsArgs {
  /** Artist identifier */
  id: string
  /** Page number (0-indexed, default: 0) */
  page?: number
  /** Sort songs by this criterion (default: 'popularity') */
  sortBy?: SortBy
  /** Sort order (default: 'asc') */
  sortOrder?: SortOrder
}

/**
 * Arguments for getting artist's albums
 */
export interface GetArtistAlbumsArgs {
  /** Artist identifier */
  id: string
  /** Page number (0-indexed, default: 0) */
  page?: number
  /** Sort albums by this criterion (default: 'popularity') */
  sortBy?: SortBy
  /** Sort order (default: 'asc') */
  sortOrder?: SortOrder
}

// ============================================================================
// PLAYLIST FUNCTION ARGUMENTS
// ============================================================================

/**
 * Arguments for getting playlist by ID
 */
export interface GetPlaylistByIdArgs {
  /** Playlist identifier */
  id: string
  /** Page number (0-indexed, default: 0) */
  page?: number
  /** Number of songs per page (default: 10) */
  limit?: number
}

/**
 * Arguments for getting playlist by JioSaavn link
 */
export interface GetPlaylistByLinkArgs extends Omit<GetPlaylistByIdArgs, 'id'> {
  /** JioSaavn playlist URL */
  link: string
}

// ============================================================================
// EXPORTED FUNCTIONS
// ============================================================================

// Search Functions
/**
 * Search all entities (songs, albums, artists, playlists)
 * @param query - Search query string
 * @returns Promise with aggregated search results
 */
export function searchAll(query: string): Promise<ApiResponse<any>>

/**
 * Search only songs
 * @param args - Search arguments
 * @returns Promise with paginated song results
 */
export function searchSongs(args: SearchArgs): Promise<ApiResponse<PaginatedResponse<Song>>>

/**
 * Search only albums
 * @param args - Search arguments
 * @returns Promise with paginated album results
 */
export function searchAlbums(args: SearchArgs): Promise<ApiResponse<PaginatedResponse<Album>>>

/**
 * Search only artists
 * @param args - Search arguments
 * @returns Promise with paginated artist results
 */
export function searchArtists(args: SearchArgs): Promise<ApiResponse<PaginatedResponse<Artist>>>

/**
 * Search only playlists
 * @param args - Search arguments
 * @returns Promise with paginated playlist results
 */
export function searchPlaylists(args: SearchArgs): Promise<ApiResponse<PaginatedResponse<Playlist>>>

// Song Functions
/**
 * Get song details by ID(s). Returns same Song object structure as search results.
 * @param ids - Single song ID or array of song IDs
 * @returns Promise with array of complete Song objects
 * @example
 * const songs = await getSongsById('song-id-123');
 * const songs = await getSongsById(['song-id-1', 'song-id-2']);
 */
export function getSongsById(ids: string | string[]): Promise<ApiResponse<{ songs: Song[] }>>

/**
 * Get song details from JioSaavn link
 * @param link - JioSaavn song URL
 * @returns Promise with Song object
 */
export function getSongByLink(link: string): Promise<ApiResponse<{ songs: Song[] }>>

/**
 * Get song suggestions/radio based on a song
 * @param args - Song ID and optional limit
 * @returns Promise with array of suggested Song objects
 */
export function getSongSuggestions(
  args: GetSongSuggestionsArgs
): Promise<Song[]>

/**
 * Create a radio station for a song (internal)
 * @param songId - Song identifier
 * @returns Promise with station ID
 * @internal
 */
export function createSongStation(songId: string): Promise<string>

// Album Functions
/**
 * Get album details by ID. Returns Album object with full song array.
 * @param id - Album identifier
 * @returns Promise with complete Album object
 */
export function getAlbumById(id: string): Promise<ApiResponse<Album>>

/**
 * Get album details from JioSaavn link
 * @param link - JioSaavn album URL
 * @returns Promise with Album object
 */
export function getAlbumByLink(link: string): Promise<ApiResponse<Album>>

// Artist Functions
/**
 * Get artist details by ID with their top songs and albums
 * @param args - Artist ID and optional filtering parameters
 * @returns Promise with complete Artist object including songs and albums
 */
export function getArtistById(args: GetArtistByIdArgs): Promise<ApiResponse<Artist>>

/**
 * Get artist details from JioSaavn link
 * @param args - JioSaavn link and optional filtering parameters
 * @returns Promise with complete Artist object
 */
export function getArtistByLink(args: GetArtistByLinkArgs): Promise<ApiResponse<Artist>>

/**
 * Get paginated list of songs by an artist
 * @param args - Artist ID and pagination parameters
 * @returns Promise with paginated Song results
 */
export function getArtistSongs(args: GetArtistSongsArgs): Promise<ApiResponse<PaginatedResponse<Song>>>

/**
 * Get paginated list of albums by an artist
 * @param args - Artist ID and pagination parameters
 * @returns Promise with paginated Album results
 */
export function getArtistAlbums(args: GetArtistAlbumsArgs): Promise<ApiResponse<PaginatedResponse<Album>>>

// Playlist Functions
/**
 * Get playlist details by ID. Returns Playlist object with all songs in same Song format.
 * @param args - Playlist ID and optional pagination parameters
 * @returns Promise with complete Playlist object including all songs
 * @example
 * const playlist = await getPlaylistById({ id: 'playlist-123' });
 * playlist.songs.forEach(song => console.log(song.title)); // Same Song objects as search
 */
export function getPlaylistById(args: GetPlaylistByIdArgs): Promise<ApiResponse<Playlist>>

/**
 * Get playlist details from JioSaavn link
 * @param args - JioSaavn link and optional pagination parameters
 * @returns Promise with complete Playlist object
 */
export function getPlaylistByLink(args: GetPlaylistByLinkArgs): Promise<ApiResponse<Playlist>>

// Utility exports
/**
 * Helper function to create image URLs in different qualities
 * @param imageLink - Base image URL
 * @returns Array of ImageLink objects with different qualities
 */
export function createImageLinks(imageLink: string): ImageLink[]

/**
 * Helper function to decrypt and create download URLs from encrypted media URL
 * @param encryptedMediaUrl - Encrypted media URL from API response
 * @returns Array of DownloadLink objects in different bitrates
 */
export function createDownloadLinks(encryptedMediaUrl: string): DownloadLink[]

/**
 * Extract token from JioSaavn URLs
 */
export interface TokenExtractors {
  /** Extract token from song URL */
  song: (url: string) => string | undefined
  /** Extract token from album URL */
  album: (url: string) => string | undefined
  /** Extract token from artist URL */
  artist: (url: string) => string | undefined
  /** Extract token from playlist URL */
  playlist: (url: string) => string | undefined
}

export const tokenExtractors: TokenExtractors
