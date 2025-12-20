/**
 * JioSaavn API Client
 * Pure-JS client for JioSaavn's native API
 * Works on Node, Bun, Cloudflare Workers, Vercel Edge, and Deno
 *
 * @example
 * // Search for songs
 * const songs = await searchSongs({ query: 'blinding lights', limit: 10 });
 * songs.data.results.forEach(song => console.log(song.title));
 *
 * @example
 * // Get song details by ID
 * const result = await getSongsById('song-id-123');
 * result.data.songs.forEach(song => {
 *   console.log(song.title);
 *   console.log(song.image); // Image links in different qualities
 *   console.log(song.downloadLinks); // Download links in different bitrates
 * });
 *
 * @example
 * // Get playlist with all songs in same format as search
 * const result = await getPlaylistById({ id: 'playlist-id-123' });
 * result.data.songs?.forEach(song => console.log(song.title));
 *
 * @module jiosaavn-api-client
 */

import { endpoints, fetchFromSaavn } from './fetch.js'
import { ensureToken, stringifyIds, tokenExtractors, createImageLinks, createDownloadLinks } from './utils.js'
import type {
  // Core types
  Song,
  Album,
  Artist,
  Playlist,
  SearchResult,
  PaginatedResponse,
  ApiResponse,
  SortBy,
  SortOrder,
  ApiContext,
  // Arguments types
  SearchArgs,
  GetSongsByIdArgs,
  GetSongsByLinkArgs,
  GetSongSuggestionsArgs,
  GetAlbumByIdArgs,
  GetAlbumByLinkArgs,
  GetArtistByIdArgs,
  GetArtistByLinkArgs,
  GetArtistSongsArgs,
  GetArtistAlbumsArgs,
  GetPlaylistByIdArgs,
  GetPlaylistByLinkArgs,
  // Utility types
  ImageLink,
  DownloadLink
} from './index.d.js'

// ============================================================================
// INTERNAL RESPONSE TYPES
// ============================================================================

/**
 * Raw API response for song details
 * @internal
 */
interface SongDetailsResponse {
  songs: Song[]
}

/**
 * Raw API response for playlists
 * @internal
 */
interface PlaylistResponse extends Playlist {
  songs?: Song[]
}

/**
 * Raw API response for albums
 * @internal
 */
interface AlbumResponse extends Album {
  songs?: Song[]
}

/**
 * Raw API response for artist details
 * @internal
 */
interface ArtistResponse extends Artist {
  topSongs?: Song[]
  albums?: Album[]
}

/**
 * Raw API response for song suggestions
 * @internal
 */
interface SuggestionResponse {
  stationid: string
  [key: string]: { song?: Song } | string
}

/**
 * Raw API response for search results
 * @internal
 */
interface SearchListResponse {
  total: number
  start?: number
  results: any[]
}

/**
 * Raw API response for all search types
 * @internal
 */
interface SearchAllResponse {
  [key: string]: any
}

// ============================================================================
// DATA TRANSFORMATION HELPERS
// ============================================================================

/**
 * Transform a raw Song from API to include image and downloadLinks
 * @internal
 */
const transformSong = (song: any): Song => {
  if (!song) return song
  
  const transformed = { ...song }
  
  // Transform image URL to ImageLink array if needed
  if (song.image && typeof song.image === 'string') {
    transformed.image = createImageLinks(song.image)
  } else if (!transformed.image) {
    transformed.image = []
  }
  
  // Transform encrypted media URL to downloadLinks if available
  if (song.encryptedMediaUrl && !song.downloadLinks) {
    transformed.downloadLinks = createDownloadLinks(song.encryptedMediaUrl)
  }
  
  return transformed
}

/**
 * Transform an array of songs to include image and downloadLinks
 * @internal
 */
const transformSongs = (songs: any[]): Song[] => {
  return songs?.map(transformSong) || []
}

