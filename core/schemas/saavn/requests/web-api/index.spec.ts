import { describe, it } from "vitest";
import { expectSchema, getPostmanResponse } from "../../helpers/spec.helper";
import * as schema from "./index.schema.js";

const GROUP_NAME = "Web API";

const testCases = [
  {
    name: "WebAPIGetAlbumDetailsSchema",
    request: "Get Album Details",
    schema: schema.SaavnWebAPIGetAlbumDetailsSchema,
  },
  {
    name: "WebAPIGetArtistDetailsSchema",
    request: "Get Artist Details",
    schema: schema.SaavnWebAPIGetArtistDetailsSchema,
  },
  {
    name: "WebAPIGetPlaylistDetailsSchema",
    request: "Get Playlist Details",
    schema: schema.SaavnWebAPIGetPlaylistDetailsSchema,
  },
  {
    name: "WebAPIGetSongDetailsSchema",
    request: "Get Song Details",
    schema: schema.SaavnWebAPIGetSongDetailsSchema,
  },
];

testCases.forEach(({ name, request, schema }) => {
  describe(name, () => {
    it(GROUP_NAME, () => {
      expectSchema(schema, getPostmanResponse(GROUP_NAME, request), request);
    });
  });
});
