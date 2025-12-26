export const ArtistEndpoints = {
  /** Get artist details by artist ID */
  id: {
    name: "artist.getArtistPageDetails",
    params: {
      required: ["artistId"] as const,
      optional: ["n_song", "n_album", "category", "sort_order"] as const,
    },
    defaults: {
      n_song: "1",
      n_album: "1",
    },
  },

  /** Get artist details via artist token (webapi.get) */
  token: {
    name: "webapi.get",
    params: {
      required: ["token"] as const,
      optional: ["n_song", "n_album", "category", "sort_order"] as const,
    },
    defaults: {
      type: "artist" as const,
      n_song: "1",
      n_album: "1",
    },
  },

  /** Get paginated songs by artist ID */
  songs: {
    name: "artist.getArtistMoreSong",
    params: {
      required: ["artistId"] as const,
      optional: ["page", "category", "sort_order"] as const,
    },
    defaults: {
      page: "1",
    },
  },

  /** Get paginated albums by artist ID */
  albums: {
    name: "artist.getArtistMoreAlbum",
    params: {
      required: ["artistId"] as const,
      optional: ["page", "category", "sort_order"] as const,
    },
    defaults: {
      page: "1",
    },
  },
} as const;
