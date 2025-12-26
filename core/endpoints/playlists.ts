export const PlaylistEndpoints = {
  /** Get playlist details by playlist ID */
  id: {
    name: "playlist.getDetails",
    params: {
      required: ["listid"] as const,
      optional: ["n"] as const,
    },
  },

  /** Get playlist details via playlist token (webapi.get) */
  token: {
    name: "webapi.get",
    params: {
      required: ["token"] as const,
      optional: ["n"] as const,
    },
    defaults: {
      type: "playlist" as const,
    },
  },
} as const;
