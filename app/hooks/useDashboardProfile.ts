import { useState, useEffect } from 'react';
import { getTokenData } from '@/app/lib/auth';
import api from '@/app/lib/api';

export interface DashboardProfile {
  name: string;
  email: string;
  role: string | null;
  avatarUrl: string | null;
  ready: boolean;
}

/**
 * Hook for managing dashboard user/agency profile data
 */
export function useDashboardProfile() {
  const [profile, setProfile] = useState<DashboardProfile>({
    name: '',
    email: '',
    role: null,
    avatarUrl: null,
    ready: false,
  });

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        // Get entity ID from token
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          if (!cancelled) setProfile((prev) => ({ ...prev, ready: true }));
          return;
        }

        let entityId: string | null = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        if (!entityId) {
          try {
            const [, payload] = token.split('.');
            const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            if (json?.sub) {
              entityId = String(json.sub);
              if (typeof window !== 'undefined') {
                localStorage.setItem('userId', entityId);
              }
            }
          } catch {
            // ignore
          }
        }

        if (!entityId) {
          if (!cancelled) setProfile((prev) => ({ ...prev, ready: true }));
          return;
        }

        // Try user first, then agency
        interface FetchedUser {
          firstName?: string;
          lastName?: string;
          email?: string;
          role?: string;
          avatarUrl?: string;
          avatar?: string;
          imageUrl?: string;
          image?: string;
          profilePictureUrl?: string;
          profilePicture?: string;
        }

        interface FetchedAgency {
          companyName?: string | null;
          email?: string | null;
          profilePictureData?: string | null;
        }

        const fetchUser = async (): Promise<FetchedUser | null> => {
          try {
            const resUser = await api.get<FetchedUser>(`/user/retrieve/${entityId}`);
            const u = (resUser.data || {}) as FetchedUser;
            if (!cancelled) {
              if (u.firstName) setProfile((prev) => ({ ...prev, name: u.firstName || '' }));
              if (u.email) setProfile((prev) => ({ ...prev, email: u.email || '' }));
              if (u.role) setProfile((prev) => ({ ...prev, role: String(u.role) }));
              const avatar =
                u.avatarUrl ||
                u.avatar ||
                u.imageUrl ||
                u.image ||
                u.profilePictureUrl ||
                u.profilePicture;
              if (avatar && typeof avatar === 'string') {
                setProfile((prev) => ({ ...prev, avatarUrl: avatar }));
              }
            }
            return u;
          } catch {
            return null;
          }
        };

        const fetchAgency = async (): Promise<FetchedAgency | null> => {
          try {
            const resAgency = await api.get<FetchedAgency>(`/agency/retrieve/${entityId}`);
            const a = (resAgency.data || {}) as FetchedAgency;
            if (!cancelled) {
              if (a.companyName) setProfile((prev) => ({ ...prev, name: a.companyName || '' }));
              if (a.email) setProfile((prev) => ({ ...prev, email: a.email || '' }));
              setProfile((prev) => ({ ...prev, role: 'AGENCY' }));
              if (a.profilePictureData && typeof a.profilePictureData === 'string') {
                setProfile((prev) => ({
                  ...prev,
                  avatarUrl: `data:image/png;base64,${a.profilePictureData}`,
                }));
              }
            }
            return a;
          } catch {
            return null;
          }
        };

        // Try user first, fallback to agency
        let fetchedUser: FetchedUser | null = null;
        try {
          fetchedUser = await fetchUser();
        } catch {
          await fetchAgency();
        }

        // If user has AGENT role, also try to fetch agency
        if (fetchedUser?.role === 'AGENT') {
          await fetchAgency().catch(() => null);
        }

        if (!cancelled) {
          setProfile((prev) => ({ ...prev, ready: true }));
        }
      } catch (error) {
        console.warn('[useDashboardProfile] Failed to load profile', error);
        if (!cancelled) {
          setProfile((prev) => ({ ...prev, ready: true }));
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // Also check localStorage role
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('role');
      if (storedRole && !profile.role) {
        setProfile((prev) => ({ ...prev, role: storedRole }));
      }
    }
  }, [profile.role]);

  // Check token data for role
  useEffect(() => {
    try {
      const data = getTokenData();
      const role =
        data && typeof (data as Record<string, unknown>)['role'] === 'string'
          ? String((data as Record<string, unknown>)['role'])
          : null;
      if (role && !profile.role) {
        setProfile((prev) => ({ ...prev, role }));
      }
    } catch {
      // ignore
    }
  }, [profile.role]);

  return profile;
}
