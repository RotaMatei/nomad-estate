import api from './api';

export type Country = { id: number; name: string; code?: string; [k: string]: unknown };
export type State = { id: number; name: string; countryId: number; [k: string]: unknown };
export type City = { id: number; name: string; stateId?: number; countryId?: number; [k: string]: unknown };

export async function getCountries(): Promise<Country[]> {
  const { data } = await api.get('/countries/retrieve/get-all');
  return data as Country[];
}

export async function getStates(countryId: number): Promise<State[]> {
  const { data } = await api.get(`/states/retrieve/get-all/${countryId}`);
  return data as State[];
}

export async function getCitiesByState(stateId: number): Promise<City[]> {
  const { data } = await api.get(`/cities/retrieve/get-all-by-state/${stateId}`);
  return data as City[];
}
