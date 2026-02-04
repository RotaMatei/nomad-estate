import { AxiosError } from 'axios';

/**
 * Standardized API error types
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public responseData?: unknown,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network error. Please check your connection.', originalError?: unknown) {
    super(message, undefined, undefined, originalError);
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized. Please log in again.', responseData?: unknown) {
    super(message, 401, responseData);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found.', responseData?: unknown) {
    super(message, 404, responseData);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation error.', responseData?: unknown) {
    super(message, 400, responseData);
    this.name = 'ValidationError';
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Server error. Please try again later.', responseData?: unknown) {
    super(message, 500, responseData);
    this.name = 'ServerError';
  }
}

/**
 * Extract error message from Axios error response
 */
function extractErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data;
    // Try common error message fields
    if (typeof data === 'object' && data !== null) {
      const obj = data as Record<string, unknown>;
      if (typeof obj.message === 'string') return obj.message;
      if (typeof obj.error === 'string') return obj.error;
      if (Array.isArray(obj.message) && obj.message.length > 0) {
        return String(obj.message[0]);
      }
    }
    if (typeof data === 'string') return data;
  }
  return error.message || 'An unexpected error occurred';
}

/**
 * Convert Axios error to standardized ApiError
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  // Check if it's an AxiosError (check for isAxiosError property or response property)
  const isAxiosError =
    (error instanceof Error && 'isAxiosError' in error && (error as AxiosError).isAxiosError) ||
    (error && typeof error === 'object' && 'isAxiosError' in error && (error as AxiosError).isAxiosError) ||
    (error && typeof error === 'object' && 'response' in error);

  if (isAxiosError) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const message = extractErrorMessage(axiosError);

    if (!status) {
      // Network error (no response)
      return new NetworkError(message, axiosError);
    }

    switch (status) {
      case 400:
        return new ValidationError(message, axiosError.response?.data);
      case 401:
        return new UnauthorizedError(message, axiosError.response?.data);
      case 404:
        return new NotFoundError(message, axiosError.response?.data);
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message, axiosError.response?.data);
      default:
        return new ApiError(message, status, axiosError.response?.data, axiosError);
    }
  }

  // Unknown error type
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return new ApiError(message, undefined, undefined, error);
}

/**
 * Log error for debugging (only in development)
 */
export function logError(error: ApiError, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    const prefix = context ? `[${context}]` : '[API]';
    console.error(`${prefix} ${error.name}:`, error.message);
    if (error.statusCode) {
      console.error(`${prefix} Status:`, error.statusCode);
    }
    if (error.responseData) {
      console.error(`${prefix} Response:`, error.responseData);
    }
    if (error.originalError) {
      console.error(`${prefix} Original:`, error.originalError);
    }
  }
}
