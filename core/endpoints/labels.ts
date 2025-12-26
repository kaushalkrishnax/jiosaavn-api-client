export const LabelEndpoints = {
  /** Get label details via label token (webapi.get) */
  token: {
    name: "webapi.get",
    params: {
      required: ["token"] as const,
      optional: ["n_song", "n_album", "category", "sort_order"] as const,
    },
    defaults: {
      type: "label" as const,
      n_song: "1",
      n_album: "1",
    },
  },
} as const;
