import api from '@/app/lib/api';

export interface AgentRecord {
  id: string; // agent table id
  userId: string;
  agencyId: string;
  user?: {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  };
}

export interface BasicUserSearchResult {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  fullName?: string;
}

export async function getAgentsForAgency(agencyId: string): Promise<AgentRecord[]> {
  if (!agencyId) return [];
  try {
    const res = await api.get(`/agent/retrieve/agents-for-agency/${agencyId}`);
    return Array.isArray(res.data) ? (res.data as AgentRecord[]) : [];
  } catch { return []; }
}

export async function addAgentToAgency(userId: string, agencyId: string): Promise<boolean> {
  if (!userId || !agencyId) return false;
  try {
    await api.post('/agent/create', { userId, agencyId });
    return true;
  } catch { return false; }
}

export async function removeAgentFromAgency(userId: string, agencyId: string): Promise<boolean> {
  if (!userId || !agencyId) return false;
  try {
    await api.delete(`/agent/delete/${userId}/${agencyId}`);
    return true;
  } catch { return false; }
}

export async function searchUsersByName(query: string): Promise<BasicUserSearchResult[]> {
  const q = (query || '').trim();
  if (q.length < 2) return [];
  try {
    const res = await api.get(`/user/search/${encodeURIComponent(q)}`);
    const arr = (Array.isArray(res.data) ? res.data : []) as Array<Record<string, unknown>>;
    return arr.map((u) => {
      const id = 'id' in u ? String((u as { id: string | number }).id) : '';
      const firstName = typeof u.firstName === 'string' ? u.firstName : undefined;
      const lastName = typeof u.lastName === 'string' ? u.lastName : undefined;
      const email = typeof u.email === 'string' ? u.email : undefined;
      const phoneNumber = typeof u.phoneNumber === 'string' ? u.phoneNumber : undefined;
      const fullName = `${firstName || ''} ${lastName || ''}`.trim();
      return { id, firstName, lastName, email, phoneNumber, fullName } as BasicUserSearchResult;
    });
  } catch { return []; }
}

export async function searchUsers(query: string, cityTags?: string[], countryTags?: string[]): Promise<BasicUserSearchResult[]> {
  const q = (query || '').trim();
  if (q.length < 2) return [];
  try {
    // Prefer a query-parameter driven endpoint, fallback to name-only search
    const res = await api.get('/user/search', {
      params: {
        q,
        cities: cityTags && cityTags.length ? cityTags : undefined,
        countries: countryTags && countryTags.length ? countryTags : undefined,
      },
    });
    const arr = (Array.isArray(res.data) ? res.data : []) as Array<Record<string, unknown>>;
    return arr.map((u) => {
      const id = 'id' in u ? String((u as { id: string | number }).id) : '';
      const firstName = typeof u.firstName === 'string' ? u.firstName : undefined;
      const lastName = typeof u.lastName === 'string' ? u.lastName : undefined;
      const email = typeof u.email === 'string' ? u.email : undefined;
      const phoneNumber = typeof u.phoneNumber === 'string' ? u.phoneNumber : undefined;
      const fullName = `${firstName || ''} ${lastName || ''}`.trim();
      return { id, firstName, lastName, email, phoneNumber, fullName } as BasicUserSearchResult;
    });
  } catch {
    // Fallback gracefully
    return searchUsersByName(q);
  }
}