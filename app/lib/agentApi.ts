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
    const arr = Array.isArray(res.data) ? res.data : [];
    return arr.map((u: any) => ({
      id: String(u.id),
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phoneNumber: u.phoneNumber,
      fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
    }));
  } catch { return []; }
}