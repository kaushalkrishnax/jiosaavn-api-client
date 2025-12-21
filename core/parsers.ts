/**
 * Parsing utilities for JioSaavn API Client
 * Transforms raw API responses into clean, normalized models
 * @module parsers
 * @internal
 */

import type { Models, Paginated } from "../index.js";
import {
  safeArrayMap,
  safeString,
  toNumber,
  parseBoolean,
  extractField,
  isObject,
} from "./validators.js";

const IMAGE_QUALITIES = ["50x50", "150x150", "500x500"] as const;
const AUDIO_QUALITIES = [
  { id: "_12", bitrate: "12kbps" },
  { id: "_48", bitrate: "48kbps" },
  { id: "_96", bitrate: "96kbps" },
  { id: "_160", bitrate: "160kbps" },
  { id: "_320", bitrate: "320kbps" },
] as const;

/**
 * Create image sources from base URL
 *
 * @param imageUrl - Base image URL from API
 * @returns Array of image sources with different resolutions
 */
export function createImageSources(
  imageUrl: string | undefined
): Models.ImageSource[] {
  if (!imageUrl) return [];

  const protocolRegex = /^http:\/\//;
  const qualityRegex = /150x150|50x50/;

  return IMAGE_QUALITIES.map((resolution) => ({
    resolution,
    url: imageUrl
      .replace(qualityRegex, resolution)
      .replace(protocolRegex, "https://"),
  }));
}

/**
 * Create download links from encrypted media URL
 *
 * @param encryptedMediaUrl - Encrypted media URL from API
 * @returns Array of download links with different bitrates
 */
export function createDownloadLinks(
  encryptedMediaUrl: string | undefined
): Models.DownloadLink[] {
  if (!encryptedMediaUrl) return [];

  try {
    const forge = require("node-forge");
    const key = "38346591";
    const iv = "00000000";

    const encrypted = forge.util.decode64(encryptedMediaUrl);
    const decipher = forge.cipher.createDecipher(
      "DES-ECB",
      forge.util.createBuffer(key)
    );
    decipher.start({ iv: forge.util.createBuffer(iv) });
    decipher.update(forge.util.createBuffer(encrypted));
    decipher.finish();
    const decryptedLink: string = decipher.output.getBytes();

    return AUDIO_QUALITIES.map((quality) => ({
      bitrate: quality.bitrate,
      url: decryptedLink.replace("_96", quality.id),
    }));
  } catch {
    return [];
  }
}

/**
 * Extract artist names from more_info object
 * @param moreInfo - more_info object from song/album data
 * @returns Array of artist names
 */
export function extractArtistNames(moreInfo: any): string[] {
  const refs = Array.isArray(moreInfo?.artistMap?.primary_artists)
    ? moreInfo.artistMap.primary_artists
    : [];

  if (refs.length) {
    return refs
      .map(parseArtistPreview)
      .map((a: Models.ArtistPreview) => a.name)
      .filter(Boolean);
  }

  return safeString(extractField(moreInfo, "primary_artists", "singers"))
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
}

/**
 * Parse artist summary from raw API data
 *
 * @param raw - Raw artist data
 * @returns Normalized artist summary
 */
export function parseArtistSummary(raw: any): Models.ArtistPreview {
  return {
    ...parseArtistPreview(raw),
    images: createImageSources(
      safeString(extractField(raw, "image", "image_url"))
    ),
    url: safeString(extractField(raw, "perma_url", "url")),
  };
}

/**
 * Parse artists group from artistMap
 *
 * @param artistMap - Raw artist map from API
 * @returns Structured artists group and optional allArtists array
 */
export function parseArtistsGroup(artistMap: any): Models.ArtistsGroup {
  const primary = safeArrayMap(artistMap?.primary_artists, parseArtistPreview);
  const featured = safeArrayMap(
    artistMap?.featured_artists,
    parseArtistPreview
  );
  const all = safeArrayMap(artistMap?.artists, parseArtistPreview);

  return {
    primary: primary.length > 0 ? primary : [],
    featured: featured.length > 0 ? featured : [],
    all: all.length > 0 ? all : [],
  };
}

/**
 * Parse complete song entity from raw API data
 *
 * @param songData - Raw song data from API
 * @returns Normalized song entity
 */
