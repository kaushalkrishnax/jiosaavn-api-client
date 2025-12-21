# JioSaavn API Client (v2)

Pure-JS client for JioSaavn's native API with normalized client models. Works on Node, Bun, Cloudflare Workers, Vercel Edge, and Deno.

[![npm](https://img.shields.io/npm/v/jiosaavn-api-client?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/jiosaavn-api-client)
[![downloads](https://img.shields.io/npm/dm/jiosaavn-api-client?style=for-the-badge)](https://www.npmjs.com/package/jiosaavn-api-client)
[![license](https://img.shields.io/npm/l/jiosaavn-api-client?style=for-the-badge)](./LICENSE)

## Table of Contents

- [Breaking Changes (v2.0.0)](#breaking-changes-v200)
- [Features](#features)
- [Installation](#installation)
- [Scope and Non-Goals](#scope-and-non-goals)
- [Quick Start](#quick-start)
- [API Types](#api-types)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)
- [Compatibility](#compatibility)
- [Notes](#notes)
- [License](#license)

## Features

✨ **Out-of-the-box ready** - All functions are fully typed and documented

- 🔍 **Search** - Songs, Albums, Artists, Playlists
- 🎵 **Songs** - Get by ID(s), Link, or Suggestions
- 💿 **Albums** - Get album details with track listing
- 🎤 **Artists** - Get artist info with top songs and albums
- 📋 **Playlists** - Get playlist details with track listing
- 🖼️ **Image Links** - Multiple quality options (50x50, 150x150, 500x500)
- 📥 **Download Links** - Multiple bitrates (12, 48, 96, 160, 320 kbps)
- 🎙️ **Song Suggestions** - Get radio recommendations

## Scope and Non-Goals

This library focuses on:

- Typed access to JioSaavn metadata and media URLs
- Consistent response structures across APIs
- Cross-runtime compatibility (Node, Bun, Edge, Workers)

This library does not aim to:

- Replace the official JioSaavn application
- Act as a streaming service
- Provide guaranteed long-term API stability

## Installation

```bash
npm install jiosaavn-api-client
# or
bun add jiosaavn-api-client
# or
yarn add jiosaavn-api-client
```

## Breaking Changes (v2.0.0)

- Types are now split into `Raw` (internal) and `Models` (public). All public APIs return normalized `Models`.
- `image` → `images: ImageSource[]`, `encrypted_media_url` → `downloadLinks: DownloadLink[]` (pre-decrypted).
- Booleans normalized: `explicit_content` → `isExplicit`, `isRadioPresent` → `hasRadio`.
- `type` → `entityType`.
- Pagination unified via `Paginated<T>` with `total`, `page`, `limit`, `results`.
- API results use `ApiResult<T>` (`{ success: true, data } | { success: false, message, code }`).
- Both `JioSaavnClient` and standalone convenience functions are supported. Use `createClient()` to configure the default client used by the standalone functions.

## Quick Start

### Create a client (recommended)

```typescript
import { JioSaavnClient } from "jiosaavn-api-client";

const client = new JioSaavnClient({
  baseUrl: "https://www.jiosaavn.com/api.php", // optional override
  timeoutMs: 8000, // optional
});
```

### Search songs (previews)

```typescript
const songsResult = await client.searchSongs({
  query: "blinding lights",
  limit: 10,
});
if (!songsResult.success) throw new Error(songsResult.message);

songsResult.data.results.forEach((song) => {
  console.log(song.title);
  console.log(song.images); // ImageSource[]
  console.log(song.artistNames); // string[]
});
```

### Get full song objects by ID

```typescript
const full = await client.getSongsById({ ids: ["song-1", "song-2"] });
if (!full.success) throw new Error(full.message);

full.data.forEach((song) => {
  console.log(song.title);
  console.log(song.images); // ImageSource[]
  console.log(song.downloadLinks); // DownloadLink[] (multiple bitrates)
  console.log(song.artists.primary); // ArtistPreview[]
});
```

### Get a playlist (song previews)

```typescript
const playlistResult = await client.getPlaylistById({
  id: "playlist-id-123",
  limit: 100,
});
if (!playlistResult.success) throw new Error(playlistResult.message);

const playlist = playlistResult.data;
console.log(playlist.title, playlist.songCount);
playlist.songs?.forEach((song) => {
  console.log(song.title, song.artistNames.join(", "));
});
```

### Get an album

```typescript
const albumResult = await client.getAlbumById({ id: "album-id-123" });
if (!albumResult.success) throw new Error(albumResult.message);

const album = albumResult.data;
console.log(album.title, album.releaseYear);
album.songs?.forEach((song) => console.log(song.title));
```

### Get artist details

```typescript
const artistResult = await client.getArtistById({
  id: "artist-id-123",
  songCount: 10,
  albumCount: 5,
});
if (!artistResult.success) throw new Error(artistResult.message);

const artist = artistResult.data;
console.log(artist.name, artist.hasRadio);
artist.topSongs?.forEach((song) => console.log(song.title));
```

### Song suggestions (radio)

```typescript
const suggest = await client.getSongSuggestions({
  id: "song-id-123",
  limit: 20,
});
if (!suggest.success) throw new Error(suggest.message);

suggest.data.forEach((song) => console.log(song.title));
```

## API Types

Public models live under `Models`:

```typescript
type ImageSource = { resolution: string; url: string };
type DownloadLink = { bitrate: string; url: string };

type ArtistPreview = {
  id: string;
  name: string;
  images: ImageSource[];
  url: string;
};
type ArtistsGroup = {
  primary: ArtistPreview[];
  featured?: ArtistPreview[];
  all?: ArtistPreview[];
};

type Song = {
  id: string;
  title: string;
  entityType: string; // "song"
  releaseYear?: number | undefined;
  releaseDateISO?: string | undefined;
  durationSeconds?: number | undefined;
  label?: string | undefined;
  isExplicit: boolean;
  playCount?: number | undefined;
  language: string;
  hasLyrics: boolean;
  lyricsId?: string | undefined;
  url: string;
  album: {
    id: string | undefined;
    title: string | undefined;
    url: string | undefined;
  };
  artists: ArtistsGroup;
  images: ImageSource[];
  downloadLinks: DownloadLink[];
};

type Album = {
  id: string;
  title: string;
  description?: string | undefined;
  releaseYear?: number | undefined;
  entityType: string; // "album"
  playCount?: number | undefined;
  language: string;
  isExplicit: boolean;
  artists: ArtistsGroup;
  songCount?: number | undefined;
  url: string;
  images: ImageSource[];
  songs?: SongPreview[] | undefined;
};

type Artist = {
  id: string;
  name: string;
  url: string;
  entityType: string; // "artist"
  images: ImageSource[];
  followerCount?: number | undefined;
  fanCount?: number | undefined;
  isVerified?: boolean | undefined;
  primaryLanguage?: string | undefined;
  primaryContentType?: string | undefined;
  dateOfBirthISO?: string | undefined;
  hasRadio?: boolean | undefined;
  availableLanguages: string[];
  topSongs?: SongPreview[] | undefined;
  topAlbums?: AlbumPreview[] | undefined;
  singles?: SongPreview[] | undefined;
  similarArtists?: ArtistPreview[] | undefined;
};

type Playlist = {
  id: string;
  title: string;
  description?: string | undefined;
  releaseYear?: number | undefined;
  entityType: string; // "playlist"
  playCount?: number | undefined;
  language: string;
  isExplicit: boolean;
  songCount?: number | undefined;
  url: string;
  images: ImageSource[];
  songs?: SongPreview[] | undefined;
  artists?: ArtistPreview[] | undefined;
};

type Paginated<T> = {
  total: number;
  page: number;
  limit: number;
  results: T[];
};
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; code: string };
```

## API Reference

This package exposes both:

- `JioSaavnClient` (recommended) for instance-specific configuration
- Standalone convenience functions that use an internal default client (configure via `createClient()`)

### Search Functions

- `searchAll(query)` - Search all types (previews)
- `searchSongs(args)` - Song previews: `{ query, page?, limit? }`
- `searchAlbums(args)` - Album previews: `{ query, page?, limit? }`
- `searchArtists(args)` - Artist previews: `{ query, page?, limit? }`
- `searchPlaylists(args)` - Playlist previews: `{ query, page?, limit? }`

### Song Functions

- `getSongsById({ ids })` - Full songs (downloadLinks, images, artists)
- `getSongByLink({ link })`
- `getSongSuggestions({ id, limit? })` - Radio suggestions

### Album Functions

- `getAlbumById({ id })`
- `getAlbumByLink({ link })`

### Artist Functions

- `getArtistById({ id, page?, songCount?, albumCount?, sortBy?, sortOrder? })`
- `getArtistByLink({ link, ...same })`
- `getArtistSongs({ id, page?, sortBy?, sortOrder? })`
- `getArtistAlbums({ id, page?, sortBy?, sortOrder? })`

### Playlist Functions

- `getPlaylistById({ id, page?, limit? })`
- `getPlaylistByLink({ link, page?, limit? })`

### Utility Functions

- Configure the default client used by convenience functions: `createClient({ baseUrl?, fetch?, timeoutMs? })`
- Low-level fetch: `fetchFromSaavn` via `jiosaavn-api-client/fetch`
- Helpers: `pickUserAgent`, `retry`, `delay`, `extractToken`, etc via `jiosaavn-api-client/utils`

## Advanced Usage

### Custom User Agents

```typescript
import { fetchFromSaavn } from "jiosaavn-api-client/fetch";

const response = await fetchFromSaavn({
  endpoint: "song.getDetails",
  params: { pids: "song-id" },
  userAgents: ["Custom UA 1", "Custom UA 2"],
});
```

### Android Context

```typescript
import { fetchFromSaavn } from "jiosaavn-api-client/fetch";

const response = await fetchFromSaavn({
  endpoint: "webradio.createEntityStation",
  params: {
    /* ... */
  },
  context: "android", // Use Android API context
});
```

### Direct API Access

```typescript
import { fetchFromSaavn } from "jiosaavn-api-client/fetch";

const response = await fetchFromSaavn({
  endpoint: "song.getDetails",
  params: { pids: "song-id" },
  context: "web6dot0",
  headers: { "X-Custom": "header" },
});
```

### Utility Helper Functions

These helpers are exposed for advanced use cases and internal composition.
They are not considered part of the stable public API.

```typescript
import {
  pickUserAgent,
  retry,
  delay,
  extractToken,
  buildQueryString,
} from "jiosaavn-api-client/utils";

// Pick a random user agent
const ua = pickUserAgent();

// Extract an entity token from a JioSaavn URL (returns undefined if not matched)
const token = extractToken(songUrl, "song");

// Build a query string
const qs = buildQueryString({ pids: "id1,id2", ctx: "web6dot0" });

// Retry a request with backoff
await retry(async () => {
  await delay(250);
});
```

## Compatibility

- ✅ Node.js (18+)
- ✅ Bun
- ✅ Deno
- ✅ Cloudflare Workers
- ✅ Vercel Edge Functions
- ✅ Browser (with appropriate fetch implementation)

## Notes

### Response Structure

- High-level client APIs return `ApiResult<T>` (`success: true/false`)
- Low-level `fetchFromSaavn` returns `{ data, ok, status }` (useful for advanced / raw API calls)

### Song Objects

- Normalized songs include `images: ImageSource[]` and `downloadLinks: DownloadLink[]`
- For previews (search results / album / playlist listings), you get `SongPreview` objects (lighter payload)

### Pagination

- Default `page` is 0 (first page)
- Default `limit` is 10 results per page
- Check `total` in `Paginated<T>` to know total available results

### Error Handling

- High-level APIs return failures as `ApiResult` (no throwing on expected API failures)
- If you want structured error info, use `code: ErrorCode` in the failure object
- Low-level fetch helpers may still throw for network / JSON parsing issues

### Rate Limiting

- The client supports User-Agent rotation to reduce the risk of request throttling.
- This does not guarantee immunity from upstream rate limits.
- If you hit rate limits, consider adding delays between requests
- Use Android context for some endpoints if web context fails

### Image & Download URLs

- Images in different qualities: `50x50`, `150x150`, `500x500`
- Audio downloads in bitrates: `12kbps`, `48kbps`, `96kbps`, `160kbps`, `320kbps`
- Download URLs are decrypted automatically using DES-ECB

## Disclaimer

This is an unofficial client and is not affiliated with or endorsed by JioSaavn.

This library does not host, cache, or redistribute media. All data and URLs are fetched directly from JioSaavn’s publicly accessible endpoints.

Usage and compliance with applicable terms are the responsibility of the end user.

## License

MIT License © 2025 Kaushal Krishna

This project is licensed under the MIT License.  
You are free to use, modify, and distribute it, including for commercial purposes.

See the [LICENSE](./LICENSE) file for full details.
