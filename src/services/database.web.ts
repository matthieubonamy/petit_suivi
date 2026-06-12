// Web stub for database.ts — uses localStorage for GitHub Pages demo
import { Child, Observation, APIKeyEntry } from '../types';

const KEY_CHILDREN = 'ps_children';
const KEY_OBS = 'ps_observations';
const KEY_APIKEYS = 'ps_api_keys';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = (typeof localStorage !== 'undefined' && localStorage.getItem(key)) || null;
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {}
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function initDatabase(): void {
  // no-op on web
}

// Children
export function getAllChildren(): Child[] {
  return load<Child[]>(KEY_CHILDREN, []);
}

export function getChildById(id: string): Child | null {
  return load<Child[]>(KEY_CHILDREN, []).find((c) => c.id === id) ?? null;
}

export function insertChild(data: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>): Child {
  const now = new Date().toISOString();
  const child: Child = { id: generateId(), ...data, createdAt: now, updatedAt: now };
  const list = load<Child[]>(KEY_CHILDREN, []);
  list.push(child);
  save(KEY_CHILDREN, list);
  return child;
}

export function updateChild(id: string, data: Partial<Omit<Child, 'id' | 'createdAt' | 'updatedAt'>>): void {
  const now = new Date().toISOString();
  const list = load<Child[]>(KEY_CHILDREN, []).map((c) =>
    c.id === id ? { ...c, ...data, updatedAt: now } : c
  );
  save(KEY_CHILDREN, list);
}

export function deleteChild(id: string): void {
  save(KEY_CHILDREN, load<Child[]>(KEY_CHILDREN, []).filter((c) => c.id !== id));
  save(KEY_OBS, load<Observation[]>(KEY_OBS, []).filter((o) => o.childId !== id));
}

// Observations
export function getObservationsByChild(childId: string, limit = 100, offset = 0): Observation[] {
  const all = load<Observation[]>(KEY_OBS, [])
    .filter((o) => o.childId === childId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return all.slice(offset, offset + limit);
}

export function getObservationsForPeriod(childId: string, fromDate: string, toDate: string): Observation[] {
  return load<Observation[]>(KEY_OBS, []).filter(
    (o) => o.childId === childId && o.createdAt >= fromDate && o.createdAt <= toDate
  );
}

export function insertObservation(data: Omit<Observation, 'id' | 'createdAt'>): Observation {
  const now = new Date().toISOString();
  const obs: Observation = { id: generateId(), ...data, createdAt: now };
  const list = load<Observation[]>(KEY_OBS, []);
  list.unshift(obs);
  save(KEY_OBS, list);
  return obs;
}

export function deleteObservation(id: string): void {
  save(KEY_OBS, load<Observation[]>(KEY_OBS, []).filter((o) => o.id !== id));
}

// API Keys
export function getAllAPIKeys(): APIKeyEntry[] {
  return load<APIKeyEntry[]>(KEY_APIKEYS, []);
}

export function insertAPIKey(data: Omit<APIKeyEntry, 'id' | 'createdAt'>): APIKeyEntry {
  const now = new Date().toISOString();
  const entry: APIKeyEntry = { id: generateId(), ...data, createdAt: now };
  const list = load<APIKeyEntry[]>(KEY_APIKEYS, []);
  list.unshift(entry);
  save(KEY_APIKEYS, list);
  return entry;
}

export function deleteAPIKey(id: string): void {
  save(KEY_APIKEYS, load<APIKeyEntry[]>(KEY_APIKEYS, []).filter((e) => e.id !== id));
}

// Stats
export function getObservationCountByDay(
  childId: string,
  days = 7
): Record<string, { stool: number; urine: number }> {
  const result: Record<string, { stool: number; urine: number }> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result[d.toISOString().split('T')[0]] = { stool: 0, urine: 0 };
  }
  for (const o of load<Observation[]>(KEY_OBS, []).filter((o) => o.childId === childId)) {
    const dateStr = o.createdAt.split('T')[0];
    if (result[dateStr]) {
      if (o.type === 'stool') result[dateStr].stool++;
      else result[dateStr].urine++;
    }
  }
  return result;
}
