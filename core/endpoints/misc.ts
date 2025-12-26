export const ModuleEndpoints = {
  /** Get browse modules */
  browse: {
    name: "content.getBrowseModules",
    params: {
      required: [] as const,
      optional: [] as const,
    },
  },
} as const;

export const TrendingEndpoints = {
  /** Get trending content (optionally filtered by entity type and language) */
  trending: {
    name: "content.getTrending",
    params: {
      required: [] as const,
      optional: ["entity_type", "entity_language"] as const,
    },
  },
} as const;
