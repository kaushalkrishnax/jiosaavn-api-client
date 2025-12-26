/**
 * Parsing utilities for JioSaavn API Client
 * Transforms raw API responses into clean, normalized models
 * @module parsers
 * @internal
 */
import CryptoJS from "crypto-js";

import type { Models } from "./types";
import { safeString, toNumber, parseBoolean, normalizeList } from "./utils";
import { safeArrayMap, extractField, isObject } from "./validators";
import { createValidationError } from "./errors";

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
export function createImageSources(imageUrl: string): Models.ImageSource[] {
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
 * Create download links from encrypted media URL (Edge-safe)
 *
 * @param encryptedMediaUrl - Encrypted media URL from API
 * @returns Array of download links with different bitrates
 */
export function createDownloadLinks(
  encryptedMediaUrl: string
): Models.DownloadLink[] {
  if (!encryptedMediaUrl) return [];

  try {
    const key = CryptoJS.enc.Utf8.parse("38346591");

    const decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(encryptedMediaUrl),
      } as CryptoJS.lib.CipherParams,
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedLink = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedLink) return [];

    return AUDIO_QUALITIES.map((q) => ({
      bitrate: q.bitrate,
      url: decryptedLink.replace("_96", q.id),
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
    throw createValidationError("Invalid song data: not an object", {
      receivedType: typeof songData,
    });
  }

  const moreInfo: any = songData.more_info || {};
  const artistsGroup = parseArtistsGroup(moreInfo.artistMap || {});

  return {
    id: safeString(songData.id),
    type: "song" as const,
    title: safeString(songData.title),
    url: safeString(songData.perma_url),
    language: safeString(
      extractField(songData, "language") || moreInfo?.language
    ),
    releaseYear: toNumber(songData.year),
    releaseDateISO: moreInfo?.release_date,
    durationSeconds: toNumber(moreInfo?.duration),
    playCount: toNumber(extractField(songData, "play_count", "playCount")),
    label: moreInfo?.label,
    copyright: moreInfo?.copyright_text,
    isExplicit: parseBoolean(songData.explicit_content),
    hasLyrics: parseBoolean(moreInfo?.has_lyrics),
    lyricsId: moreInfo?.lyrics_id,
    album: {
      id: moreInfo?.album_id,
      title: moreInfo?.album,
      url: moreInfo?.album_url,
    },
    artists: artistsGroup,
    images: createImageSources(safeString(songData.image)),
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
    throw createValidationError("Invalid album data: not an object", {
      receivedType: typeof albumData,
    });
  }

  const moreInfo: any = albumData.more_info || {};
  const songs = safeArrayMap(albumData.list, parseSongPreview);
  const artistsGroup = parseArtistsGroup(moreInfo.artistMap || {});

  return {
    id: safeString(albumData.id),
    type: "album" as const,
    title: safeString(albumData.title),
    url: safeString(albumData.perma_url),
    language: safeString(albumData.language),
    description: safeString(
      extractField(albumData, "header_desc", "description")
    ),
    releaseYear: toNumber(extractField(albumData, "year") || moreInfo?.year),
    songCount: toNumber(moreInfo?.song_count),
    copyright: safeString(moreInfo?.copyright_text),
    isExplicit: parseBoolean(albumData.explicit_content),
    artists: artistsGroup,
    images: createImageSources(safeString(albumData.image)),
    songs: songs.length > 0 ? songs : undefined,
  };
}

/**
 * Parse complete artist entity from raw API data
 *
 * @param artistData - Raw artist data from API
 * @returns Normalized artist entity
 */
export function parseArtist(artistData: any): Models.Artist {
  if (!isObject(artistData)) {
    throw createValidationError("Invalid artist data: not an object", {
      receivedType: typeof artistData,
    });
  }

  return {
    id: safeString(extractField(artistData, "artistId", "id")),
    type: "artist" as const,
    name: safeString(artistData.name),
    url: safeString(
      artistData.perma_url ||
        (isObject(artistData.urls) && artistData.urls.overview)
    ),
    primaryLanguage: safeString(artistData.dominantLanguage),
    primaryContentType: safeString(artistData.dominantType),
    availableLanguages: safeArrayMap(artistData.availableLanguages, safeString),
    followerCount: toNumber(artistData.follower_count),
    fanCount: toNumber(artistData.fan_count),
    isVerified: parseBoolean(artistData.isVerified),
    hasRadio: parseBoolean(artistData.isRadioPresent),
    bio: safeString(artistData.bio),
    dateOfBirthISO: safeString(artistData.dob),
    facebookUrl: safeString(artistData.fb),
    twitterHandle: safeString(artistData.twitter),
    wikipediaUrl: safeString(artistData.wiki),
    routes: isObject(artistData.urls)
      ? {
          overview: safeString(artistData.urls?.overview),
          songs: safeString(artistData.urls?.songs),
          albums: safeString(artistData.urls?.albums),
          bio: safeString(artistData.urls?.bio),
          comments: safeString(artistData.urls?.comments),
        }
      : undefined,
    images: createImageSources(safeString(artistData.image)),
    topSongs: safeArrayMap(
      normalizeList(artistData.topSongs, "songs").items,
      parseSongPreview
    ),
    topAlbums: safeArrayMap(
      normalizeList(artistData.topAlbums, "albums").items,
      parseAlbumPreview
    ),
    singles: safeArrayMap(
      normalizeList(artistData.singles, "singles").items,
      parseAlbumPreview
    ),
    similarArtists: safeArrayMap(
      normalizeList(artistData.similarArtists, "artists").items,
      parseArtistPreview
    ),
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
    throw createValidationError("Invalid playlist data: not an object", {
      receivedType: typeof playlistData,
    });
  }

  const moreInfo: any = playlistData.more_info || {};
  const songs = safeArrayMap(playlistData.list, parseSongPreview);

  return {
    id: safeString(playlistData.id),
    type: "playlist" as const,
    title: safeString(playlistData.title),
    url: safeString(playlistData.perma_url),
    image: safeString(playlistData.image),
    description: safeString(
      extractField(playlistData, "description", "header_desc")
    ),
    songCount: toNumber(playlistData.list_count),
    followerCount: toNumber(moreInfo?.follower_count),
    isExplicit: parseBoolean(playlistData.explicit_content),
    songs: songs.length > 0 ? songs : undefined,
    artists: safeArrayMap(moreInfo?.artists, parseArtistPreview),
  };
}

/** Parse browse modules response from API
 *
 * @param raw - Raw modules data from API
 * @returns Normalized browse modules entity
 */
export function parseBrowseModules(raw: any): Models.BrowseModules {
  if (!isObject(raw)) {
    throw createValidationError("Invalid modules response", {
      receivedType: typeof raw,
    });
  }

  return {
    radioStations: isObject(raw?.radio)
      ? safeArrayMap(raw?.radio.featured_stations, parseRadioStationPreview)
      : undefined,
    browseDiscover: safeArrayMap(raw?.browse_discover, parseChannelPreview),
    newAlbums: safeArrayMap(raw?.new_albums, parseAlbumPreview),
    newTrending: safeArrayMap(raw?.new_trending, parseAlbumPreview),
    charts: safeArrayMap(raw?.charts, parsePlaylistPreview),
    topPlaylists: safeArrayMap(raw?.top_playlists, parsePlaylistPreview),
    topShows: isObject(raw?.top_shows)
      ? safeArrayMap(raw?.top_shows.shows, parseShowPreview)
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
    type: "songPreview" as const,
    title: safeString(song.title),
    url: safeString(song.perma_url),
    artistNames: extractArtistNames(moreInfo),
    albumName: safeString(extractField(moreInfo, "album")),
    language: safeString(extractField(moreInfo, "language") || song.language),
    durationSeconds: toNumber(extractField(moreInfo, "duration")),
    playCount: toNumber(extractField(song, "play_count", "playCount")),
    images: createImageSources(song.image),
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
    type: "albumPreview" as const,
    title: safeString(album.title),
    url: safeString(album.perma_url),
    artistNames: extractArtistNames(moreInfo),
    language: safeString(extractField(moreInfo, "language") || album.language),
    releaseYear: toNumber(extractField(moreInfo, "year") || album.year),
    images: createImageSources(safeString(album.image)),
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
    type: "artistPreview" as const,
    name: safeString(extractField(artist, "title", "name")),
    url: safeString(extractField(artist, "perma_url", "url")),
    images: createImageSources(artist.image),
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
    type: "playlistPreview" as const,
    title: safeString(playlist.title),
    url: safeString(playlist.perma_url),
    language: safeString(extractField(moreInfo, "language")),
    images: createImageSources(safeString(playlist.image)),
  };
}

/** Parse radio station preview (lightweight version for search/lists)
 *
 * @param radioStation - Raw radio station preview data from API
 * @returns Normalized radio station preview entity
 */
export function parseRadioStationPreview(
  radioStation: any
): Models.RadioStationPreview {
  if (!isObject(radioStation)) {
    throw createValidationError("Invalid radio station preview", {
      receivedType: typeof radioStation,
    });
  }

  return {
    id: safeString(radioStation.id),
    type: "radioStationPreview" as const,
    title: safeString(radioStation.title),
    url: safeString(radioStation.perma_url),
    language: safeString((radioStation.more_info as any).language),
    description: safeString((radioStation.more_info as any).description),
    color: safeString((radioStation.more_info as any).color),
    isExplicit: radioStation.explicit_content === "1",
    images: createImageSources(safeString(radioStation.image)),
  };
}

/** Parse show preview (lightweight version for search/lists)
 *
 * @param channel - Raw channel preview data from API
 * @returns Normalized channel preview entity
 */
export function parseChannelPreview(channel: any): Models.ChannelPreview {
  if (!isObject(channel)) {
    throw createValidationError("Invalid channel preview", {
      receivedType: typeof channel,
    });
  }

  const moreInfo = (channel.more_info as any) || {};
  return {
    id: safeString(channel.id),
    type: "channelPreview" as const,
    title: safeString(channel.title),
    url: safeString(channel.perma_url),
    subType: safeString(moreInfo.sub_type),
    isFeatured: moreInfo.is_featured === "1",
    available: moreInfo.available === "1",
    tags: isObject(moreInfo.tags)
      ? (moreInfo.tags as Record<string, string[]>)
      : undefined,
    videoUrl: safeString(moreInfo.video_url),
    videoThumbnail: safeString(moreInfo.video_thumbnail),
    images: createImageSources(safeString(channel.image)),
  };
}

/** Parse show preview (lightweight version for search/lists)
 *
 * @param channel - Raw channel data from API
 * @returns Normalized channel preview entity
 */
export function parseShowPreview(channel: any): Models.ShowPreview {
  if (!isObject(channel)) {
    throw createValidationError("Invalid show preview", {
      receivedType: typeof channel,
    });
  }

  const moreInfo = (channel.more_info as any) || {};
  return {
    id: safeString(channel.id),
    type: "showPreview" as const,
    title: safeString(channel.title),
    url: safeString(channel.perma_url),
    seasonNumber: toNumber(moreInfo.season_number),
    releaseDateISO: safeString(moreInfo.release_date),
    squareImage: safeString(moreInfo.square_image),
    isExplicit: channel.explicit_content === "1",
    images: createImageSources(safeString(channel.image)),
  };
}

/** Parse trending content response from API
 *
 * @param trendingContent - Raw trending content array from API
 * @returns Normalized trending content entity
 */
export function parseTrendingContent(
  trendingContent: any[]
): Models.TrendingContent {
  const result: Models.TrendingContent = {
    songs: undefined,
    albums: undefined,
    playlists: undefined,
  };

  if (!Array.isArray(trendingContent)) return result;

  for (const item of trendingContent) {
    if (!isObject(item) || typeof item.type !== "string") continue;

    switch (item.type) {
      case "song": {
        if (!result.songs) result.songs = [];
        result.songs.push(parseSongPreview(item));
        break;
      }

      case "album": {
        if (!result.albums) result.albums = [];
        result.albums.push(parseAlbumPreview(item));
        break;
      }

      case "playlist": {
        if (!result.playlists) result.playlists = [];
        result.playlists.push(parsePlaylistPreview(item));
        break;
      }

      default:
        break;
    }
  }

  return result;
}
