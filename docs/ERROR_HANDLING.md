# Error Handling Guide

JioSaavn API Client provides structured, modular error handling with 6 essential error codes and rich context for debugging.

## Core Concepts

- **Error Code**: Category (NETWORK_ERROR, API_ERROR, VALIDATION_ERROR, NOT_FOUND, etc.)
- **Context**: Specific details about what failed (`{ endpoint, id, link, status }`)
- **Message**: Human-readable explanation
- **Stack**: Full stack trace for debugging

## Error Codes (6 Essential)

```typescript
ErrorCode.NETWORK_ERROR          // Network/connectivity issues
ErrorCode.API_ERROR              // All API operation failures
ErrorCode.VALIDATION_ERROR       // Input validation failed
ErrorCode.NOT_FOUND              // Any resource not found
ErrorCode.DEPRECATED_METHOD_ERROR // Old/removed method
ErrorCode.UNKNOWN_ERROR          // Unclassified errors
```

## Basic Error Handling

### Check if operation succeeded

```typescript
const result = await client.getSongsById({ ids: ["123"] });

if (!result.success) {
  console.log(result.message); // Error message
  console.log(result.code);    // ErrorCode
} else {
  console.log(result.data);    // Song[]
}
```

### Type-safe error checking

```typescript
import { isJioSaavnError, hasErrorCode, ErrorCode } from "jiosaavn-api-client";

try {
  const result = await client.getAlbumById({ id: albumId });
} catch (error) {
  if (isJioSaavnError(error)) {
    console.log(error.code);    // ErrorCode
    console.log(error.message); // string
    console.log(error.context); // { albumId, ... }
    console.log(error.stack);   // Full stack trace
  }
}
```

### Handle specific error codes

```typescript
import { hasErrorCode, ErrorCode } from "jiosaavn-api-client";

try {
  const result = await client.getAlbumById({ id: albumId });
} catch (error) {
  if (hasErrorCode(error, ErrorCode.NOT_FOUND)) {
    console.log("Album not found");
  } else if (hasErrorCode(error, ErrorCode.NETWORK_ERROR)) {
    console.log("Network issue - can retry");
  } else if (hasErrorCode(error, ErrorCode.API_ERROR)) {
    console.log("API error - check context:", error.context);
  } else {
    console.log("Unknown error:", error);
  }
}
```

## Error Context

Context provides the real debugging information:

```typescript
{
  code: ErrorCode.NOT_FOUND,
  message: "Album not found or invalid data",
  context: {
    albumId: "123",
    endpoint: "albums.getDetails",
  },
  stack: "..."
}
```

Instead of 15+ granular codes, use context to determine what failed:

```typescript
if (error.code === ErrorCode.NOT_FOUND) {
  // Check context to see what wasn't found
  if (error.context?.songId) console.log("Song not found");
  if (error.context?.albumId) console.log("Album not found");
  if (error.context?.artistId) console.log("Artist not found");
}
```

## Logging Errors

Format errors consistently for logging:

```typescript
import { formatErrorForLogging } from "jiosaavn-api-client";

try {
  await client.searchSongs({ query: "test" });
} catch (error) {
  const formatted = formatErrorForLogging(error);
  logger.error("Search failed", formatted);
  // Output: { type, message, code, context, statusCode, stack }
}
```

## Error Factory Functions

Create errors with consistent structure:

```typescript
import { 
  createValidationError,
  createNotFoundError,
  createApiError,
} from "jiosaavn-api-client";

// Validation error
throw createValidationError("Invalid input", {
  field: "query",
  provided: userInput,
});

// Not found error
throw createNotFoundError("Song not found", ErrorCode.NOT_FOUND, {
  songId: "123",
});

// API error
throw createApiError("API failed", 500, originalError, {
  endpoint: "songs.getDetails",
});
```

## Retry Logic with Error Codes

```typescript
import { hasErrorCode, ErrorCode } from "jiosaavn-api-client";

async function fetchWithRetry(
  operation: () => Promise<any>,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      const isNetworkError = hasErrorCode(error, ErrorCode.NETWORK_ERROR);
      const shouldRetry = isNetworkError && i < maxRetries - 1;
      
      if (shouldRetry) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
}

// Usage
const result = await fetchWithRetry(
  () => client.getSongsById({ ids: ["123"] })
);
```

## Best Practices

1. **Always check result.success** in high-level client methods
2. **Use hasErrorCode()** for specific error handling
3. **Log using formatErrorForLogging()** for consistency
4. **Attach context** when creating errors to help debugging
5. **Preserve original errors** using wrapError() in catch blocks

## Error Classes

All errors extend `JioSaavnError`:

```typescript
class JioSaavnError extends Error {
  code: ErrorCode;
  message: string;
  originalError?: unknown;
  statusCode?: number;
  context?: Record<string, unknown>;
  
  toJSON(): Record<string, unknown>;
}

// Specific types
class ValidationError extends JioSaavnError { }
class NotFoundError extends JioSaavnError { }
class ApiError extends JioSaavnError { }
class NetworkError extends JioSaavnError { }
```

## See Also

- [API Reference](./API_REFERENCE.md)
- [Getting Started](./GETTING_STARTED.md)
- [Advanced Usage](./ADVANCED.md)
