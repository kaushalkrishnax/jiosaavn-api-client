/**
 * Error handling infrastructure for JioSaavn API Client
 * Provides structured error types, error codes, and error utilities
 * @module errors
 * @internal
 */

/**
 * Centralized error code registry
 * Closed set of error codes for type safety and autocomplete
 */
export const enum ErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
  API_ERROR = "API_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  INVALID_URL = "INVALID_URL",
  INVALID_RESPONSE = "INVALID_RESPONSE",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  SONG_NOT_FOUND = "SONG_NOT_FOUND",
  ALBUM_NOT_FOUND = "ALBUM_NOT_FOUND",
  ARTIST_NOT_FOUND = "ARTIST_NOT_FOUND",
  PLAYLIST_NOT_FOUND = "PLAYLIST_NOT_FOUND",
  SEARCH_ERROR = "SEARCH_ERROR",
  SEARCH_SONGS_ERROR = "SEARCH_SONGS_ERROR",
  SEARCH_ALBUMS_ERROR = "SEARCH_ALBUMS_ERROR",
  SEARCH_ARTISTS_ERROR = "SEARCH_ARTISTS_ERROR",
  SEARCH_PLAYLISTS_ERROR = "SEARCH_PLAYLISTS_ERROR",
  GET_SONGS_ERROR = "GET_SONGS_ERROR",
  GET_SONG_LINK_ERROR = "GET_SONG_LINK_ERROR",
  GET_SUGGESTIONS_ERROR = "GET_SUGGESTIONS_ERROR",
  GET_ALBUM_ERROR = "GET_ALBUM_ERROR",
  GET_ALBUM_LINK_ERROR = "GET_ALBUM_LINK_ERROR",
  GET_ARTIST_ERROR = "GET_ARTIST_ERROR",
  GET_ARTIST_LINK_ERROR = "GET_ARTIST_LINK_ERROR",
  GET_ARTIST_SONGS_ERROR = "GET_ARTIST_SONGS_ERROR",
  GET_ARTIST_ALBUMS_ERROR = "GET_ARTIST_ALBUMS_ERROR",
  GET_PLAYLIST_ERROR = "GET_PLAYLIST_ERROR",
  GET_PLAYLIST_LINK_ERROR = "GET_PLAYLIST_LINK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Base error class for all JioSaavn API errors
 * Preserves original error context while providing structured information
 */
export class JioSaavnError extends Error {
  public readonly code: ErrorCode;
  public readonly originalError?: unknown;
  public readonly statusCode?: number;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    options?: {
      originalError?: unknown;
      statusCode?: number;
      context?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.name = "JioSaavnError";
    this.code = code;
    this.originalError = options?.originalError;
    this.statusCode = options?.statusCode;
    this.context = options?.context;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JioSaavnError);
    }
  }

  /**
   * Convert error to JSON-serializable format
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Network-related error (fetch failed, timeout, etc.)
 */
export class NetworkError extends JioSaavnError {
  constructor(message: string, originalError?: unknown) {
    super(message, ErrorCode.NETWORK_ERROR, { originalError });
    this.name = "NetworkError";
  }
}

/**
 * API returned an error response
 */
export class ApiError extends JioSaavnError {
  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message, ErrorCode.API_ERROR, { originalError, statusCode });
    this.name = "ApiError";
  }
}

/**
 * Invalid or malformed data from API
 */
export class ValidationError extends JioSaavnError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.VALIDATION_ERROR, { context });
    this.name = "ValidationError";
  }
}

/**
 * Resource not found (404-like errors)
 */
export class NotFoundError extends JioSaavnError {
  constructor(message: string, code: ErrorCode = ErrorCode.NOT_FOUND) {
    super(message, code);
    this.name = "NotFoundError";
  }
}

/**
 * Normalize any error into a consistent format
 *
 * @param error - Unknown error value from catch block
 * @returns Structured error information
 */
export function normalizeError(error: unknown): {
  message: string;
  originalError: unknown;
} {
  if (typeof error === "string") {
    return { message: error, originalError: error };
  }

  if (error instanceof Error) {
    return { message: error.message, originalError: error };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string"
  ) {
    return { message: (error as any).message, originalError: error };
  }

  if (typeof error === "object" && error !== null) {
    try {
      return {
        message: JSON.stringify(error),
        originalError: error,
      };
    } catch {
      return {
        message: "Unknown error object (failed to serialize)",
        originalError: error,
      };
    }
  }

  return {
    message: String(error || "Unknown error"),
    originalError: error,
  };
}

/**
 * Create a structured error from an unknown error
 *
 * @param error - Unknown error from catch block
 * @param code - Error code to assign
 * @param context - Additional context
 * @returns JioSaavnError instance
 */
export function createError(
  error: unknown,
  code: ErrorCode,
  context?: Record<string, unknown>
): JioSaavnError {
  const normalized = normalizeError(error);

  if (error instanceof JioSaavnError) {
    return new JioSaavnError(error.message, code, {
      originalError: error.originalError || error,
      statusCode: error.statusCode,
      context: { ...error.context, ...context },
    });
  }

  return new JioSaavnError(normalized.message, code, {
    originalError: normalized.originalError,
    context,
  });
}

/**
 * Type guard to check if an error is a JioSaavn error
 *
 * @param error - Unknown error value
 * @returns True if error is instance of JioSaavnError
 */
export function isJioSaavnError(error: unknown): error is JioSaavnError {
  return error instanceof JioSaavnError;
}

/**
 * Check if an error has a specific error code
 *
 * @param error - Unknown error value
 * @param code - Error code to check for
 * @returns True if error is JioSaavnError with matching code
 */
export function hasErrorCode(error: unknown, code: ErrorCode): boolean {
  return isJioSaavnError(error) && error.code === code;
}
