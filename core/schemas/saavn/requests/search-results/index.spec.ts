import { describe, it } from "vitest";
import { expectSchema, getPostmanResponse } from "../../helpers/spec.helper";
import * as schema from "./index.schema";

const GROUP_NAME = "Search Results";

const testCases = [
  {
    name: "SaavnSearchAllSchema",
    request: "Search All",
    schema: schema.SaavnSearchAllSchema,
  },
  {
    name: "SaavnSearchAlbumsSchema",
    request: "Search Albums",
    schema: schema.SaavnSearchAlbumsSchema,
  },
  {
    name: "SaavnSearchArtistsSchema",
    request: "Search Artists",
    schema: schema.SaavnSearchArtistsSchema,
  },
  {
    name: "SaavnSearchPlaylistsSchema",
    request: "Search Playlists",
    schema: schema.SaavnSearchPlaylistsSchema,
  },
  {
    name: "SaavnSearchSongsSchema",
    request: "Search Songs",
    schema: schema.SaavnSearchSongsSchema,
  },
  {
    name: "SaavnGetTopAlbumsOfTheYearSchema",
    request: "Get Top Albums Of The Year",
    schema: schema.SaavnGetTopAlbumsOfTheYearSchema,
  },
  {
    name: "SaavnGetTopSearchesSchema",
    request: "Get Top Searches",
    schema: schema.SaavnGetTopSearchesSchema,
  },
];

testCases.forEach(({ name, request, schema }) => {
  describe(name, () => {
    it(GROUP_NAME, () => {
      expectSchema(schema, getPostmanResponse(GROUP_NAME, request), request);
    });
  });
});
