import { describe, it } from "vitest";
import { expectSchema, getPostmanResponse } from "../../helpers/spec.helper";
import * as schema from "./index.schema";

const GROUP_NAME = "Get Trending";

const testCases = [
  {
    name: "GetTrendingContentSchema",
    request: "Get Trending Content",
    schema: schema.SaavnGetTrendingContentSchema,
  },
  {
    name: "GetTrendingAlbumsSchema",
    request: "Get Trending Albums",
    schema: schema.SaavnGetTrendingAlbumsSchema,
  },
  {
    name: "GetTrendingPlaylistsSchema",
    request: "Get Trending Playlists",
    schema: schema.SaavnGetTrendingPlaylistsSchema,
  },
  {
    name: "GetTrendingSongsSchema",
    request: "Get Trending Songs",
    schema: schema.SaavnGetTrendingSongsSchema,
  },
];

testCases.forEach(({ name, request, schema }) => {
  describe(name, () => {
    it(GROUP_NAME, () => {
      expectSchema(schema, getPostmanResponse(GROUP_NAME, request), request);
    });
  });
});
