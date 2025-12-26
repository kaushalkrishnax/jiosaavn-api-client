import { z } from "zod";
import {
  SaavnAlbumCore,
  SaavnArtistBase,
  SaavnSongCore,
} from "../../entities/base";
import {
  SaavnSongEntity,
  SaavnAlbumEntity,
  SaavnShowEntity,
} from "../../entities";
import {
  SaavnAlbumEdgeCase,
  SaavnPlaylistSearchAll,
  SaavnPlaylistEdgeCase,
  SaavnTopSearchesEntity,
} from "../../entities/extras.entity";

const SaavnArtistSearchAll = z.strictObject({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  extra: z.string(),
  type: z.literal("artist"),
  mini_obj: z.boolean(),
  isRadioPresent: z.boolean(),
  ctr: z.number(),
  entity: z.number(),
  description: z.string(),
  position: z.number(),
});

const SaavnSongSearchAll = SaavnSongCore.extend({
  mini_obj: z.boolean(),
  description: z.string(),
  more_info: z.strictObject({
    album: z.string(),
    album_id: z.string(),
    ctr: z.number(),
    score: z.string(),
    vcode: z.string(),
    vlink: z.string(),
    primary_artists: z.string(),
    singers: z.string(),
    video_available: z.null(),
    triller_available: z.boolean(),
    language: z.string(),
  }),
});

export const SaavnSearchAllSchema = z.strictObject({
  albums: z.strictObject({
    position: z.number(),
    data: z.array(
      SaavnAlbumCore.extend({
        description: z.string(),
        mini_obj: z.boolean(),
        more_info: z.strictObject({
          music: z.string(),
          ctr: z.number(),
          year: z.string(),
          is_movie: z.string(),
          language: z.string(),
          song_pids: z.string(),
        }),
      }),
    ),
  }),
  artists: z.strictObject({
    position: z.number(),
    data: z.array(SaavnArtistSearchAll),
  }),
  playlists: z.strictObject({
    position: z.number(),
    data: z.array(SaavnPlaylistSearchAll),
  }),
  songs: z.strictObject({
    position: z.number(),
    data: z.array(SaavnSongSearchAll),
  }),
  shows: z.strictObject({
    position: z.number(),
    data: z.array(SaavnShowEntity),
  }),
  episodes: z.strictObject({
    position: z.number(),
    data: z.array(z.any()),
  }),
  topquery: z.strictObject({
    position: z.number(),
    data: z.array(SaavnSongSearchAll),
  }),
});

export const SaavnSearchAlbumsSchema = z.strictObject({
  total: z.number(),
  start: z.number(),
  results: z.array(SaavnAlbumEdgeCase),
});

export const SaavnSearchArtistsSchema = z.strictObject({
  total: z.number(),
  start: z.number(),
  results: z.array(
    SaavnArtistBase.extend({
      ctr: z.number(),
      entity: z.number(),
      isRadioPresent: z.boolean(),
      mini_obj: z.boolean(),
      is_followed: z.boolean(),
    }),
  ),
});

export const SaavnSearchPlaylistsSchema = z.strictObject({
  total: z.number(),
  start: z.number(),
  results: z.array(SaavnPlaylistEdgeCase),
});

export const SaavnSearchSongsSchema = z.strictObject({
  total: z.number(),
  start: z.number(),
  results: z.array(SaavnSongEntity),
});

export const SaavnGetTopAlbumsOfTheYearSchema = z.array(SaavnAlbumEntity);

export const SaavnGetTopSearchesSchema = z.array(SaavnTopSearchesEntity);
