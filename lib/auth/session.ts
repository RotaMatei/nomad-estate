'use client';

import { jwtDecode } from 'jwt-decode';
import api from '@/app/lib/api';
import { tokenStorage } from '@/app/lib/auth/tokenStorage';
import { notifySessionChange } from '@/hooks/use-session';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  RefreshJTI?: string;
  sub?: string;
  firstName?: string;
  lastName?: string;
}

export type AccountKind = 'user' | 'agency';

/** Stores tokens the way `app/lib/api.ts` (refresh interceptor) and `useSession` expect them. */
export function persistSession(data: AuthResponse, kind: AccountKind, name?: string) {
  tokenStorage.setToken(data.accessToken);
  tokenStorage.setRefreshToken(data.refreshToken);
  let sub = data.sub;
  if (!sub) {
    try {
      sub = jwtDecode<{ sub?: string }>(data.accessToken).sub;
    } catch {}
  }
  if (sub) tokenStorage.setUserId(sub);
  const fullName = name ?? [data.firstName, data.lastName].filter(Boolean).join(' ');
  if (fullName) tokenStorage.setUserName(fullName);
  try {
    if (data.RefreshJTI) localStorage.setItem('jti', data.RefreshJTI);
    localStorage.setItem('role', kind === 'agency' ? 'AGENCY' : 'INVESTOR');
  } catch {}
  notifySessionChange();
}

/** `app/lib/api.ts` rejects with `ApiError` (`statusCode`), plain axios errors carry `response.status`: accept both. */
export const errorStatus = (e: unknown): number | undefined => {
  const err = e as { statusCode?: number; response?: { status?: number } } | null;
  return err?.statusCode ?? err?.response?.status;
};

export function errorMessage(e: unknown, fallback: string) {
  const err = e as { statusCode?: number; message?: string; response?: { data?: { message?: string | string[] } } } | null;
  const data = err?.response?.data;
  const message = Array.isArray(data?.message) ? data.message.join('. ') : (data?.message ?? (err?.statusCode ? err.message : undefined));
  return typeof message === 'string' && message.length < 200 ? message : fallback;
}

/** One sign-in form for both account types: investor accounts are tried first, then agencies. */
export async function signIn(email: string, password: string): Promise<AccountKind> {
  try {
    const { data } = await api.post<AuthResponse>('/auth/user/login', { email, password });
    persistSession(data, 'user');
    return 'user';
  } catch (userError) {
    const status = errorStatus(userError);
    if (status === 429 || (status != null && status >= 500)) throw userError;
    const { data } = await api.post<AuthResponse>('/auth/agency/login', { email, password });
    persistSession(data, 'agency');
    return 'agency';
  }
}

export async function changePassword(kind: AccountKind, id: string, oldPassword: string, newPassword: string) {
  // The user DTO also expects `userId` in the body; the agency DTO takes the id from the path only.
  const body = kind === 'user' ? { userId: id, oldPassword, newPassword } : { oldPassword, newPassword };
  await api.patch(`/auth/${kind}/change-password/${id}`, body);
}

/** Email links carry `?token=`; the same link format is used for investors and agencies. */
export async function confirmEmail(token: string): Promise<AccountKind> {
  const config = { headers: { 'Content-Type': 'application/json' } };
  try {
    await api.post('/auth/user/confirm', token, config);
    return 'user';
  } catch {
    await api.post('/auth/agency/confirm', token, config);
    return 'agency';
  }
}

/** The API answers the same way whether or not the address has an account. Rust API only: Nest mails a placeholder link. */
export async function requestPasswordReset(email: string) {
  await api.post('/mail/send-reset', { email });
}

export async function resetPassword(token: string, newPassword: string) {
  await api.post('/auth/reset-password', { token, newPassword });
}

/** Mails the signed-in account a new confirmation link. */
export async function sendVerificationEmail() {
  await api.post('/mail/send-verify', {});
}

export async function googleSignInUrl() {
  const { data } = await api.get<{ url: string }>('/oauth/user/google');
  return data.url;
}
