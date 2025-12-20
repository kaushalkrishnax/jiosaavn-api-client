export const Endpoints = {
  search: {
    all: 'autocomplete.get',
    songs: 'search.getResults',
    albums: 'search.getAlbumResults',
    artists: 'search.getArtistResults',
    playlists: 'search.getPlaylistResults'
  },
  songs: {
    id: 'song.getDetails',
    link: 'webapi.get',
    suggestions: 'webradio.getSong',
    lyrics: 'lyrics.getLyrics',
    station: 'webradio.createEntityStation'
  },
  albums: {
    id: 'content.getAlbumDetails',
    link: 'webapi.get'
  },
  artists: {
    id: 'artist.getArtistPageDetails',
    link: 'webapi.get',
    songs: 'artist.getArtistMoreSong',
    albums: 'artist.getArtistMoreAlbum'
  },
  playlists: {
    id: 'playlist.getDetails',
    link: 'webapi.get'
  },
  modules: 'content.getBrowseModules',
  trending: 'content.getTrending'
} as const

export type EndpointValue =
  | (typeof Endpoints)['modules']
  | (typeof Endpoints)['trending']
  | (typeof Endpoints)['songs'][keyof (typeof Endpoints)['songs']]
  | (typeof Endpoints)['albums'][keyof (typeof Endpoints)['albums']]
  | (typeof Endpoints)['artists'][keyof (typeof Endpoints)['artists']]
  | (typeof Endpoints)['playlists'][keyof (typeof Endpoints)['playlists']]
  | (typeof Endpoints)['search'][keyof (typeof Endpoints)['search']]