/**
 * Transform a raw Album from API to include image and transformed songs
 * @internal
 */
const transformAlbum = (album: any): Album => {
  if (!album) return album
  
  const transformed = { ...album }
  
  // Transform album image
  if (album.image && typeof album.image === 'string') {
    transformed.image = createImageLinks(album.image)
  } else if (!transformed.image) {
    transformed.image = []
  }
  
  // Transform artist image if present
  if (transformed.artist?.image && typeof transformed.artist.image === 'string') {
    transformed.artist.image = createImageLinks(transformed.artist.image)
  }
  
  // Transform all songs in album
  if (album.songs && Array.isArray(album.songs)) {
    transformed.songs = transformSongs(album.songs)
  }
  
  return transformed
}

/**
 * Transform a raw Artist from API to include image and transformed songs/albums
 * @internal
 */
const transformArtist = (artist: any): Artist => {
  if (!artist) return artist
  
  const transformed = { ...artist }
  
  // Transform artist image
  if (artist.image && typeof artist.image === 'string') {
    transformed.image = createImageLinks(artist.image)
  } else if (!transformed.image) {
    transformed.image = []
  }
  
  // Transform top songs
  if (artist.topSongs && Array.isArray(artist.topSongs)) {
    transformed.topSongs = transformSongs(artist.topSongs)
  }
  
  // Transform albums
  if (artist.albums && Array.isArray(artist.albums)) {
    transformed.albums = artist.albums.map(transformAlbum)
  }
  
  return transformed
}

/**
 * Transform a raw Playlist from API to include image and transformed songs
 * @internal
 */
const transformPlaylist = (playlist: any): Playlist => {
  if (!playlist) return playlist
  
  const transformed = { ...playlist }
  
  // Transform playlist image
  if (playlist.image && typeof playlist.image === 'string') {
    transformed.image = createImageLinks(playlist.image)
  } else if (!transformed.image) {
    transformed.image = []
  }
  
  // Transform owner image if present
  if (transformed.owner?.image && typeof transformed.owner.image === 'string') {
    transformed.owner.image = createImageLinks(transformed.owner.image)
  }
  
  // Transform all songs in playlist
  if (playlist.songs && Array.isArray(playlist.songs)) {
    transformed.songs = transformSongs(playlist.songs)
  }
  
  return transformed
}

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

/**
 * Search all types of content (songs, albums, artists, playlists)
 * via autocomplete suggestions
 *
 * @param query - Search query string
 * @returns Promise with raw aggregated search results
 *
 * @example
 * const result = await searchAll('blinding');
 * // May contain songs, albums, artists, playlists matching "blinding"
 */
export const searchAll = (query: string): Promise<ApiResponse<SearchAllResponse>> =>
  fetchFromSaavn<SearchAllResponse>({
    endpoint: endpoints.search.all,
    params: { query }
  })

/**
 * Search only songs
 *
 * @param args - Search arguments (query, page, limit)
 * @returns Promise with paginated Song results with same structure as getSongsById
 *
 * @example
 * const result = await searchSongs({ query: 'blinding lights', page: 0, limit: 10 });
 * result.data.results.forEach(song => {
 *   console.log(song.title);
 *   console.log(song.image); // Image links
 *   console.log(song.duration); // Duration in seconds
 * });
 */
export const searchSongs = async ({ query, page = 0, limit = 10 }: SearchArgs): Promise<ApiResponse<PaginatedResponse<Song>>> => {
  const response = await fetchFromSaavn<PaginatedResponse<Song>>({
    endpoint: endpoints.search.songs,
    params: { q: query, p: page, n: limit }
  })
  
  if (response.ok && response.data?.results) {
    response.data.results = transformSongs(response.data.results)
  }
  
  return response
}

/**
 * Search only albums
 *
 * @param args - Search arguments
 * @returns Promise with paginated Album results
 */
