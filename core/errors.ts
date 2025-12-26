/**
 * Error handling infrastructure for JioSaavn API Client
 * Provides structured error types, error codes, and error utilities
 *
 * @module errors
 * @internal
 *
 * ## Architecture
 *
 * This module provides a centralized, modular, and consistent error handling system with:
 *
 * 1. **Structured Error Types**: Type-safe error classes (JioSaavnError, ValidationError, etc.)
 * 2. **Error Codes**: Closed set of error codes for autocomplete and type safety
 * 3. **Factory Functions**: Centralized error creation functions for consistency
 * 4. **Error Wrapping**: Utilities to wrap and normalize unknown errors
 * 5. **Context Enrichment**: Add debugging context to errors at any point
 * 6. **Logging Support**: Format errors consistently for logging systems
 *
 * ## Usage Patterns
 *
 * ### Creating Errors
 *
 * ```typescript
 * // Use factory functions for consistent error creation
 * throw createValidationError("Invalid input", { field: "userId" });
 * throw createNotFoundError("Song not found", ErrorCode.SONG_NOT_FOUND);
 * throw createApiError("API failed", 500, originalError);
 * ```
 *
 * ### Catching and Wrapping Errors
 *
 * ```typescript
 * try {
 *   await someOperation();
 * } catch (error) {
 *   // Wrap any error into a JioSaavnError with appropriate code
 *   throw wrapError(error, ErrorCode.GET_SONGS_ERROR, { songId: id });
 * }
 * ```
 *
 * ### Enriching Errors with Context
 *
 * ```typescript
 * try {
 *   await fetchData();
 * } catch (error) {
 *   if (error instanceof JioSaavnError) {
 *     throw enrichErrorContext(error, { endpoint, params });
 *   }
 *   throw error;
 * }
 * ```
 *
 * ### Logging Errors
 *
 * ```typescript
 * catch (error) {
 *   console.error(formatErrorForLogging(error));
 * }
 * ```
 *
 * ## Benefits
 *
 * - **No Redundancy**: Single source of truth for error creation
 * - **Consistent Behavior**: All errors have same structure and properties
 * - **Better Debugging**: Rich context and stack traces preserved
 * - **Type Safety**: Error codes are enum-based for autocomplete
 * - **Easier Testing**: Predictable error shapes and factory functions
 */

/**
 * Centralized error code registry
 * Minimal set of error codes - context is attached for specificity
 * Simplicity > Granularity (Saavn doesn't respect semantics anyway)
 */
export const enum ErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
  API_ERROR = "API_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  DEPRECATED_METHOD_ERROR = "DEPRECATED_METHOD_ERROR",
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
    },
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
  context?: Record<string, unknown>,
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

/**
 * Centralized error factory functions for consistent error creation
 * These ensure proper error codes, messages, and context are always set
 */

/**
 * Create a network-related error (fetch failures, timeouts, etc.)
 */
export function createNetworkError(
  message: string,
  originalError?: unknown,
  context?: Record<string, unknown>,
): NetworkError {
  return new NetworkError(message, originalError);
}

/**
 * Create an API error (API returned error response)
 */
export function createApiError(
  message: string,
  statusCode?: number,
  originalError?: unknown,
  context?: Record<string, unknown>,
): ApiError {
  return new ApiError(message, statusCode, originalError);
}

/**
 * Create a validation error (invalid or malformed data)
 */
export function createValidationError(
  message: string,
  context?: Record<string, unknown>,
): ValidationError {
  return new ValidationError(message, context);
}

/**
 * Create a not found error (resource not found)
 */
export function createNotFoundError(
  message: string,
  code: ErrorCode = ErrorCode.NOT_FOUND,
  context?: Record<string, unknown>,
): NotFoundError {
  return new NotFoundError(message, code);
}

/**
 * Create a generic JioSaavn error
 */
export function createJioSaavnError(
  message: string,
  code: ErrorCode,
  options?: {
    originalError?: unknown;
    statusCode?: number;
    context?: Record<string, unknown>;
  },
): JioSaavnError {
  return new JioSaavnError(message, code, options);
}

/**
 * Wrap any error into a JioSaavnError with appropriate error code
 * This is the primary function to use in catch blocks
 *
 * @param error - Unknown error from catch block
 * @param code - Error code to assign
 * @param context - Additional debugging context
 * @returns Properly typed JioSaavnError
 */
export function wrapError(
  error: unknown,
  code: ErrorCode,
  context?: Record<string, unknown>,
): JioSaavnError {
  // If already a JioSaavnError, preserve it but update code if needed
  if (error instanceof JioSaavnError) {
    if (error.code === code && !context) {
      return error;
    }
    return new JioSaavnError(error.message, code, {
      originalError: error.originalError || error,
      statusCode: error.statusCode,
      context: { ...error.context, ...context },
    });
  }

  // For NotFoundError, preserve the specific type
  if (error instanceof NotFoundError) {
    return createNotFoundError(error.message, code, context);
  }

  // For ValidationError, preserve the specific type
  if (error instanceof ValidationError) {
    return createValidationError(error.message, {
      ...error.context,
      ...context,
    });
  }

  // For all other errors, normalize and wrap
  const normalized = normalizeError(error);
  return new JioSaavnError(normalized.message, code, {
    originalError: normalized.originalError,
    context,
  });
}

/**
 * Enrich an error with additional debugging context
 *
 * @param error - Error to enrich
 * @param context - Additional context to add
 * @returns New error with enriched context
 */
export function enrichErrorContext(
  error: JioSaavnError,
  context: Record<string, unknown>,
): JioSaavnError {
  return new JioSaavnError(error.message, error.code, {
    originalError: error.originalError,
    statusCode: error.statusCode,
    context: { ...error.context, ...context },
  });
}

/**
 * Format error for logging with consistent structure
 *
 * @param error - Error to format
 * @returns Formatted error object suitable for logging
 */
export function formatErrorForLogging(error: unknown): Record<string, unknown> {
  if (error instanceof JioSaavnError) {
    return {
      type: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      context: error.context,
      stack: error.stack,
    };
  }

  const normalized = normalizeError(error);
  return {
    type: "UnknownError",
    message: normalized.message,
    originalError: normalized.originalError,
  };
}
