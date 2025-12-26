import { z } from "zod";
import { SaavnSongBase } from "./base/song.base";
import { SaavnArtistMap } from "./base/artist.base";

export const SaavnSongEntity = SaavnSongBase.extend({
  more_info: z.strictObject({
    music: z.string(),
    album_id: z.string(),
    album: z.string(),
    label: z.string(),
    label_id: z.union([z.string(), z.null()]),
    origin: z.string(),
    is_dolby_content: z.boolean(),
    "320kbps": z.string(),
    encrypted_media_url: z.string(),
    encrypted_cache_url: z.string(),
    encrypted_drm_cache_url: z.string(),
    encrypted_drm_media_url: z.string(),
    album_url: z.string(),
    duration: z.string(),
    cache_state: z.string(),
    has_lyrics: z.string(),
    lyrics_snippet: z.string(),
    lyrics_id: z.string().optional(),
    starred: z.string(),
    copyright_text: z.string(),
    release_date: z.union([z.string(), z.null()]),
    label_url: z.string().optional(),
    vcode: z.string().optional(),
    vlink: z.string().optional(),
    triller_available: z.boolean(),
    request_jiotune_flag: z.boolean(),
    webp: z.string(),
    rights: z.strictObject({
      code: z.string(),
      cacheable: z.string(),
      delete_cached_object: z.string().optional(),
      reason: z.string().optional(),
    }),
    artistMap: z.lazy(() => SaavnArtistMap),
  }),
});