export const searchAlbums = async ({ query, page = 0, limit = 10 }: SearchArgs): Promise<ApiResponse<PaginatedResponse<Album>>> => {
  const response = await fetchFromSaavn<PaginatedResponse<Album>>({
    endpoint: endpoints.search.albums,
    params: { q: query, p: page, n: limit }
  })
  
  if (response.ok && response.data?.results) {
    response.data.results = response.data.results.map(transformAlbum)
  }
  
  return response
}

/**
 * Search only artists
 *
 * @param args - Search arguments
 * @returns Promise with paginated Artist results
 */
export const searchArtists = async ({ query, page = 0, limit = 10 }: SearchArgs): Promise<ApiResponse<PaginatedResponse<Artist>>> => {
  const response = await fetchFromSaavn<PaginatedResponse<Artist>>({
    endpoint: endpoints.search.artists,
    params: { q: query, p: page, n: limit }
  })
  
  if (response.ok && response.data?.results) {
    response.data.results = response.data.results.map(transformArtist)
  }
  
  return response
}

/**
 * Search only playlists
 *
 * @param args - Search arguments
 * @returns Promise with paginated Playlist results
 */
export const searchPlaylists = async ({ query, page = 0, limit = 10 }: SearchArgs): Promise<ApiResponse<PaginatedResponse<Playlist>>> => {
  const response = await fetchFromSaavn<PaginatedResponse<Playlist>>({
    endpoint: endpoints.search.playlists,
    params: { q: query, p: page, n: limit }
  })
  
  if (response.ok && response.data?.results) {
    response.data.results = response.data.results.map(transformPlaylist)
  }
  
  return response
}

// ============================================================================
// SONG FUNCTIONS
// ============================================================================

/**
 * Get complete song details by ID(s)
 * Returns Song objects with the same structure as search results
 * Includes image links in different qualities and download links in different bitrates
 *
 * @param ids - Single song ID or array of song IDs
 * @returns Promise with array of complete Song objects
 *
 * @example
 * // Single song
 * const result = await getSongsById('song-id-123');
 * const song = result.data.songs[0];
 * console.log(song.title, song.duration);
 * console.log(song.image); // [{ quality: '50x50', url: '...' }, ...]
 * console.log(song.downloadLinks); // [{ quality: '320kbps', url: '...' }, ...]
 *
 * @example
 * // Multiple songs
 * const result = await getSongsById(['song-1', 'song-2', 'song-3']);
 * result.data.songs.forEach(song => console.log(song.title));
 */
export const getSongsById = async (ids: string | string[]): Promise<ApiResponse<SongDetailsResponse>> => {
  const response = await fetchFromSaavn<SongDetailsResponse>({
    endpoint: endpoints.songs.id,
    params: { pids: stringifyIds(ids) }
  })
  
  if (response.ok && response.data?.songs) {
    response.data.songs = transformSongs(response.data.songs)
  }
  
  return response
}

/**
 * Get song details from a JioSaavn URL
 *
 * @param link - Full JioSaavn song URL
 * @returns Promise with Song object
 *
 * @example
 * const result = await getSongByLink('https://www.jiosaavn.com/song/blinding-lights/...');
 * console.log(result.data.songs[0].title);
 */
export const getSongByLink = async (link: string): Promise<ApiResponse<SongDetailsResponse>> => {
  const token = ensureToken(tokenExtractors.song(link), 'song')

  const response = await fetchFromSaavn<SongDetailsResponse>({
    endpoint: endpoints.songs.link,
    params: { token, type: 'song' }
  })
  
  if (response.ok && response.data?.songs) {
    response.data.songs = transformSongs(response.data.songs)
  }
  
  return response
}

/**
 * Create a radio station for a specific song
 * Used internally by getSongSuggestions
 *
 * @param songId - Song identifier
 * @returns Promise with station ID for use in getSongSuggestions
 * @throws Error if station creation fails
 * @internal
 */
