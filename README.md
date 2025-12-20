# JioSaavn API Client

Pure-JS client for JioSaavn's native API. Works on Node, Bun, Cloudflare Workers, Vercel Edge, and Deno.

[![npm](https://img.shields.io/npm/v/jiosaavn-api-client?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/jiosaavn-api-client)
[![downloads](https://img.shields.io/npm/dm/jiosaavn-api-client?style=for-the-badge)](https://www.npmjs.com/package/jiosaavn-api-client)
[![license](https://img.shields.io/npm/l/jiosaavn-api-client?style=for-the-badge)](./LICENSE)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
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
- 💿 **Albums** - Get album details with all songs
- 🎤 **Artists** - Get artist info with top songs and albums
- 📋 **Playlists** - Get playlist details with all songs in consistent Song format
- 🖼️ **Image Links** - Multiple quality options (50x50, 150x150, 500x500)
- 📥 **Download Links** - Multiple bitrates (12, 48, 96, 160, 320 kbps)
- 🎙️ **Song Suggestions** - Get radio recommendations

## Installation

```bash
npm install jiosaavn-api-client
# or
bun add jiosaavn-api-client
# or
yarn add jiosaavn-api-client
```

## Quick Start

### Search Songs

```typescript
import { searchSongs } from "jiosaavn-api-client";

const result = await searchSongs({ query: "blinding lights", limit: 10 });
result.data.results.forEach((song) => {
  console.log(song.title);
  console.log(song.image); // Image links in different qualities
  console.log(song.duration); // Duration in seconds
});
```

### Get Song Details by ID

```typescript
import { getSongsById } from "jiosaavn-api-client";

// Single song
const result = await getSongsById("song-id-123");
const song = result.data.songs[0];

// Multiple songs
const result = await getSongsById(["song-1", "song-2", "song-3"]);
result.data.songs.forEach((song) => {
  console.log(song.title);
  console.log(song.image); // Image links in different qualities
  console.log(song.downloadLinks); // Download links in different bitrates
});
```

### Get Playlist with All Songs

```typescript
import { getPlaylistById } from "jiosaavn-api-client";

const result = await getPlaylistById({ id: "playlist-id-123", limit: 100 });
const playlist = result.data;

console.log(playlist.title, playlist.songCount);
playlist.songs?.forEach((song) => {
  // Same Song object structure as searchSongs and getSongsById
  console.log(song.title);
  console.log(song.image); // Image links
  console.log(song.downloadLinks); // Download links
});
```

### Get Album with All Songs

```typescript
import { getAlbumById } from "jiosaavn-api-client";

const result = await getAlbumById("album-id-123");
const album = result.data;

console.log(album.title, album.songCount);
album.songs?.forEach((song) => {
  console.log(song.title);
  console.log(song.downloadLinks); // Ready for download
});
```

### Get Artist Details with Top Songs and Albums

```typescript
import { getArtistById } from "jiosaavn-api-client";

const result = await getArtistById({
  id: "artist-id-123",
  songCount: 20,
  albumCount: 10,
  sortBy: "popularity",
  sortOrder: "desc",
});

const artist = result.data;
artist.topSongs?.forEach((song) => console.log(song.title));
artist.albums?.forEach((album) => console.log(album.title));
```

### Get Song Suggestions

```typescript
import { getSongSuggestions } from "jiosaavn-api-client";

const songs = await getSongSuggestions({ songId: "song-id-123", limit: 20 });
songs.forEach((song) => console.log(song.title)); // Similar songs
```

## API Types

All responses are fully typed. Here are the main types:

### Song

```typescript
interface Song {
  id: string;
  title: string;
  artist: { id: string; name: string; image?: ImageLink[] };
  artists?: Artist[];
  album: { id: string; name: string };
  image: ImageLink[]; // Multiple quality options
  duration: number; // In seconds
  downloadLinks?: DownloadLink[]; // Multiple bitrates
  encryptedMediaUrl?: string;
  [key: string]: any;
}
```

### Album

```typescript
interface Album {
  id: string;
  title: string;
  artist: { id: string; name: string };
  image: ImageLink[];
  songs?: Song[]; // Same Song structure
  songCount?: number;
  [key: string]: any;
}
```

### Artist

```typescript
interface Artist {
  id: string;
  name: string;
  image: ImageLink[];
  topSongs?: Song[]; // Same Song structure
  albums?: Album[]; // Same Album structure
  [key: string]: any;
}
```

### Playlist

```typescript
interface Playlist {
  id: string;
  title: string;
  image: ImageLink[];
  songs?: Song[]; // Same Song structure
  songCount: number;
  owner?: { name: string };
  [key: string]: any;
}
```

### ImageLink

```typescript
interface ImageLink {
  quality: string; // '50x50', '150x150', '500x500'
  url: string;
}
```

### DownloadLink

```typescript
interface DownloadLink {
  quality: string; // '12kbps', '48kbps', '96kbps', '160kbps', '320kbps'
  url: string;
}
```

### API Response

All functions return:

```typescript
interface ApiResponse<T> {
  data: T;
  ok: boolean;
  status: number;
}
```

## API Reference

### Search Functions

- `searchAll(query)` - Search all types
- `searchSongs(args)` - Search songs: `{ query, page?, limit? }`
- `searchAlbums(args)` - Search albums: `{ query, page?, limit? }`
- `searchArtists(args)` - Search artists: `{ query, page?, limit? }`
- `searchPlaylists(args)` - Search playlists: `{ query, page?, limit? }`

### Song Functions

- `getSongsById(ids)` - Get songs by ID(s): single string or array
- `getSongByLink(link)` - Get song from JioSaavn URL
- `getSongSuggestions(args)` - Get recommendations: `{ songId, limit? }`

### Album Functions

- `getAlbumById(id)` - Get album by ID
- `getAlbumByLink(link)` - Get album from JioSaavn URL

### Artist Functions

- `getArtistById(args)` - Get artist: `{ id, page?, songCount?, albumCount?, sortBy?, sortOrder? }`
- `getArtistByLink(args)` - Get artist from JioSaavn URL
- `getArtistSongs(args)` - Get paginated artist songs: `{ id, page?, sortBy?, sortOrder? }`
- `getArtistAlbums(args)` - Get paginated artist albums: `{ id, page?, sortBy?, sortOrder? }`

### Playlist Functions

- `getPlaylistById(args)` - Get playlist: `{ id, page?, limit? }`
- `getPlaylistByLink(args)` - Get playlist from JioSaavn URL

### Utility Functions

- `createImageLinks(url)` - Create image URLs in different qualities
- `createDownloadLinks(encryptedUrl)` - Decrypt and create download URLs
- `pickUserAgent(userAgents?)` - Pick random User-Agent for requests
- `stringifyIds(ids)` - Convert single or multiple IDs to comma-separated string
- `ensureToken(token, kind)` - Ensure token exists or throw error
- `tokenExtractors` - Extract tokens from JioSaavn URLs

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

```typescript
import { 
  createDownloadLinks, 
  createImageLinks, 
  pickUserAgent,
  stringifyIds,
  ensureToken,
  tokenExtractors 
} from 'jiosaavn-api-client'

// Create download links from encrypted URL
const downloadLinks = createDownloadLinks(encryptedMediaUrl)

// Create image URLs in different qualities
const imageUrls = createImageLinks(baseImageUrl)

// Pick a random user agent
const ua = pickUserAgent()

// Convert IDs to string
const idString = stringifyIds(['id1', 'id2', 'id3']) // 'id1,id2,id3'

// Extract token from URL
const token = tokenExtractors.song(songUrl)

// Ensure token exists
const safeToken = ensureToken(token, 'song')
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
- All functions return `ApiResponse<T>` with `data`, `ok`, and `status` fields
- Check `response.ok` to determine if the request was successful
- The `data` field contains the actual response from JioSaavn API

### Song Objects
- Songs returned from any function have a consistent structure with `image` (array of `ImageLink`) and optional `downloadLinks` (array of `DownloadLink`)
- Use `createDownloadLinks()` if `downloadLinks` is not present but `encryptedMediaUrl` is available
- Use `createImageLinks()` to generate image URLs in different qualities

### Pagination
- Default `page` is 0 (first page)
- Default `limit` is 10 results per page
- Check `total` in `PaginatedResponse` to know total available results

### Error Handling
- URL token extraction functions throw errors if token cannot be extracted from URL
- Song suggestions may throw errors if station creation fails
- Always wrap API calls in try-catch for proper error handling

### Rate Limiting
- The client automatically rotates User-Agent strings to avoid rate limiting
- If you hit rate limits, consider adding delays between requests
- Use Android context for some endpoints if web context fails

### Image & Download URLs
- Images in different qualities: `50x50`, `150x150`, `500x500`
- Audio downloads in bitrates: `12kbps`, `48kbps`, `96kbps`, `160kbps`, `320kbps`
- Download URLs are decrypted automatically using DES-ECB

## License

MIT License © 2025 Kaushal Krishna

This project is licensed under the MIT License.  
You are free to use, modify, and distribute it, including for commercial purposes.

See the [LICENSE](./LICENSE) file for full details.