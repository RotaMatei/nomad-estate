import api from '@/app/lib/api';
import { getArrayData } from './api/client';

export interface LocationSuggestion { id: string | number; label: string }

export async function searchCountries(q: string): Promise<LocationSuggestion[]> {
  const query = (q || '').trim();
  
  try {
    let arr: Array<Record<string, unknown>> = [];
    if (!query) {
      // If no query, return all countries
      arr = await getArrayData<Record<string, unknown>>(
        () => api.get('/countries/retrieve/get-all'),
        'searchCountries',
      );
    } else {
      const res = await api.get('/countries/retrieve/search', { params: { q: query } });
      arr = Array.isArray(res.data) ? res.data : [];
      // Fallback: if search returns too few, get all and filter client-side
      if (arr.length < 3) {
        const allArr = await getArrayData<Record<string, unknown>>(
          () => api.get('/countries/retrieve/get-all'),
          'searchCountries-fallback',
        );
        const norm = (s: string) => (s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
        const qNorm = norm(query);
        arr = allArr.filter((c) => {
          const name = typeof (c as { name?: string }).name === 'string' ? (c as { name?: string }).name : '';
          const code = typeof (c as { code?: string }).code === 'string' ? (c as { code?: string }).code : '';
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
      arr = await getArrayData<Record<string, unknown>>(
        () => api.get('/cities/retrieve/get-all'),
        'searchCities',
      );
    } else {
      const res = await api.get('/cities/retrieve/search', { params: { q: query } });
      arr = Array.isArray(res.data) ? res.data : [];
      // Fallback: if search returns too few, get all and filter client-side
      if (arr.length < 3) {
        const allArr = await getArrayData<Record<string, unknown>>(
          () => api.get('/cities/retrieve/get-all'),
          'searchCities-fallback',
        );
        const norm = (s: string) => (s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
        const qNorm = norm(query);
        arr = allArr.filter((c) => {
          const name = typeof (c as { name?: string }).name === 'string' ? (c as { name?: string }).name : '';
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

export async function getCities(): Promise<City[]> {
  return getArrayData<City>(
    () => api.get('/cities/retrieve/all'),
    'getCities',
  );
}

export async function getCountries(): Promise<Country[]> {
  return getArrayData<Country>(
    () => api.get('/countries/retrieve/get-all'),
    'getCountries',
  );
}

export async function getStates(countryId: number): Promise<State[]> {
  if (!countryId && countryId !== 0) return [];
  return getArrayData<State>(
    () => api.get(`/states/retrieve/get-all/${countryId}`),
    'getStates',
  );
}

export async function getCitiesByState(stateId: number): Promise<City[]> {
  if (!stateId && stateId !== 0) return [];
  return getArrayData<City>(
    () => api.get(`/cities/retrieve/get-all-by-state/${stateId}`),
    'getCitiesByState',
  );
}

