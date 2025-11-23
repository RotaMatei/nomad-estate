export async function getCities(): Promise<City[]> {
  try {
    const { data } = await api.get('/cities/retrieve/all');
    return Array.isArray(data) ? (data as City[]) : [];
  } catch {
    return [];
  }
}
import api from '@/app/lib/api';

export interface LocationSuggestion { id: string | number; label: string }

export async function searchCountries(q: string): Promise<LocationSuggestion[]> {
  const query = (q || '').trim();
  try {
    let arr: Array<Record<string, unknown>> = [];
    if (!query) {
      // If no query, return all countries
      const all = await api.get('/countries/retrieve/get-all');
      arr = Array.isArray(all.data) ? all.data : [];
    } else {
      const res = await api.get('/countries/retrieve/search', { params: { q: query } });
      arr = Array.isArray(res.data) ? res.data : [];
      // Fallback: if search returns too few, get all and filter client-side
      if (arr.length < 3) {
        const all = await api.get('/countries/retrieve/get-all');
        const allArr = Array.isArray(all.data) ? all.data : [];
        arr = allArr.filter((c) => {
          const name = typeof (c as { name?: string }).name === 'string' ? (c as { name?: string }).name : '';
          const code = typeof (c as { code?: string }).code === 'string' ? (c as { code?: string }).code : '';
          const norm = (s: string) => (s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
          const qNorm = norm(query);
          return norm(name ?? '').includes(qNorm) || norm(code ?? '').includes(qNorm);
        });
      }
    }
    return arr
      .map((c) => {
        const id = 'id' in c ? (c as { id: string | number }).id : (c as never);
        const name = typeof (c as { name?: string }).name === 'string' ? (c as { name?: string }).name : undefined;
        const code = typeof (c as { code?: string }).code === 'string' ? (c as { code?: string }).code : undefined;
        const label = name || code || String(id ?? '');
        return id != null && label ? { id, label } : null;
      })
      .filter((v): v is LocationSuggestion => !!v);
  } catch {
    return [];
  }
}

export async function searchCities(q: string): Promise<LocationSuggestion[]> {
  const query = (q || '').trim();
  try {
    let arr: Array<Record<string, unknown>> = [];
    if (!query) {
      // If no query, return all cities
      const all = await api.get('/cities/retrieve/get-all');
      arr = Array.isArray(all.data) ? all.data : [];
    } else {
      const res = await api.get('/cities/retrieve/search', { params: { q: query } });
      arr = Array.isArray(res.data) ? res.data : [];
      // Fallback: if search returns too few, get all and filter client-side
      if (arr.length < 3) {
        const all = await api.get('/cities/retrieve/get-all');
        const allArr = Array.isArray(all.data) ? all.data : [];
        arr = allArr.filter((c) => {
          const name = typeof (c as { name?: string }).name === 'string' ? (c as { name?: string }).name : '';
          const norm = (s: string) => (s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
          const qNorm = norm(query);
          return norm(name ?? '').includes(qNorm);
        });
      }
    }
    return arr
      .map((c) => {
        const id = 'id' in c ? (c as { id: string | number }).id : (c as never);
        const name = typeof (c as { name?: string }).name === 'string' ? (c as { name?: string }).name : undefined;
        const label = name || String(id ?? '');
        return id != null && label ? { id, label } : null;
      })
      .filter((v): v is LocationSuggestion => !!v);
  } catch {
    return [];
  }
}
 
export type Country = { id: number; name: string; code?: string; [k: string]: unknown };
export type State = { id: number; name: string; countryId: number; [k: string]: unknown };
export type City = { id: number; name: string; stateId?: number; countryId?: number; [k: string]: unknown };

export async function getCountries(): Promise<Country[]> {
  try {
    const { data } = await api.get('/countries/retrieve/get-all');
    return Array.isArray(data) ? (data as Country[]) : [];
  } catch {
    return [];
  }
}

export async function getStates(countryId: number): Promise<State[]> {
  if (!countryId && countryId !== 0) return [];
  try {
    const { data } = await api.get(`/states/retrieve/get-all/${countryId}`);
    return Array.isArray(data) ? (data as State[]) : [];
  } catch {
    return [];
  }
}

export async function getCitiesByState(stateId: number): Promise<City[]> {
  if (!stateId && stateId !== 0) return [];
  try {
    const { data } = await api.get(`/cities/retrieve/get-all-by-state/${stateId}`);
    return Array.isArray(data) ? (data as City[]) : [];
  } catch {
    return [];
  }
}

