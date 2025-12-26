# API Reference

## Client Methods

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
- `getSongByLink({ link })` - **Deprecated**: Use `getSongsById` instead
- `getSongSuggestions({ ids, limit? })` - Radio suggestions

### Album Functions

- `getAlbumById({ id })` - Full album with tracks
- `getAlbumByLink({ link })` - **Deprecated**: Use `getAlbumById` instead

### Artist Functions

- `getArtistById({ id, page?, songCount?, albumCount?, sortBy?, sortOrder? })`
- `getArtistByLink({ link, ...same })`
- `getArtistSongs({ id, page?, sortBy?, sortOrder? })`
- `getArtistAlbums({ id, page?, sortBy?, sortOrder? })`

### Playlist Functions

- `getPlaylistById({ id, page?, limit? })`
- `getPlaylistByLink({ link, page?, limit? })`

## Utility Functions

- Configure the default client used by convenience functions: `createClient({ baseUrl?, fetch?, timeoutMs? })`
- Low-level fetch: `fetchFromSaavn` via `jiosaavn-api-client/fetch`
- Helpers: `pickUserAgent`, `retry`, `delay`, `extractToken`, etc via `jiosaavn-api-client/utils`

## Response Types

### ApiResult

All high-level client methods return `ApiResult<T>`:

```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; code: ErrorCode };
```

### Pagination

```typescript
type Paginated<T> = {
  total: number;
  page: number;
  limit: number;
  results: T[];
};
```

### Images & Downloads

```typescript
type ImageSource = { resolution: string; url: string };
type DownloadLink = { bitrate: string; url: string };
```

## Entity Types

### Song

```typescript
type Song = {
  id: string;
  title: string;
  entityType: "song";
  releaseYear?: number;
  releaseDateISO?: string;
  durationSeconds?: number;
  label?: string;
  isExplicit: boolean;
  playCount?: number;
  language: string;
  hasLyrics: boolean;
  lyricsId?: string;
  url: string;
  album: {
    id?: string;
    title?: string;
    url?: string;
  };
  artists: ArtistsGroup;
  images: ImageSource[];
  downloadLinks: DownloadLink[];
};
```

### Album

```typescript
type Album = {
  id: string;
  title: string;
  description?: string;
  releaseYear?: number;
  entityType: "album";
  playCount?: number;
  language: string;
  isExplicit: boolean;
  artists: ArtistsGroup;
  songCount?: number;
  url: string;
  images: ImageSource[];
  songs?: SongPreview[];
};
```

### Artist

```typescript
type Artist = {
  id: string;
  name: string;
  url: string;
  entityType: "artist";
  images: ImageSource[];
  followerCount?: number;
  fanCount?: number;
  isVerified?: boolean;
  primaryLanguage?: string;
  primaryContentType?: string;
  dateOfBirthISO?: string;
  hasRadio?: boolean;
  availableLanguages: string[];
  topSongs?: SongPreview[];
  topAlbums?: AlbumPreview[];
  singles?: SongPreview[];
  similarArtists?: ArtistPreview[];
};
```

### Playlist

```typescript
type Playlist = {
  id: string;
  title: string;
  description?: string;
  releaseYear?: number;
  entityType: "playlist";
  playCount?: number;
  language: string;
  isExplicit: boolean;
  songCount?: number;
  url: string;
  images: ImageSource[];
  songs?: SongPreview[];
  artists?: ArtistPreview[];
};
```

### ArtistsGroup

```typescript
type ArtistsGroup = {
  primary: ArtistPreview[];
  featured?: ArtistPreview[];
  all?: ArtistPreview[];
};
```
