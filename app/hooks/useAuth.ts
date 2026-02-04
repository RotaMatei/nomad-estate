import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import axios from 'axios';
import { tokenStorage } from '@/app/lib/auth/tokenStorage';

export interface UnifiedProfile {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role?: string | null; // user only
  companyName?: string | null; // agency only
  companyType?: string | null; // agency only
  licenseNumber?: string | null; // agency only
  companyWebsite?: string | null; // agency only
  isAgency: boolean;
}

/**
 * useAuth
 * Ensures a token is present or redirects to /login.
 * Provides a unified profile (user or agency). Tries user endpoint first; on 4XX falls back to agency.
 */
export function useAuth() {
  const router = useRouter();
  const [profile, setProfile] = useState<UnifiedProfile | null>(null);

  useEffect(() => {
    const token = tokenStorage.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        let subjectId = tokenStorage.getUserId();
        if (!subjectId) {
          try {
            const [, payload] = token.split('.');
            const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            if (json?.sub) {
              subjectId = String(json.sub);
              tokenStorage.setUserId(subjectId);
            }
          } catch {}
        }
        if (!subjectId) return;
        const headers = { Authorization: `Bearer ${token}` };
        let isAgency = false;
        let data: Record<string, unknown> | null = null;
        // Try agency first; if not found/4xx, fallback to user
        try {
          const agencyRes = await api.get(`/agency/retrieve/${subjectId}`, { headers });
          data = agencyRes.data || {};
          isAgency = true;
        } catch (agencyErr) {
          const status = axios.isAxiosError(agencyErr) ? agencyErr.response?.status : undefined;
          if (status && status >= 400) {
            try {
              const userRes = await api.get(`/user/retrieve/${subjectId}`, { headers });
              data = userRes.data || {};
              isAgency = false;
            } catch {
              return; // give up; keep profile null
            }
          } else {
            return; // non-HTTP error or network; do nothing
          }
        }
        if (cancelled || !data) return;
        const unified: UnifiedProfile = {
          firstName: typeof data.firstName === 'string' ? data.firstName : null,
          lastName: typeof data.lastName === 'string' ? data.lastName : null,
          email: typeof data.email === 'string' ? data.email : null,
          role: !isAgency && typeof data.role === 'string' ? data.role : null,
          companyName: isAgency && typeof data.companyName === 'string' ? data.companyName : null,
          companyType: isAgency && typeof data.companyType === 'string' ? data.companyType : null,
          licenseNumber: isAgency && typeof data.licenseNumber === 'string' ? data.licenseNumber : null,
          companyWebsite: isAgency && typeof data.companyWebsite === 'string' ? data.companyWebsite : null,
          isAgency,
        };
        setProfile(unified);
        if (unified.firstName && !isAgency) {
          tokenStorage.setUserName(unified.firstName);
        } else if (unified.companyName && isAgency) {
          tokenStorage.setUserName(unified.companyName); // reuse key for display name
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { profile };
}
