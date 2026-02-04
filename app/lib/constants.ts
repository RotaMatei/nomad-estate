/**
 * Application constants
 * Centralized magic strings and numbers
 */

export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER_ID: 'userId',
  USER_NAME: 'user',
  ROLE: 'role',
  JTI: 'jti',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROPERTIES: '/properties',
  ABOUT: '/about',
  PLANS: '/plans',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    USER_LOGIN: '/auth/user/login',
    USER_REGISTER: '/auth/user/register',
    AGENCY_LOGIN: '/auth/agency/login',
    AGENCY_REGISTER: '/auth/agency/register',
    REFRESH: '/api/refresh',
  },
  USER: {
    RETRIEVE: '/user/retrieve',
    SEARCH: '/user/search',
  },
  AGENCY: {
    RETRIEVE: '/agency/retrieve',
  },
  PROPERTY: {
    CREATE: '/property/create',
    UPDATE: '/property/update',
    RETRIEVE: '/property/retrieve',
    DELETE: '/property/delete',
    PORTFOLIO: '/property/portfolio',
  },
  LOCATION: {
    COUNTRIES: '/countries/retrieve/get-all',
    STATES: '/states/retrieve/get-all',
    CITIES: '/cities/retrieve/get-all',
  },
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_SEARCH_QUERY_LENGTH: 2,
  MAX_SEARCH_QUERY_LENGTH: 100,
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 200,
  DEFAULT_OFFSET: 0,
} as const;