export const createSongStation = async (songId: string): Promise<string> => {
  const encodedSongId = JSON.stringify([encodeURIComponent(songId)])

  const { data, ok } = await fetchFromSaavn<{ stationid: string }>({
    endpoint: endpoints.songs.station,
    params: { entity_id: encodedSongId, entity_type: 'queue' },
    context: 'android'
  })

  if (!ok || !data?.stationid) throw new Error('Unable to create station for song suggestions')

  return data.stationid
}

/**
 * Get song suggestions/radio recommendations based on a song
 * Returns Song objects with the same structure as search and getSongsById
 *
 * @param args - Song ID and optional limit
 * @returns Promise with array of suggested Song objects
 * @throws Error if suggestions cannot be retrieved
 *
 * @example
 * const songs = await getSongSuggestions({ songId: 'song-id-123', limit: 20 });
 * songs.forEach(song => console.log(song.title)); // Similar songs
 */
export const getSongSuggestions = async ({ songId, limit = 10 }: GetSongSuggestionsArgs): Promise<Song[]> => {
  const stationId = await createSongStation(songId)

  const { data, ok } = await fetchFromSaavn<SuggestionResponse>({
    endpoint: endpoints.songs.suggestions,
    params: { stationid: stationId, k: limit },
    context: 'android'
  })

  if (!ok || !data) throw new Error('No suggestions found for the given song')

  const { stationid, ...rest } = data
  const suggestions = Object.values(rest)
    .map((entry) => (entry && typeof entry === 'object' ? entry.song : undefined))
    .filter(Boolean) as Song[]

  return transformSongs(suggestions.slice(0, limit))
}

// ============================================================================
// ALBUM FUNCTIONS
// ============================================================================

/**
 * Get complete album details by ID
 * Includes all songs in the album with Song object structure
 *
 * @param id - Album identifier
 * @returns Promise with complete Album object including all songs
 *
 * @example
 * const result = await getAlbumById('album-id-123');
 * const album = result.data;
 * console.log(album.title, album.songCount);
 * album.songs?.forEach(song => console.log(song.title)); // Same Song objects as search
 */
export const getAlbumById = async (id: string): Promise<ApiResponse<AlbumResponse>> => {
  const response = await fetchFromSaavn<AlbumResponse>({
    endpoint: endpoints.albums.id,
    params: { albumid: id }
  })
  
  if (response.ok && response.data) {
    response.data = transformAlbum(response.data)
  }
  
  return response
}

/**
 * Get album details from a JioSaavn URL
 *
 * @param link - Full JioSaavn album URL
 * @returns Promise with Album object
 */
export const getAlbumByLink = async (link: string): Promise<ApiResponse<AlbumResponse>> => {
  const token = ensureToken(tokenExtractors.album(link), 'album')

  const response = await fetchFromSaavn<AlbumResponse>({
    endpoint: endpoints.albums.link,
    params: { token, type: 'album' }
  })
  
  if (response.ok && response.data) {
    response.data = transformAlbum(response.data)
  }
  
  return response
}

// ============================================================================
// ARTIST FUNCTIONS
// ============================================================================

/**
 * Get complete artist details by ID
 * Includes top songs and albums with full Song/Album object structures
 *
 * @param args - Artist ID and optional filtering parameters
 * @returns Promise with complete Artist object including topSongs and albums
 *
 * @example
 * const result = await getArtistById({
 *   id: 'artist-id-123',
 *   songCount: 20,
 *   albumCount: 10,
 *   sortBy: 'popularity',
 *   sortOrder: 'desc'
 * });
 * const artist = result.data;
 * artist.topSongs?.forEach(song => console.log(song.title));
 */