export function parseSong(songData: any): Models.Song {
  if (!isObject(songData)) {
    throw new Error("Invalid song data: not an object");
  }

  const moreInfo: any = songData.more_info || {};
  const artistsGroup = parseArtistsGroup(moreInfo.artistMap || {});

  return {
    id: safeString(songData.id),
    title: safeString(songData.title),
    entityType: "song" as const,
    releaseYear: toNumber(songData.year),
    releaseDateISO: moreInfo?.release_date ?? undefined,
    durationSeconds: toNumber(moreInfo?.duration),
    label: moreInfo?.label ?? undefined,
    isExplicit: parseBoolean(songData.explicit_content),
    playCount: toNumber(extractField(songData, "play_count", "playCount")),
    language: safeString(
      extractField(songData, "language") || moreInfo?.language
    ),
    hasLyrics: parseBoolean(moreInfo?.has_lyrics),
    lyricsId: moreInfo?.lyrics_id ?? undefined,
    url: safeString(songData.perma_url),
    copyright: moreInfo?.copyright_text ?? undefined,
    album: {
      id: moreInfo?.album_id ?? undefined,
      title: moreInfo?.album ?? undefined,
      url: moreInfo?.album_url ?? undefined,
    },
    artists: artistsGroup,
    images: createImageSources(songData.image as string | undefined),
    downloadLinks: createDownloadLinks(moreInfo?.encrypted_media_url),
  };
}

/**
 * Parse complete album entity from raw API data
 *
 * @param albumData - Raw album data from API
 * @returns Normalized album entity
 */
export function parseAlbum(albumData: any): Models.Album {
  if (!isObject(albumData)) {
    throw new Error("Invalid album data: not an object");
  }

  const moreInfo: any = albumData.more_info || {};
  const songs = safeArrayMap(albumData.list, parseSongPreview);
  const artistsGroup = parseArtistsGroup(moreInfo.artistMap || {});

  return {
    id: safeString(albumData.id),
    title: safeString(albumData.title),
    description:
      safeString(extractField(albumData, "header_desc", "description")) ||
      undefined,
    releaseYear: toNumber(extractField(albumData, "year") || moreInfo?.year),
    entityType: "album" as const,
    playCount: toNumber(albumData.play_count),
    language: safeString(albumData.language),
    isExplicit: parseBoolean(albumData.explicit_content),
    artists: artistsGroup,
    songCount: toNumber(moreInfo?.song_count),
    url: safeString(albumData.perma_url),
    images: createImageSources(albumData.image as string | undefined),
    songs: songs.length > 0 ? songs : undefined,
  };
}

/**
 * Parse complete playlist entity from raw API data
 *
 * @param playlistData - Raw playlist data from API
 * @returns Normalized playlist entity
 */
export function parsePlaylist(playlistData: any): Models.Playlist {
  if (!isObject(playlistData)) {
    throw new Error("Invalid playlist data: not an object");
  }

  const moreInfo: any = playlistData.more_info || {};
  const songs = safeArrayMap(playlistData.list, parseSongPreview);

  return {
    id: safeString(playlistData.id),
    title: safeString(playlistData.title),
    description:
      safeString(extractField(playlistData, "description", "header_desc")) ||
      undefined,
    releaseYear: toNumber(playlistData.year),
    entityType: "playlist" as const,
    playCount: toNumber(playlistData.play_count),
    language: safeString(
      extractField(playlistData, "language") || moreInfo?.language
    ),
    isExplicit: parseBoolean(playlistData.explicit_content),
    songCount: toNumber(extractField(moreInfo, "song_count")),
    url: safeString(playlistData.perma_url),
    images: createImageSources(playlistData.image as string | undefined),
    songs: songs.length > 0 ? songs : undefined,
    artists:
      safeArrayMap(moreInfo?.artists, parseArtistPreview).length > 0
        ? safeArrayMap(moreInfo?.artists, parseArtistPreview)
        : undefined,
  };
}

/**
 * Parse complete artist detail from raw API data
 *
 * @param artistData - Raw artist data from API
 * @returns Normalized artist entity
 */
