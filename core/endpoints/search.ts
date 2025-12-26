export const SearchEndpoints = {
  /** Autocomplete search for all entities */
  all: {
    name: "autocomplete.get",
    params: {
      required: ["query"] as const,
      optional: [] as const,
    },
  },

  /** Search for songs */
  songs: {
    name: "search.getResults",
    params: {
      required: ["q"] as const,
      optional: ["p", "n"] as const,
    },
  },

  /** Search for albums */
  albums: {
    name: "search.getAlbumResults",
    params: {
      required: ["q"] as const,
      optional: ["p", "n"] as const,
    },
  },

  /** Search for artists */
  artists: {
    name: "search.getArtistResults",
    params: {
      required: ["q"] as const,
      optional: ["p", "n"] as const,
    },
  },

  /** Search for playlists */
  playlists: {
    name: "search.getPlaylistResults",
    params: {
      required: ["q"] as const,
      optional: ["p", "n"] as const,
    },
  },

  /** Get Top Searches across all entities */
  topSearches: {
    name: "content.getTopSearches",
    params: {
      required: [] as const,
      optional: [] as const,
    },
  },

  /** Get Top Albums of the Year */
  topAlbumsOfYear: {
    name: "search.topAlbumsoftheYear",
    params: {
      required: ["album_year", "album_lang"] as const,
      optional: [] as const,
    },
  },
} as const;