export const getArtistById = async ({
  id,
  page = 0,
  songCount = 10,
  albumCount = 10,
  sortBy = 'popularity',
  sortOrder = 'asc'
}: GetArtistByIdArgs): Promise<ApiResponse<ArtistResponse>> => {
  const response = await fetchFromSaavn<ArtistResponse>({
    endpoint: endpoints.artists.id,
    params: {
      artistId: id,
      n_song: songCount,
      n_album: albumCount,
      page,
      sort_order: sortOrder,
      category: sortBy
    }
  })
  
  if (response.ok && response.data) {
    response.data = transformArtist(response.data)
  }
  
  return response
}

/**
 * Get artist details from a JioSaavn URL
 *
 * @param args - JioSaavn link and optional filtering parameters
 * @returns Promise with complete Artist object
 */
export const getArtistByLink = async ({
  link,
  page = 0,
  songCount = 10,
  albumCount = 10,
  sortBy = 'popularity',
  sortOrder = 'asc'
}: GetArtistByLinkArgs): Promise<ApiResponse<ArtistResponse>> => {
  const token = ensureToken(tokenExtractors.artist(link), 'artist')

  const response = await fetchFromSaavn<ArtistResponse>({
    endpoint: endpoints.artists.link,
    params: {
      token,
      type: 'artist',
      n_song: songCount,
      n_album: albumCount,
      page,
      sort_order: sortOrder,
      category: sortBy
    }
  })
  
  if (response.ok && response.data) {
    response.data = transformArtist(response.data)
  }
  
  return response
}

/**
 * Get paginated list of songs by an artist
 *
 * @param args - Artist ID and pagination parameters
 * @returns Promise with paginated Song results
 *
 * @example
 * const result = await getArtistSongs({ id: 'artist-id-123', page: 0 });
 * result.data.results.forEach(song => console.log(song.title));
 */
export const getArtistSongs = async ({ id, page = 0, sortBy = 'popularity', sortOrder = 'asc' }: GetArtistSongsArgs): Promise<ApiResponse<PaginatedResponse<Song>>> => {
  const response = await fetchFromSaavn<PaginatedResponse<Song>>({
    endpoint: endpoints.artists.songs,
    params: { artistId: id, page, sort_order: sortOrder, category: sortBy }
  })
  
  if (response.ok && response.data?.results) {
    response.data.results = transformSongs(response.data.results)
  }
  
  return response
}

/**
 * Get paginated list of albums by an artist
 *
 * @param args - Artist ID and pagination parameters
 * @returns Promise with paginated Album results
 */
export const getArtistAlbums = async ({ id, page = 0, sortBy = 'popularity', sortOrder = 'asc' }: GetArtistAlbumsArgs): Promise<ApiResponse<PaginatedResponse<Album>>> => {
  const response = await fetchFromSaavn<PaginatedResponse<Album>>({
    endpoint: endpoints.artists.albums,
    params: { artistId: id, page, sort_order: sortOrder, category: sortBy }
  })
  
  if (response.ok && response.data?.results) {
    response.data.results = response.data.results.map(transformAlbum)
  }
  
  return response
}

// ============================================================================
// PLAYLIST FUNCTIONS
// ============================================================================

/**
 * Get complete playlist details by ID
 * Includes all songs in the playlist with same Song object structure as search and getSongsById
 *
 * @param args - Playlist ID and optional pagination parameters
 * @returns Promise with complete Playlist object including all songs
 *
 * @example
 * const result = await getPlaylistById({ id: 'playlist-id-123', limit: 100 });
 * const playlist = result.data;
 * console.log(playlist.title, playlist.songCount);
 * playlist.songs?.forEach(song => {
 *   console.log(song.title); // Same structure as getSongsById
 *   console.log(song.image); // Image links
 *   console.log(song.downloadLinks); // Download links
 * });
 */
export const getPlaylistById = async ({ id, page = 0, limit = 10 }: GetPlaylistByIdArgs): Promise<ApiResponse<PlaylistResponse>> => {
  const response = await fetchFromSaavn<PlaylistResponse>({
    endpoint: endpoints.playlists.id,
    params: { listid: id, n: limit, p: page }
  })
  
  if (response.ok && response.data) {
    response.data = transformPlaylist(response.data)
  }
  
  return response
}

