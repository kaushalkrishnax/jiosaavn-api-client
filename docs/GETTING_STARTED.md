# Getting Started

## Installation

```bash
npm install jiosaavn-api-client
# or
bun add jiosaavn-api-client
# or
yarn add jiosaavn-api-client
```

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
  ids: "song-id-123",
  limit: 20,
});
if (!suggest.success) throw new Error(suggest.message);

suggest.data.forEach((song) => console.log(song.title));
```
