import { describe, it } from "vitest";
import { expectSchema, getPostmanResponse } from "../../helpers/spec.helper";
import * as schema from "./index.schema";

const GROUP_NAME = "Get Details";

const testCases = [
  {
    name: "SaavnGetSongDetailsSchema",
    request: "Get Song Details",
    schema: schema.SaavnGetSongDetailsSchema,
  },
  {
    name: "SaavnGetAlbumDetailsSchema",
    request: "Get Album Details",
    schema: schema.SaavnGetAlbumDetailsSchema,
  },
  {
    name: "SaavnGetArtistDetailsSchema",
    request: "Get Artist Details",
    schema: schema.SaavnGetArtistDetailsSchema,
  },
  {
    name: "SaavnGetPlaylistDetailsSchema",
    request: "Get Playlist Details",
    schema: schema.SaavnGetPlaylistDetailsSchema,
  },
];

testCases.forEach(({ name, request, schema }) => {
  describe(name, () => {
    it(GROUP_NAME, () => {
      expectSchema(schema, getPostmanResponse(GROUP_NAME, request), request);
    });
  });
});
