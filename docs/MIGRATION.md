# Migration Guide

## v2.0.0 Breaking Changes

### Response Structure

**Before (v1):**
- Functions threw errors on API failures
- Unstructured error messages

**After (v2):**
```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; code: ErrorCode };

const result = await client.getSongsById({ ids: ["123"] });
if (!result.success) {
  console.log(result.code); // ErrorCode
  console.log(result.message);
} else {
  console.log(result.data);
}
```

### Model Normalization

**Images:**
```typescript
// Before
const image = song.image; // string

// After
const images = song.images; // ImageSource[]
images.forEach(img => {
  console.log(img.resolution); // "50x50", "150x150", "500x500"
  console.log(img.url);
});
```

**Download Links:**
```typescript
// Before
const encrypted = song.encrypted_media_url; // string (encrypted)

// After
const links = song.downloadLinks; // DownloadLink[] (pre-decrypted)
links.forEach(link => {
  console.log(link.bitrate); // "12kbps", "48kbps", etc.
  console.log(link.url); // Ready to use
});
```

### Boolean Normalization

```typescript
// Before
const explicit = song.explicit_content; // 1 or 0
const hasRadio = artist.isRadioPresent; // Any truthy value

// After
const isExplicit = song.isExplicit; // boolean
const hasRadio = artist.hasRadio; // boolean
```

### Entity Type

```typescript
// Before
const type = song.type; // "song"

// After
const entityType = song.entityType; // "song"
```

### Pagination

```typescript
// Before
const results = await client.searchSongs({ query: "test" });
const songs = results; // Direct array

// After
type Paginated<T> = {
  total: number;
  page: number;
  limit: number;
  results: T[];
};

const result = await client.searchSongs({ query: "test" });
if (result.success) {
  console.log(result.data.total);
  console.log(result.data.results);
}
```

### Client Creation

**Before (Global state):**
```typescript
import * as jiosaavn from "jiosaavn-api-client";
// Uses global shared state
const songs = await jiosaavn.searchSongs({ query: "test" });
```

**After (Instance-based):**
```typescript
import { JioSaavnClient } from "jiosaavn-api-client";

// Create instance with config
const client = new JioSaavnClient({
  baseUrl: "https://...",
  timeoutMs: 5000,
});

const songs = await client.searchSongs({ query: "test" });

// Or configure default client for convenience functions
import { createClient } from "jiosaavn-api-client";
createClient({ baseUrl: "https://..." });

const songs = await searchSongs({ query: "test" });
```

## Deprecated Methods

These methods don't work and will be removed in future versions:

- `getSongByLink()` → Use `getSongsById()` instead
- `getAlbumByLink()` → Use `getAlbumById()` instead  
- `getArtistByLink()` → Use `getArtistById()` instead
- `getPlaylistByLink()` → Use `getPlaylistById()` instead
