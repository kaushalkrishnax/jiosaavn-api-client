import { endpoints, fetchFromSaavn } from './fetch'
import { ensureToken, stringifyIds, tokenExtractors } from './utils'

type SortBy = 'popularity' | 'latest' | 'alphabetical'
type SortOrder = 'asc' | 'desc'

type SongDetailsResponse = { songs: any[] }
type PlaylistResponse = any

type SuggestionResponse = {
  stationid: string
  [key: string]: { song?: any } | string
}

type ArtistResponse = any

type AlbumResponse = any

type SearchAllResponse = any

type SearchListResponse = {
  total: number
  start?: number
  results: any[]
}

export interface SearchArgs {
  query: string
  page?: number
  limit?: number
}

export interface ArtistArgs {
  artistId: string
  page?: number
  songCount?: number
  albumCount?: number
  sortBy?: SortBy
  sortOrder?: SortOrder
}

export interface ArtistLinkArgs extends Omit<ArtistArgs, 'artistId'> {
  link: string
}

export interface PlaylistArgs {
  id: string
  page?: number
  limit?: number
}

export interface PlaylistLinkArgs extends Omit<PlaylistArgs, 'id'> {
  link: string
}

export const searchAll = (query: string) =>
  fetchFromSaavn<SearchAllResponse>({
    endpoint: endpoints.search.all,
    params: { query }
  })

export const searchSongs = ({ query, page = 0, limit = 10 }: SearchArgs) =>
  fetchFromSaavn<SearchListResponse>({
    endpoint: endpoints.search.songs,
    params: { q: query, p: page, n: limit }
  })

export const searchAlbums = ({ query, page = 0, limit = 10 }: SearchArgs) =>
  fetchFromSaavn<SearchListResponse>({
    endpoint: endpoints.search.albums,
    params: { q: query, p: page, n: limit }
  })

export const searchArtists = ({ query, page = 0, limit = 10 }: SearchArgs) =>
  fetchFromSaavn<SearchListResponse>({
    endpoint: endpoints.search.artists,
    params: { q: query, p: page, n: limit }
  })

export const searchPlaylists = ({ query, page = 0, limit = 10 }: SearchArgs) =>
  fetchFromSaavn<SearchListResponse>({
    endpoint: endpoints.search.playlists,
    params: { q: query, p: page, n: limit }
  })

export const getSongsById = (songIds: string | string[]) =>
  fetchFromSaavn<SongDetailsResponse>({
    endpoint: endpoints.songs.id,
    params: { pids: stringifyIds(songIds) }
  })

export const getSongsByLink = (link: string) => {
  const token = ensureToken(tokenExtractors.song(link), 'song')

  return fetchFromSaavn<SongDetailsResponse>({
    endpoint: endpoints.songs.link,
    params: { token, type: 'song' }
  })
}

export const getAlbumById = (albumId: string) =>
  fetchFromSaavn<AlbumResponse>({
    endpoint: endpoints.albums.id,
    params: { albumid: albumId }
  })

export const getAlbumByLink = (link: string) => {
  const token = ensureToken(tokenExtractors.album(link), 'album')

  return fetchFromSaavn<AlbumResponse>({
    endpoint: endpoints.albums.link,
    params: { token, type: 'album' }
  })
}

export const getArtistById = ({
  artistId,
  page = 0,
  songCount = 10,
  albumCount = 10,
  sortBy = 'popularity',
  sortOrder = 'asc'
}: ArtistArgs) =>
  fetchFromSaavn<ArtistResponse>({
    endpoint: endpoints.artists.id,
    params: {
      artistId,
      n_song: songCount,
      n_album: albumCount,
      page,
      sort_order: sortOrder,
      category: sortBy
    }
  })

export const getArtistByLink = ({
  link,
  page = 0,
  songCount = 10,
  albumCount = 10,
  sortBy = 'popularity',
  sortOrder = 'asc'
}: ArtistLinkArgs) => {
  const token = ensureToken(tokenExtractors.artist(link), 'artist')

  return fetchFromSaavn<ArtistResponse>({
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
}

export const getArtistSongs = ({ artistId, page = 0, sortBy = 'popularity', sortOrder = 'asc' }: ArtistArgs) =>
  fetchFromSaavn<SearchListResponse>({
    endpoint: endpoints.artists.songs,
    params: { artistId, page, sort_order: sortOrder, category: sortBy }
  })

export const getArtistAlbums = ({ artistId, page = 0, sortBy = 'popularity', sortOrder = 'asc' }: ArtistArgs) =>
  fetchFromSaavn<SearchListResponse>({
    endpoint: endpoints.artists.albums,
    params: { artistId, page, sort_order: sortOrder, category: sortBy }
  })

export const getPlaylistById = ({ id, page = 0, limit = 10 }: PlaylistArgs) =>
  fetchFromSaavn<PlaylistResponse>({
    endpoint: endpoints.playlists.id,
    params: { listid: id, n: limit, p: page }
  })

export const getPlaylistByLink = ({ link, page = 0, limit = 10 }: PlaylistLinkArgs) => {
  const token = ensureToken(tokenExtractors.playlist(link), 'playlist')

  return fetchFromSaavn<PlaylistResponse>({
    endpoint: endpoints.playlists.link,
    params: { token, n: limit, p: page, type: 'playlist' }
  })
}

export const createSongStation = async (songId: string) => {
  const encodedSongId = JSON.stringify([encodeURIComponent(songId)])

  const { data, ok } = await fetchFromSaavn<{ stationid: string }>({
    endpoint: endpoints.songs.station,
    params: { entity_id: encodedSongId, entity_type: 'queue' },
    context: 'android'
  })

  if (!ok || !data?.stationid) throw new Error('Unable to create station for song suggestions')

  return data.stationid
}

export const getSongSuggestions = async (songId: string, limit = 10) => {
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
    .filter(Boolean)

  return suggestions.slice(0, limit)
}

export const endpointsMap = endpoints
