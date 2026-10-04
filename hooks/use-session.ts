'use client';

import * as React from 'react';
import { tokenStorage } from '@/app/lib/auth/tokenStorage';
import { TokenService } from '@/app/lib/auth/tokenService';
import api from '@/app/lib/api';

export interface Session {
  id: string;
  name: string | null;
  role: string | null;
  isAgency: boolean;
}

const EVENT = 'nomad:session-change';

function readSession(): Session | null {
  const token = tokenStorage.getToken();
  if (!token) return null;
  const payload = TokenService.decode(token);
  if (!payload) return null;
  const id = (payload.sub || payload.id || payload.agencyId || payload.userId || tokenStorage.getUserId()) as
    | string
    | undefined;
  if (!id) return null;
  let storedRole: string | null = null;
  try {
    storedRole = localStorage.getItem('role');
  } catch {}
  const role = storedRole ?? (typeof payload.role === 'string' ? payload.role : null);
  return {
    id: String(id),
    name: tokenStorage.getUserName() ?? null,
    role,
    isAgency: !!role && /agent|agency/i.test(role),
  };
}

// Cache the snapshot so useSyncExternalStore gets a stable reference between changes.
let cachedKey = '';
let cached: Session | null = null;
function getSnapshot(): Session | null {
  const next = readSession();
  const key = next ? `${next.id}|${next.name}|${next.role}` : '';
  if (key !== cachedKey) {
    cachedKey = key;
    cached = next;
  }
  return cached;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT, callback);
  };
}

/** Notify all components that login state changed (call after login / logout). */
export function notifySessionChange() {
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Non-redirecting session hook for chrome (header, menus).
 * Pages that require auth should keep using `useAuth` (redirects to /login).
 */
export function useSession() {
  const session = React.useSyncExternalStore(subscribe, getSnapshot, () => null);

  const signOut = React.useCallback(async () => {
    const current = readSession();
    try {
      const jti = localStorage.getItem('jti');
      if (jti && current) {
        await api.post(current.isAgency ? '/auth/agency/logout' : '/auth/user/logout', { jti });
      }
    } catch {
      // Logging out locally is enough if the server call fails.
    } finally {
      tokenStorage.clearAll();
      try {
        localStorage.removeItem('role');
        localStorage.removeItem('jti');
      } catch {}
      notifySessionChange();
    }
  }, []);

  return { session, signOut };
}
