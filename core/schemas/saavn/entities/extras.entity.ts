import { z } from "zod";
import { SaavnPlaylistBase, SaavnAlbumBase } from "./base";
import { SaavnArtistBase, SaavnArtistMap } from "./base/artist.base";

export const SaavnAlbumEdgeCase = SaavnAlbumBase.extend({
  more_info: z.strictObject({
    query: z.string(),
    text: z.string(),
    music: z.string(),
    song_count: z.string(),
    artistMap: SaavnArtistMap,
  }),
});

export const SaavnPlaylistSearchAll = SaavnPlaylistBase.extend({
  mini_obj: z.boolean(),
  description: z.string(),
  more_info: z.strictObject({
    firstname: z.string(),
    lastname: z.string().optional(),
    artist_name: z.union([z.array(z.string()), z.null()]),
    entity_type: z.string(),
    entity_sub_type: z.string(),
    video_available: z.boolean(),
    is_dolby_content: z.union([z.boolean(), z.null()]),
    sub_types: z.null(),
    images: z.null(),
    language: z.string(),
  }),
});

export const SaavnPlaylistEdgeCase = SaavnPlaylistSearchAll.omit({
  description: true,
}).extend({
  numsongs: z.null(),
  more_info: SaavnPlaylistSearchAll.shape.more_info.extend({
    uid: z.string(),
    song_count: z.string(),
  }),
});

export const SaavnTopSearchesEntity = z.strictObject({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  type: z.union([z.literal("album"), z.literal("artist"), z.literal("song")]),
  image: z.string(),
  perma_url: z.string(),
  explicit_content: z.string(),
  mini_obj: z.boolean(),
  more_info: z.strictObject({
    album: z.string(),
    artistMap: z.array(SaavnArtistBase),
    is_jiotune_available: z.string().optional(),
  }),
});
