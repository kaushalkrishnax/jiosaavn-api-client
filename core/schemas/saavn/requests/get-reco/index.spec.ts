import { describe, it } from "vitest";
import { expectSchema, getPostmanResponse } from "../../helpers/spec.helper";
import * as schema from "./index.schema";

const GROUP_NAME = "Get Recommendations";

const testCases = [
  {
    schema: schema.SaavnGetSongRecoSchema,
    name: "SaavnGetSongRecoSchema",
    request: "Get Song Reco",
  },
  {
    schema: schema.SaavnGetAlbumRecoSchema,
    name: "SaavnGetAlbumRecoSchema",
    request: "Get Album Reco",
  },
  {
    schema: schema.SaavnGetPlaylistRecoSchema,
    name: "SaavnGetPlaylistRecoSchema",
    request: "Get Playlist Reco",
  },
];

testCases.forEach(({ name, request, schema }) => {
  describe(name, () => {
    it(GROUP_NAME, () => {
      expectSchema(schema, getPostmanResponse(GROUP_NAME, request), request);
    });
  });
});
