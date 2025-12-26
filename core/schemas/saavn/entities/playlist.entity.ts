import { z } from "zod";
import { SaavnArtistBase } from "./base/artist.base";
import { SaavnPlaylistBase } from "./base/playlist.base";
import { SaavnSongEntity } from "./song.entity";

export const SaavnPlaylistEntity = z.lazy(() =>
  SaavnPlaylistBase.extend({
    header_desc: z.string(),
    language: z.string(),
    year: z.string(),
    play_count: z.string(),
    list_count: z.string(),
    list_type: z.string(),
    list: z.array(z.lazy(() => SaavnSongEntity)),
    more_info: z.strictObject({
      uid: z.string(),
      contents: z.string(),
      is_dolby_content: z.boolean(),
      subtype: z.array(z.any()),
      last_updated: z.string(),
      username: z.string(),
      firstname: z.string(),
      lastname: z.string(),
      is_followed: z.string(),
      isFY: z.boolean(),
      follower_count: z.string(),
      fan_count: z.string(),
      playlist_type: z.string(),
      share: z.string(),
      sub_types: z.array(z.any()),
      images: z.array(z.any()),
      H2: z.union([z.string(), z.null()]),
      subheading: z.null(),
      user_image: z.string(),
      initials: z.string(),
      custom_username: z.string(),
      video_count: z.union([z.string(), z.number()]),
      artists: z.array(SaavnArtistBase),
      subtitle_desc: z.array(z.string()),
    }),
    button_tooltip_info: z.array(z.any()),
    modules: z.any(),
  }),
);
