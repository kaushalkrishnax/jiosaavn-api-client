import { z } from "zod";
import { SaavnAlbumBase } from "./base";
import { SaavnArtistMap } from "./base/artist.base";
import { SaavnSongEntity } from "./song.entity";

export const SaavnAlbumEntity = z.lazy(() =>
  SaavnAlbumBase.extend({
    language: z.string(),
    year: z.string(),
    list_count: z.string(),
    list_type: z.literal("song"),
    list: z.array(z.lazy(() => SaavnSongEntity)),
    play_count: z.string(),
    button_tooltip_info: z.array(z.any()),
    modules: z.any(),
    more_info: z.strictObject({
      song_count: z.string(),
      copyright_text: z.string(),
      is_dolby_content: z.boolean(),
      label_url: z.string(),
      artistMap: SaavnArtistMap,
    }),
  }),
);
