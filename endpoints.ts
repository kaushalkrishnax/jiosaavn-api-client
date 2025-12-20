/**
 * JioSaavn API Endpoints
 * Maps logical operations to actual API endpoint names
 * @internal
 */
export const Endpoints = {
  search: {
    /** Search for songs, albums, artists, playlists via autocomplete */
    all: 'autocomplete.get',
    /** Search for songs */
    songs: 'search.getResults',
    /** Search for albums */
    albums: 'search.getAlbumResults',
    /** Search for artists */
    artists: 'search.getArtistResults',
    /** Search for playlists */
    playlists: 'search.getPlaylistResults'
  },
  songs: {
    /** Get song details by song ID(s) */
    id: 'song.getDetails',
    /** Get song details via JioSaavn link */
    link: 'webapi.get',
    /** Get song suggestions/radio recommendations */
    suggestions: 'webradio.getSong',
    /** Get song lyrics */
    lyrics: 'lyrics.getLyrics',
    /** Create a radio station for song recommendations */
    station: 'webradio.createEntityStation'
  },
  albums: {
    /** Get album details by album ID */
    id: 'content.getAlbumDetails',
    /** Get album details via JioSaavn link */
    link: 'webapi.get'
  },
  artists: {
    /** Get artist details and top songs/albums by artist ID */
    id: 'artist.getArtistPageDetails',
    /** Get artist details via JioSaavn link */
    link: 'webapi.get',
    /** Get paginated list of songs by artist */
    songs: 'artist.getArtistMoreSong',
    /** Get paginated list of albums by artist */
    albums: 'artist.getArtistMoreAlbum'
  },
  playlists: {
    /** Get playlist details and songs by playlist ID */
    id: 'playlist.getDetails',
    /** Get playlist details via JioSaavn link */
    link: 'webapi.get'
  },
  /** Get trending/featured content modules */
  modules: 'content.getBrowseModules',
  /** Get current trending songs, albums, artists, playlists */
  trending: 'content.getTrending'
} as const

/**
 * Type representing all valid endpoint values
 * Used for type-safe API calls
 */
export type EndpointValue =
  | (typeof Endpoints)['modules']
  | (typeof Endpoints)['trending']
  | (typeof Endpoints)['songs'][keyof (typeof Endpoints)['songs']]
  | (typeof Endpoints)['albums'][keyof (typeof Endpoints)['albums']]
  | (typeof Endpoints)['artists'][keyof (typeof Endpoints)['artists']]
  | (typeof Endpoints)['playlists'][keyof (typeof Endpoints)['playlists']]
  | (typeof Endpoints)['search'][keyof (typeof Endpoints)['search']]
