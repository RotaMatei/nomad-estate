/**
 * Enhanced API client utilities
 * Provides helper functions for common API patterns with better error handling
 */

import api from '../api';
import { handleApiError, logError, ApiError } from './errors';

/**
 * Safe API call wrapper that returns null on error instead of throwing
 * Useful for non-critical operations where empty results are acceptable
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  defaultValue: T,
  context?: string,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    const apiError = handleApiError(error);
    logError(apiError, context);
    return defaultValue;
  }
}

/**
 * API call wrapper that throws standardized errors
 * Use when errors should be handled by the caller
 */
export async function apiCall<T>(
  apiCall: () => Promise<T>,
  context?: string,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    const apiError = handleApiError(error);
    logError(apiError, context);
    throw apiError;
  }
}

/**
 * Get array data from API, returning empty array on error
 */
export async function getArrayData<T>(
  apiCall: () => Promise<{ data: T[] }>,
  context?: string,
): Promise<T[]> {
  try {
    const response = await apiCall();
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    const apiError = handleApiError(error);
    logError(apiError, context);
    return [];
  }
}

/**
 * Boolean API call wrapper (returns true on success, false on error)
 */
export async function booleanApiCall(
  apiCall: () => Promise<unknown>,
  context?: string,
): Promise<boolean> {
  try {
    await apiCall();
    return true;
  } catch (error) {
    const apiError = handleApiError(error);
    logError(apiError, context);
    return false;
  }
}

// Re-export api instance for direct use when needed
export { api };
