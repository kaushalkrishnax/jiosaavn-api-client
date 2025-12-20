# jiosaavn-api-client

TypeScript/JavaScript client for JioSaavn's native API. Direct access to songs, albums, artists, playlists, and search—no proxy server needed.

[![npm](https://img.shields.io/npm/v/jiosaavn-api-client?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/jiosaavn-api-client)
[![downloads](https://img.shields.io/npm/dm/jiosaavn-api-client?style=for-the-badge))](https://www.npmjs.com/package/jiosaavn-api-client)
[![license](https://img.shields.io/npm/l/jiosaavn-api-client?style=for-the-badge))](./LICENSE)

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Common Patterns](#common-patterns)
- [Platforms](#platforms)
- [Error Handling](#error-handling)
- [Notes](#notes)

## Features
- 🎵 **Search** songs, albums, artists, playlists
- 🔊 **Song suggestions** & infinite radio
- 🎬 Full **album**, **artist**, **playlist** support
- 🔐 **Audio URL decryption** (DES-ECB, pure-JS)
- 🌍 Works on **Node.js**, **Bun**, **Cloudflare Workers**, **Vercel Edge**, **Deno**
- 📦 Full **TypeScript** support
- ⚡ Auto **link token extraction**

## Installation

```bash
# npm 
npm install jiosaavn-api-client

# bun
bun add jiosaavn-api-client

# pnpm
pnpm add jiosaavn-api-client
```

## Quick Start

```typescript
import { getSongsById, searchSongs, createDownloadLinks } from 'jiosaavn-api-client'

// Search songs
const search = await searchSongs({ query: 'imagine dragons', limit: 5 })
console.log(search.data.results[0])

// Get by ID
const { data } = await getSongsById('3IoDK8qI')
const song = data.songs[0]

// Get download links
const links = createDownloadLinks(song.more_info.encrypted_media_url)
console.log(links) // [{ quality: '320kbps', url: '...' }, ...]
```

## API Reference

### Search Methods

#### `searchAll(query: string)`
Global search across all types.
```typescript
const { data } = await searchAll('believer')
// Returns: { songs: [...], albums: [...], artists: [...], playlists: [...] }
```

#### `searchSongs({ query, page?, limit? })`
Search songs with pagination.
```typescript
const { data } = await searchSongs({ query: 'believer', page: 0, limit: 10 })
console.log(data.total)     // total results
console.log(data.results)   // [{ id, title, more_info, ... }]
```

#### `searchAlbums({ query, page?, limit? })`
```typescript
const { data } = await searchAlbums({ query: 'evolve' })
```

#### `searchArtists({ query, page?, limit? })`
```typescript
const { data } = await searchArtists({ query: 'adele' })
```

#### `searchPlaylists({ query, page?, limit? })`
```typescript
const { data } = await searchPlaylists({ query: 'indie' })
```

### Songs

#### `getSongsById(songIds: string | string[])`
Fetch songs by one or multiple IDs.
```typescript
// Single song
const { data } = await getSongsById('3IoDK8qI')

// Multiple songs
const { data } = await getSongsById(['3IoDK8qI', '4IoDK8qI', '5IoDK8qI'])

console.log(data.songs[0])
// {
//   id: '3IoDK8qI',
//   title: 'Levitating',
//   more_info: { encrypted_media_url, album, artists, ... }
// }
```

#### `getSongsByLink(link: string)`
Fetch song by JioSaavn link (auto-extracts token).
```typescript
const { data } = await getSongsByLink('https://www.jiosaavn.com/song/houdini/OgwhbhtDRwM')
console.log(data.songs[0].title)
```

#### `getSongSuggestions(songId: string, limit?: number)`
Get song radio suggestions.
```typescript
const { data } = await getSongSuggestions('3IoDK8qI', 10)
console.log(data)  // [{ id, title, ... }, ...]
```

#### `createSongStation(songId: string)`
Create a station for infinite radio playback.
```typescript
const stationId = await createSongStation('3IoDK8qI')
// Use stationId to fetch infinite suggestions
```

### Albums

#### `getAlbumById(albumId: string)`
```typescript
const { data } = await getAlbumById('23241654')
console.log(data.name)              // Album name
console.log(data.songs)             // [song1, song2, ...]
console.log(data.artists)           // Primary artists
```

#### `getAlbumByLink(link: string)`
```typescript
const { data } = await getAlbumByLink('https://www.jiosaavn.com/album/future-nostalgia/ITIyo-GDr7A_')
```

### Artists

#### `getArtistById(options)`
```typescript
const { data } = await getArtistById({
  artistId: '1274170',
  page: 0,
  songCount: 10,
  albumCount: 5,
  sortBy: 'popularity',  // 'popularity' | 'latest' | 'alphabetical'
  sortOrder: 'asc'       // 'asc' | 'desc'
})
console.log(data.topSongs)      // Latest songs
console.log(data.topAlbums)     // Latest albums
console.log(data.similarArtists) // Related artists
```

#### `getArtistByLink(options)`
```typescript
const { data } = await getArtistByLink({
  link: 'https://www.jiosaavn.com/artist/dua-lipa-songs/r-OWIKgpX2I_',
  songCount: 15
})
```

#### `getArtistSongs(options)`
Get artist's songs with sorting.
```typescript
const { data } = await getArtistSongs({
  artistId: '1274170',
  page: 0,
  sortBy: 'latest'
})
```

#### `getArtistAlbums(options)`
Get artist's albums.
```typescript
const { data } = await getArtistAlbums({
  artistId: '1274170',
  page: 0
})
```

### Playlists

#### `getPlaylistById(options)`
```typescript
const { data } = await getPlaylistById({
  id: '82914609',
  page: 0,
  limit: 20
})
console.log(data.songs)  // Paginated songs
```

#### `getPlaylistByLink(options)`
```typescript
const { data } = await getPlaylistByLink({
  link: 'https://www.jiosaavn.com/featured/its-indie-english/AMoxtXyKHoU_',
  limit: 50
})
```

### Utilities

#### `createDownloadLinks(encryptedMediaUrl: string)`
Decrypt encrypted audio URL and generate multiple bitrates.
```typescript
const links = createDownloadLinks(encryptedMediaUrl)
// Output:
// [
//   { quality: '12kbps', url: '...' },
//   { quality: '48kbps', url: '...' },
//   { quality: '96kbps', url: '...' },
//   { quality: '160kbps', url: '...' },
//   { quality: '320kbps', url: '...' }
// ]
```

#### `createImageLinks(imageUrl: string)`
Generate image URLs in multiple resolutions.
```typescript
const images = createImageLinks(imageUrl)
// Output:
// [
//   { quality: '50x50', url: '...' },
//   { quality: '150x150', url: '...' },
//   { quality: '500x500', url: '...' }
// ]
```

#### `tokenExtractors`
Manually extract tokens from JioSaavn URLs.
```typescript
import { tokenExtractors } from 'jiosaavn-api-client'

const songToken = tokenExtractors.song('https://www.jiosaavn.com/song/houdini/OgwhbhtDRwM')
const albumToken = tokenExtractors.album('https://www.jiosaavn.com/album/evolve/...')
const artistToken = tokenExtractors.artist('https://www.jiosaavn.com/artist/dua-lipa-songs/...')
const playlistToken = tokenExtractors.playlist('https://www.jiosaavn.com/featured/indie/...')
```

## Common Patterns

### Search and Get Details
```typescript
import { searchSongs, getSongsById } from 'jiosaavn-api-client'

const search = await searchSongs({ query: 'believer', limit: 1 })
const songId = search.data.results[0].id

const details = await getSongsById(songId)
const song = details.data.songs[0]
console.log(song.more_info.album)
```

### Download Audio
```typescript
import { getSongsById, createDownloadLinks } from 'jiosaavn-api-client'

const { data } = await getSongsById('3IoDK8qI')
const encrypted = data.songs[0].more_info.encrypted_media_url

const links = createDownloadLinks(encrypted)
const highQuality = links.find(l => l.quality === '320kbps')
console.log('Download:', highQuality.url)
```

### Infinite Radio
```typescript
import { createSongStation, getSongSuggestions } from 'jiosaavn-api-client'

const stationId = await createSongStation('3IoDK8qI')

// Fetch suggestions repeatedly
for (let i = 0; i < 3; i++) {
  const { data: songs } = await getSongSuggestions('3IoDK8qI', 10)
  console.log(`Batch ${i + 1}:`, songs.map(s => s.title))
}
```

### Playlist to MP3 List
```typescript
import { getPlaylistByLink, createDownloadLinks } from 'jiosaavn-api-client'

const { data: playlist } = await getPlaylistByLink({
  link: 'https://www.jiosaavn.com/featured/indie/...',
  limit: 100
})

const songs = playlist.songs || []
const downloads = songs.map(song => ({
  title: song.name,
  artist: song.artists.primary.map(a => a.name).join(', '),
  url: createDownloadLinks(song.more_info.encrypted_media_url)
    .find(l => l.quality === '320kbps')?.url
}))

console.log(downloads)
```

## Platforms

| Runtime | Status | Notes |
|---------|--------|-------|
| **Node.js** | ✅ | All features |
| **Bun** | ✅ | All features |
| **Cloudflare Workers** | ✅ | All features |
| **Vercel Edge** | ✅ | All features |
| **Deno** | ✅ | Use `npm:` prefix |

### Cloudflare Worker Example
```typescript
export default {
  async fetch(request: Request) {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    
    if (!query) {
      return Response.json({ error: 'Missing query param: q' }, { status: 400 })
    }

    const { searchSongs } = await import('jiosaavn-api-client')
    const { data, ok, status } = await searchSongs({ query, limit: 5 })
    
    return Response.json({ success: ok, data }, { status })
  }
}
```

## Error Handling

All functions return `{ data, ok, status }`:
```typescript
import { searchSongs } from 'jiosaavn-api-client'

const { data, ok, status } = await searchSongs({ query: 'believer' })

if (!ok) {
  console.error(`Request failed with status ${status}`)
}

if (data.results.length === 0) {
  console.log('No results found')
}
```

### Common Issues

**"No results found"**
- Check query spelling
- Use simpler/shorter queries
- Try different search types

**"Token extraction failed"**
- Ensure URL is complete and properly formatted
- Verify it's a valid JioSaavn URL

**"Rate limited"**
- JioSaavn may throttle rapid requests
- Add delays between calls: `await new Promise(r => setTimeout(r, 1000))`

## Notes

- **Auto token extraction**: Links like `https://www.jiosaavn.com/song/title/TOKEN` automatically extract `TOKEN`
- **Decryption**: Audio URLs are decrypted on-demand using pure-JS DES-ECB (no Node.js crypto needed)
- **Pagination**: Use `page` (0-indexed) and `limit` for large result sets
- **Caching**: Cache decrypted URLs in your app to avoid redundant decryption
- **Rate limiting**: JioSaavn may throttle aggressive requests; use reasonable `limit` and `page` values
- **Bitrates**: Available qualities are `12kbps`, `48kbps`, `96kbps`, `160kbps`, `320kbps`

## License

MIT License © 2025 Kaushal Krishna

This project is licensed under the MIT License.  
You are free to use, modify, and distribute it, including for commercial purposes.

See the [LICENSE](./LICENSE) file for full details.