/**
 * Get playlist details from a JioSaavn URL
 *
 * @param args - JioSaavn link and optional pagination parameters
 * @returns Promise with complete Playlist object
 */
export const getPlaylistByLink = async ({ link, page = 0, limit = 10 }: GetPlaylistByLinkArgs): Promise<ApiResponse<PlaylistResponse>> => {
  const token = ensureToken(tokenExtractors.playlist(link), 'playlist')

  const response = await fetchFromSaavn<PlaylistResponse>({
    endpoint: endpoints.playlists.link,
    params: { token, n: limit, p: page, type: 'playlist' }
  })
  
  if (response.ok && response.data) {
    response.data = transformPlaylist(response.data)
  }
  
  return response
}

// ============================================================================
// UTILITY & HELPER FUNCTIONS
// ============================================================================

/**
 * Create image URLs in different qualities
 * @example createImageLinks(imageUrl)
 */
export { createImageLinks } from './utils.js'

/**
 * Decrypt and create download URLs from encrypted media URL
 * @example createDownloadLinks(encryptedUrl)
 */
export { createDownloadLinks } from './utils.js'

/**
 * Pick random User-Agent from provided or default list
 * @example pickUserAgent(['Custom UA 1', 'Custom UA 2'])
 */
export { pickUserAgent } from './utils.js'

/**
 * Convert single ID or array of IDs to comma-separated string
 * @example stringifyIds(['id1', 'id2', 'id3'])
 */
export { stringifyIds } from './utils.js'

/**
 * Ensure token exists, throw error if not found
 * @example ensureToken(token, 'song')
 */
export { ensureToken } from './utils.js'

/**
 * Token extractors for parsing JioSaavn URLs
 * @example tokenExtractors.song(url)
 */
export { tokenExtractors } from './utils.js'

// ============================================================================
// ADVANCED API FUNCTIONS
// ============================================================================

/**
 * Direct access to JioSaavn API with custom parameters
 * @example fetchFromSaavn({ endpoint: 'song.getDetails', params: { pids: 'id' } })
 */
export { fetchFromSaavn } from './fetch.js'

/**
 * API endpoints map
 * @example endpoints.songs.id
 */
export { endpoints } from './fetch.js'

/**
 * All available endpoints constant
 * @example Endpoints.songs.id
 */
export { Endpoints } from './endpoints.js'

// ============================================================================
// TYPE EXPORTS FOR FUNCTIONS
// ============================================================================

export type {
  ApiContext,
  FetchParams,
  FetchResponse
} from './fetch.js'

export type {
  EndpointValue
} from './endpoints.js'

// ============================================================================
// TYPE EXPORTS FOR DATA MODELS
// ============================================================================

export type { Song }
export type { Album }
export type { Artist }
export type { Playlist }
export type { SearchResult }
export type { PaginatedResponse }
export type { ApiResponse }
export type { ImageLink }
export type { DownloadLink }
export type { SortBy }
export type { SortOrder }

// ============================================================================
// TYPE EXPORTS FOR FUNCTION ARGUMENTS
// ============================================================================

export type { SearchArgs }
export type { GetSongsByIdArgs }
export type { GetSongsByLinkArgs }
export type { GetSongSuggestionsArgs }
export type { GetAlbumByIdArgs }
export type { GetAlbumByLinkArgs }
export type { GetArtistByIdArgs }
export type { GetArtistByLinkArgs }
export type { GetArtistSongsArgs }
export type { GetArtistAlbumsArgs }
export type { GetPlaylistByIdArgs }
export type { GetPlaylistByLinkArgs }

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

/**
 * Map of all endpoints for reference
 */
export const endpointsMap = endpoints
