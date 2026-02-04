import { AxiosError } from 'axios';
import {
  ApiError,
  NetworkError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  ServerError,
  handleApiError,
} from '../errors';

describe('API Error Handling', () => {
  describe('handleApiError', () => {
    it('should convert 400 to ValidationError', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Invalid input' },
        },
        message: 'Bad Request',
      } as AxiosError;

      const error = handleApiError(axiosError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
    });

    it('should convert 401 to UnauthorizedError', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
        message: 'Unauthorized',
      } as AxiosError;

      const error = handleApiError(axiosError);
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.statusCode).toBe(401);
    });

    it('should convert 404 to NotFoundError', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
        message: 'Not Found',
      } as AxiosError;

      const error = handleApiError(axiosError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.statusCode).toBe(404);
    });

    it('should convert 500 to ServerError', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
        message: 'Internal Server Error',
      } as AxiosError;

      const error = handleApiError(axiosError);
      expect(error).toBeInstanceOf(ServerError);
      expect(error.statusCode).toBe(500);
    });

    it('should convert network error to NetworkError', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Network Error',
        response: undefined,
      } as AxiosError;

      const error = handleApiError(axiosError);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.statusCode).toBeUndefined();
    });

    it('should handle unknown error types', () => {
      const unknownError = new Error('Something went wrong');
      const error = handleApiError(unknownError);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe('Something went wrong');
    });

    it('should return ApiError instance if already an ApiError', () => {
      const apiError = new ValidationError('Test error');
      const result = handleApiError(apiError);
      expect(result).toBe(apiError);
    });
  });
});
