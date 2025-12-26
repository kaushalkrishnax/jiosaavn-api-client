export const RecoEndpoints = {
  /** Get song recommendations from a seed song */
  songs: {
    name: "reco.getreco",
    params: {
      required: ["pid"] as const,
      optional: [] as const,
    },
  },

  /** Get album recommendations from a seed album */
  albums: {
    name: "reco.getAlbumReco",
    params: {
      required: ["albumid"] as const,
      optional: [] as const,
    },
  },

  /** Get playlist recommendations from a seed playlist */
  playlists: {
    name: "reco.getPlaylistReco",
    params: {
      required: ["listid"] as const,
      optional: [] as const,
    },
  },
} as const;
