import { json } from "@remix-run/node";
import { checkDatabaseHealth } from "../db.server";

export interface DatabaseError {
  code: string;
  message: string;
  isConnectionError: boolean;
  retryable: boolean;
}

export const parseDatabaseError = (error: any): DatabaseError => {
  const errorMessage = error?.message || "Unknown database error";

  return {
    code: error?.code || "UNKNOWN_ERROR",
    message: errorMessage,
    isConnectionError:
      errorMessage.includes("Can't reach database server") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("ECONNREFUSED") ||
      errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("connection pool") ||
      errorMessage.includes("connection timeout"),
    retryable:
      errorMessage.includes("Can't reach database server") ||
      errorMessage.includes("connection") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("ECONNREFUSED") ||
      errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("connection pool") ||
      errorMessage.includes("connection timeout") ||
      error?.code === "P1001" || // Can't reach database server
      error?.code === "P1008" || // Operations timed out
      error?.code === "P1017",   // Server has closed the connection
  };
};

export const handleDatabaseError = async (
  error: any,
  context: string = "Database operation"
): Promise<Response> => {
  const dbError = parseDatabaseError(error);

  console.error(`${context} failed:`, {
    error: dbError,
    originalError: error,
    timestamp: new Date().toISOString(),
  });

  // Check if database is currently healthy
  const isHealthy = await checkDatabaseHealth();

  if (dbError.isConnectionError && !isHealthy) {
    // Database is down, return service unavailable
    return json({
      error: "Service temporarily unavailable",
      message: "Database connection is currently unavailable. Please try again in a few moments.",
      code: "DATABASE_UNAVAILABLE",
      retryable: true,
      retryAfter: 30, // seconds
    }, {
      status: 503,
      headers: {
        "Retry-After": "30",
        "Cache-Control": "no-cache",
      },
    });
  }

  if (dbError.retryable) {
    // Temporary error that can be retried
    return json({
      error: "Temporary database error",
      message: "A temporary database error occurred. Please try again.",
      code: "DATABASE_TEMPORARY_ERROR",
      retryable: true,
    }, {
      status: 503,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  // Permanent error
  return json({
    error: "Database error",
    message: "An unexpected database error occurred.",
    code: "DATABASE_ERROR",
    retryable: false,
  }, {
    status: 500,
    headers: {
      "Cache-Control": "no-cache",
    },
  });
};

export const withDatabaseErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string = "Database operation"
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const dbError = parseDatabaseError(error);

      if (dbError.isConnectionError) {
        console.warn(`${context} - Connection error detected, operation may be retried:`, dbError.message);
        throw error; // Re-throw to allow retry logic to handle it
      }

      console.error(`${context} - Non-retryable error:`, dbError);
      throw error;
    }
  };
};