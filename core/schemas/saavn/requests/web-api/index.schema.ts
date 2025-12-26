import z from "zod";
import {
  SaavnAlbumEntity,
  SaavnArtistEntity,
  SaavnPlaylistEntity,
  SaavnSongEntity,
} from "../../entities";

export const SaavnWebAPIGetAlbumDetailsSchema = SaavnAlbumEntity;
export const SaavnWebAPIGetArtistDetailsSchema = SaavnArtistEntity;
export const SaavnWebAPIGetPlaylistDetailsSchema = SaavnPlaylistEntity;
export const SaavnWebAPIGetSongDetailsSchema = z.strictObject({
  songs: z.array(SaavnSongEntity),
  modules: z.any(),
});
