import { z } from "zod";
import { SaavnAlbumBase, SaavnPlaylistBase } from "../../entities/base";
import { SaavnSongEntity } from "../../entities";

export const SaavnGetAlbumRecoSchema = z.array(
  z.lazy(() =>
    SaavnAlbumBase.extend({
      more_info: z.object({
        mini_obj: z.string(),
      }),
    }),
  ),
);

export const SaavnGetPlaylistRecoSchema = z.array(
  SaavnPlaylistBase.extend({
    mini_obj: z.boolean(),
    more_info: z.strictObject({
      firstname: z.string(),
    }),
  }),
);

export const SaavnGetSongRecoSchema = z.array(z.lazy(() => SaavnSongEntity));
