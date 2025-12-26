import {
  searchSongs,
  searchAlbums,
  searchArtists,
  searchPlaylists,
  getSongsById,
  getSongByLink,
  getSongSuggestions,
  getAlbumById,
  getAlbumByLink,
  getArtistById,
  getArtistByLink,
  getArtistSongs,
  getArtistAlbums,
  getPlaylistById,
  getPlaylistByLink,
} from "../index";

import { type CheckResult } from "./types";

const SEARCH_SONG_QUERY = "Believer";
const SEARCH_ALBUM_QUERY = "Evolve";
const SEARCH_ARTIST_QUERY = "Imagine Dragons";
const SEARCH_PLAYLIST_QUERY = "Top 50";
const SEARCH_LIMIT = 1;

const SONG_ID = "BeXBcbVK";
const SONG_LINK = "https://www.jiosaavn.com/song/believer/Mg0zcxdSYXg";

const ALBUM_ID = "13435951";
const ALBUM_LINK = "https://www.jiosaavn.com/album/evolve/gvCWqZLfVbs_";

const ARTIST_ID = "599452";
const ARTIST_LINK =
  "https://www.jiosaavn.com/artist/imagine-dragons-songs/f0aFxsa231o_";

const PLAYLIST_ID = "110858205";
const PLAYLIST_LINK =
  "https://www.jiosaavn.com/featured/trending-today/I3kvhipIy73uCJW60TJk1Q__";

export async function runChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  async function check<T>(
    name: string,
    request: any,
    fn: (params: any) => Promise<T>,
  ) {
    try {
      const response = await fn(request);
      results.push({ name, request, response });
    } catch (e: any) {
      results.push({ name, request, error: e?.message ?? String(e) });
    }
  }

  await check(
    "searchSongs",
    { query: SEARCH_SONG_QUERY, limit: SEARCH_LIMIT },
    searchSongs,
  );
  await check(
    "searchAlbums",
    { query: SEARCH_ALBUM_QUERY, limit: SEARCH_LIMIT },
    searchAlbums,
  );
  await check(
    "searchArtists",
    { query: SEARCH_ARTIST_QUERY, limit: SEARCH_LIMIT },
    searchArtists,
  );
  await check(
    "searchPlaylists",
    { query: SEARCH_PLAYLIST_QUERY, limit: SEARCH_LIMIT },
    searchPlaylists,
  );
  await check("getSongsById", { ids: SONG_ID }, getSongsById);
  await check("getSongByLink", { link: SONG_LINK }, getSongByLink);
  await check(
    "getSongSuggestions",
    { id: SONG_ID, limit: SEARCH_LIMIT },
    getSongSuggestions,
  );
  await check("getAlbumById", { id: ALBUM_ID }, getAlbumById);
  await check("getAlbumByLink", { link: ALBUM_LINK }, getAlbumByLink);
  await check("getArtistById", { id: ARTIST_ID }, getArtistById);
  await check("getArtistByLink", { link: ARTIST_LINK }, getArtistByLink);
  await check("getArtistSongs", { id: ARTIST_ID }, getArtistSongs);
  await check("getArtistAlbums", { id: ARTIST_ID }, getArtistAlbums);
  await check("getPlaylistById", { id: PLAYLIST_ID }, getPlaylistById);
  await check("getPlaylistByLink", { link: PLAYLIST_LINK }, getPlaylistByLink);

  return results;
}
