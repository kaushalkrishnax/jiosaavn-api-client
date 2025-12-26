# JioSaavn API Client (v2)

Pure-JS client for JioSaavn's native API with normalized models. Works on Node, Bun, Cloudflare Workers, Vercel Edge, and Deno.

[![npm](https://img.shields.io/npm/v/jiosaavn-api-client?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/jiosaavn-api-client)
[![downloads](https://img.shields.io/npm/dm/jiosaavn-api-client?style=for-the-badge)](https://www.npmjs.com/package/jiosaavn-api-client)
[![license](https://img.shields.io/npm/l/jiosaavn-api-client?style=for-the-badge)](./LICENSE)

## Features

✨ **Out-of-the-box ready** - Fully typed, structured error handling, normalized responses

- 🔍 **Search** - Songs, Albums, Artists, Playlists
- 🎵 **Songs** - Full details, download links, images
- 💿 **Albums** - Album info with track listing
- 🎤 **Artists** - Artist profiles with top songs/albums
- 📋 **Playlists** - Playlist details with tracks
- 🖼️ **Images** - Multiple qualities (50x50, 150x150, 500x500)
- 📥 **Downloads** - Multiple bitrates (12, 48, 96, 160, 320 kbps), auto-decrypted

## Installation

```bash
npm install jiosaavn-api-client
```

## Quick Start

```typescript
import { JioSaavnClient } from "jiosaavn-api-client";

const client = new JioSaavnClient();

// Search
const songs = await client.searchSongs({ query: "test" });
if (songs.success) {
  songs.data.results.forEach((s) => console.log(s.title));
}

// Get details
const album = await client.getAlbumById({ id: "album-123" });
if (album.success) {
  console.log(album.data.title);
  album.data.songs?.forEach((s) => console.log(s.title));
}

// Error handling
const artist = await client.getArtistById({ id: "artist-123" });
if (!artist.success) {
  console.log(artist.code); // ErrorCode
  console.log(artist.message); // Error message
}
```

## Documentation

- **[Getting Started](./docs/GETTING_STARTED.md)** - Installation and quick examples
- **[API Reference](./docs/API_REFERENCE.md)** - All available methods and types
- **[Error Handling](./docs/ERROR_HANDLING.md)** - Structured error handling (6 error codes)
- **[Advanced Usage](./docs/ADVANCED.md)** - Custom configs, raw API access, utilities
- **[Migration Guide](./docs/MIGRATION.md)** - v1 → v2 breaking changes

## Key Features

### Structured Error Handling

6 essential error codes instead of 15+ granular ones:

```typescript
ErrorCode.NETWORK_ERROR; // Network issues
ErrorCode.API_ERROR; // API failures
ErrorCode.VALIDATION_ERROR; // Invalid input
ErrorCode.NOT_FOUND; // Resource not found
ErrorCode.DEPRECATED_METHOD_ERROR; // Removed method
ErrorCode.UNKNOWN_ERROR; // Catch-all
```

Context provides specific details - check `error.context` for endpoint, id, status, etc.

### Normalized Models

```typescript
// Images - multiple qualities
song.images.forEach((img) => {
  console.log(img.resolution); // "50x50", "150x150", "500x500"
  console.log(img.url);
});

// Downloads - pre-decrypted, multiple bitrates
song.downloadLinks.forEach((link) => {
  console.log(link.bitrate); // "320kbps"
  console.log(link.url); // Ready to use
});

// Booleans - consistent naming
song.isExplicit; // instead of explicit_content
artist.hasRadio; // instead of isRadioPresent
```

### Instance-Based Config

```typescript
const client = new JioSaavnClient({
  baseUrl: "https://...",
  timeoutMs: 5000,
});

// Or configure default client
import { createClient } from "jiosaavn-api-client";
createClient({ baseUrl: "https://..." });
```

## Compatibility

- ✅ Node.js (18+)
- ✅ Bun
- ✅ Deno
- ✅ Cloudflare Workers
- ✅ Vercel Edge Functions
- ✅ Browser (with fetch)

## Scope

This library provides:

- Typed access to JioSaavn metadata and media URLs
- Consistent response structures
- Cross-runtime compatibility

This library does NOT:

- Replace the official JioSaavn app
- Act as a streaming service
- Guarantee long-term API stability

## Disclaimer

This is an unofficial client not affiliated with JioSaavn.

This library does not host, cache, or redistribute media. All data/URLs are fetched directly from JioSaavn's publicly accessible endpoints.

Usage compliance is the end user's responsibility.

## License

MIT © 2025 Kaushal Krishna

See [LICENSE](./LICENSE) for details.
