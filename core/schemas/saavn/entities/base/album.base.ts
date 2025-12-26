import { z } from "zod";

export const SaavnAlbumCore = z.strictObject({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  type: z.literal("album"),
  image: z.string(),
  perma_url: z.string(),
  explicit_content: z.string(),
});

export const SaavnAlbumBase = SaavnAlbumCore.extend({
  header_desc: z.string(),
  language: z.string(),
  year: z.string(),
  list_count: z.string(),
  list_type: z.string(),
  list: z.string(),
  play_count: z.string(),
  button_tooltip_info: z.array(z.any()),
});

export const SaavnArtistAlbumBase = SaavnAlbumBase.extend({
  more_info: z.strictObject({
    song_count: z.string(),
  }),
});
