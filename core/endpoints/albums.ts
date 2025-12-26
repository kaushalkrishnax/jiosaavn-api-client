export const AlbumEndpoints = {
  /** Get album details by album ID */
  id: {
    name: "content.getAlbumDetails",
    params: {
      required: ["albumid"] as const,
      optional: [] as const,
    },
  },

  /** Get album details via album token (webapi.get) */
  token: {
    name: "webapi.get",
    params: {
      required: ["token"] as const,
      optional: [] as const,
    },
    defaults: {
      type: "album" as const,
    },
  },
} as const;
