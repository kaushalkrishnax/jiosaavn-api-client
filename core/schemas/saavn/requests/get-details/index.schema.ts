import { z } from "zod";
import {
  SaavnAlbumEntity,
  SaavnArtistEntity,
  SaavnPlaylistEntity,
  SaavnSongEntity,
} from "../../entities";

export const SaavnGetAlbumDetailsSchema = SaavnAlbumEntity;
export const SaavnGetArtistDetailsSchema = SaavnArtistEntity;
export const SaavnGetPlaylistDetailsSchema = SaavnPlaylistEntity;
export const SaavnGetSongDetailsSchema = z.strictObject({
  songs: z.array(SaavnSongEntity),
});