export function parseArtistDetail(artistData: any): Models.Artist {
  if (!isObject(artistData)) {
    throw new Error("Invalid artist data: not an object");
  }

  return {
    id: safeString(extractField(artistData, "artistId", "id")),
    name: safeString(artistData.name),
    url: safeString(artistData.perma_url),
    entityType: "artist" as const,
    images: createImageSources(artistData.image as string | undefined),
    followerCount: toNumber(artistData.follower_count),
    fanCount: toNumber(artistData.fan_count),
    isVerified: (artistData.isVerified as boolean | undefined) ?? undefined,
    primaryLanguage:
      (artistData.dominantLanguage as string | undefined) ?? undefined,
    primaryContentType:
      (artistData.dominantType as string | undefined) ?? undefined,
    bio: Array.isArray(artistData.bio) ? artistData.bio : undefined,
    dateOfBirthISO: (artistData.dob as string | undefined) ?? undefined,
    facebookUrl: (artistData.fb as string | undefined) ?? undefined,
    twitterHandle: (artistData.twitter as string | undefined) ?? undefined,
    wikipediaUrl: (artistData.wiki as string | undefined) ?? undefined,
    availableLanguages:
      (artistData.availableLanguages as string[] | undefined) || [],
    hasRadio: (artistData.isRadioPresent as boolean | undefined) ?? undefined,
    topSongs:
      safeArrayMap(artistData.topSongs, parseSongPreview).length > 0
        ? safeArrayMap(artistData.topSongs, parseSongPreview)
        : undefined,
    topAlbums:
      safeArrayMap(artistData.topAlbums, parseAlbumPreview).length > 0
        ? safeArrayMap(artistData.topAlbums, parseAlbumPreview)
        : undefined,
    singles:
      safeArrayMap(artistData.singles, parseSongPreview).length > 0
        ? safeArrayMap(artistData.singles, parseSongPreview)
        : undefined,
    similarArtists:
      safeArrayMap(artistData.similarArtists, parseArtistPreview).length > 0
        ? safeArrayMap(artistData.similarArtists, parseArtistPreview)
        : undefined,
  };
}

/**
 * Parse song preview (lightweight version for search/lists)
 *
 * @param song - Raw song data
 * @returns Normalized song preview
 */
export function parseSongPreview(song: any): Models.SongPreview {
  const moreInfo = song?.more_info || {};

  return {
    id: safeString(song.id),
    title: safeString(song.title),
    artistNames: extractArtistNames(moreInfo),
    albumName: safeString(extractField(moreInfo, "album")),
    durationSeconds: toNumber(extractField(moreInfo, "duration")),
    playCount: toNumber(extractField(song, "play_count", "playCount")),
    images: createImageSources(song.image),
    url: safeString(song.perma_url),
    language: safeString(extractField(moreInfo, "language") || song.language),
  };
}

/**
 * Parse album preview (lightweight version for search/lists)
 *
 * @param album - Raw album data
 * @returns Normalized album preview
 */
export function parseAlbumPreview(album: any): Models.AlbumPreview {
  const moreInfo = album?.more_info || {};

  return {
    id: safeString(album.id),
    title: safeString(album.title),
    artistNames: extractArtistNames(moreInfo),
    images: createImageSources(safeString(album.image)),
    releaseYear: toNumber(extractField(moreInfo, "year") || album.year),
    url: safeString(album.perma_url),
    language: safeString(extractField(moreInfo, "language") || album.language),
  };
}

/**
 * Parse artist preview (lightweight version for search/lists)
 *
 * @param artist - Raw artist data
 * @returns Normalized artist preview
 */
export function parseArtistPreview(artist: any): Models.ArtistPreview {
  return {
    id: safeString(artist.id),
    name: safeString(extractField(artist, "title", "name")),
    images: createImageSources(artist.image),
    url: safeString(extractField(artist, "perma_url", "url")),
  };
}

/**
 * Parse playlist preview (lightweight version for search/lists)
 *
 * @param playlist - Raw playlist data
 * @returns Normalized playlist preview
 */
export function parsePlaylistPreview(playlist: any): Models.PlaylistPreview {
  const moreInfo = playlist?.more_info || {};
  return {
    id: safeString(playlist.id),
    title: safeString(playlist.title),
    images: createImageSources(safeString(playlist.image)),
    language: safeString(extractField(moreInfo, "language")),
    url: safeString(playlist.perma_url),
  };
}

/**
 * Build paginated result wrapper
 *
 * @param results - Array of results
 * @param total - Total count from API
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Paginated wrapper
 */
export function buildPaginated<T>(
  results: T[],
  total: number | undefined,
  page: number,
  limit: number
): Paginated<T> {
  return {
    total: total ?? results.length,
    page,
    limit,
    results,
  };
}
