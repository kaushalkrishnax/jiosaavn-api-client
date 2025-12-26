# Advanced Usage

## Custom User Agents

```typescript
import { fetchFromSaavn } from "jiosaavn-api-client/fetch";

const response = await fetchFromSaavn({
  endpoint: "song.getDetails",
  params: { pids: "song-id" },
  userAgents: ["Custom UA 1", "Custom UA 2"],
});
```

## Android Context

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

## Direct API Access

```typescript
import { fetchFromSaavn } from "jiosaavn-api-client/fetch";

const response = await fetchFromSaavn({
  endpoint: "song.getDetails",
  params: { pids: "song-id" },
  context: "web6dot0",
  headers: { "X-Custom": "header" },
});
```

## Utility Helper Functions

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

## Rate Limiting

The client supports User-Agent rotation to reduce the risk of request throttling:

```typescript
const client = new JioSaavnClient();
// Client automatically rotates user agents
```

This does not guarantee immunity from upstream rate limits. If you hit rate limits:

- Consider adding delays between requests
- Use Android context for some endpoints if web context fails
- Implement custom backoff logic

## Pagination

- Default `page` is 0 (first page)
- Default `limit` is 10 results per page
- Check `total` in `Paginated<T>` to know total available results

```typescript
const result = await client.searchSongs({
  query: "test",
  page: 0,
  limit: 20,
});

if (result.success) {
  console.log(result.data.total); // Total available results
  console.log(result.data.results.length); // This page's results
}
```

## Image & Download URLs

Images in different qualities:

```typescript
song.images.forEach((img) => {
  console.log(img.resolution); // "50x50", "150x150", "500x500"
  console.log(img.url);
});
```

Audio downloads in bitrates:

```typescript
song.downloadLinks.forEach((link) => {
  console.log(link.bitrate); // "12kbps", "48kbps", "96kbps", "160kbps", "320kbps"
  console.log(link.url);
});
```

Download URLs are decrypted automatically using DES-ECB.

## Error Handling

See [ERROR_HANDLING.md](../ERROR_HANDLING_QUICK_REFERENCE.md) for detailed error handling patterns.

Quick summary:

```typescript
try {
  const result = await client.getSongsById({ ids: ["123"] });
  if (!result.success) {
    // Expected API failure
    console.log(result.code); // ErrorCode
    console.log(result.message);
  } else {
    // Success
    console.log(result.data);
  }
} catch (error) {
  // Unexpected errors (network, JSON parse, etc)
  throw error;
}
```
