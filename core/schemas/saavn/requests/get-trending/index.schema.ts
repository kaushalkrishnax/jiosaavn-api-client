import { z } from "zod";
import { SaavnSongEntity } from "../../entities";
import { SaavnArtistMap } from "../../entities/base/artist.base";

export const SaavnTrendingBase = z.strictObject({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  header_desc: z.string(),
  type: z.union([z.literal("album"), z.literal("playlist"), z.literal("song")]),
  perma_url: z.string(),
  image: z.string(),
  language: z.string(),
  year: z.string(),
  play_count: z.string(),
  explicit_content: z.string(),
  list_count: z.string(),
  list_type: z.string(),
  list: z.string(),
  button_tooltip_info: z.array(z.any()),
});

export const SaavnTrendingAlbum = SaavnTrendingBase.extend({
  type: z.literal("album"),
  more_info: z.strictObject({
    release_date: z.string(),
    song_count: z.string(),
    artistMap: SaavnArtistMap,
  }),
});

export const SaavnTrendingPlaylist = SaavnTrendingBase.extend({
  type: z.literal("playlist"),
  more_info: z.strictObject({
    listid: z.string(),
    isWeekly: z.string(),
    listname: z.string(),
    firstname: z.string(),
    song_count: z.string(),
    follower_count: z.string(),
    fan_count: z.string(),
  }),
});

export const SaavnTrendingSong = SaavnTrendingBase.extend({
  type: z.literal("song"),
  more_info: SaavnSongEntity.shape.more_info.extend({
    vcode: z.string().optional(),
    vlink: z.string().optional(),
    label_url: z.string().optional(),
    rights: SaavnSongEntity.shape.more_info.shape.rights.extend({
      delete_cached_object: z.string().optional(),
      reason: z.string().optional(),
    }),
  }),
});

export const SaavnGetTrendingContentSchema = z.array(
  z.discriminatedUnion("type", [
    SaavnTrendingAlbum,
    SaavnTrendingPlaylist,
    SaavnTrendingSong,
  ]),
);

export const SaavnGetTrendingAlbumsSchema = z.array(SaavnTrendingAlbum);
export const SaavnGetTrendingPlaylistsSchema = z.array(SaavnTrendingPlaylist);
export const SaavnGetTrendingSongsSchema = z.array(SaavnTrendingSong);
