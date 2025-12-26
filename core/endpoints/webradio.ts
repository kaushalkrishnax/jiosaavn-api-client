export const WebRadioEndpoints = {
  /** Get songs from a radio station */
  getSong: {
    name: "webradio.getSong",
    transport: "android" as const,
    params: {
      required: ["stationid", "k"] as const,
      optional: ["next"] as const,
    },
  },

  /** Create entity-based radio station */
  createEntityStation: {
    name: "webradio.createEntityStation",
    context: "android" as const,
    params: {
      required: ["entity_id"] as const,
      optional: [] as const,
    },
    defaults: {
      entity_type: "queue" as const,
    },
  },

  /** Create featured radio station */
  createFeaturedStation: {
    name: "webradio.createFeaturedStation",
    transport: "android" as const,
    params: {
      required: ["name", "language"] as const,
      optional: ["language"] as const,
    },
  },
} as const;
