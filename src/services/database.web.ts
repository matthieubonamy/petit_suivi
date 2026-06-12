// Web stub for database.ts — uses localStorage for GitHub Pages demo
import { Child, Observation } from '../types';

const KEY_CHILDREN = 'ps_children';
const KEY_OBS = 'ps_observations';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function initDatabase(): void {
  // no-op on web
}

export function getChildren(): Child[] {
  return load<Child[]>(KEY_CHILDREN, []);
}

export function addChild(child: Child): void {
  const list = getChildren();
  list.push(child);
  save(KEY_CHILDREN, list);
}

export function updateChild(child: Child): void {
  const list = getChildren().map((c) => (c.id === child.id ? child : c));
  save(KEY_CHILDREN, list);
}

export function deleteChild(id: string): void {
  save(KEY_CHILDREN, getChildren().filter((c) => c.id !== id));
  save(KEY_OBS, getObservations(id).filter((o) => o.childId !== id));
}

export function getObservations(childId: string, limit?: number): Observation[] {
  const all = load<Observation[]>(KEY_OBS, []).filter((o) => o.childId === childId);
  all.sort((a, b) => b.date - a.date);
  return limit ? all.slice(0, limit) : all;
}

export function getAllObservations(): Observation[] {
  return load<Observation[]>(KEY_OBS, []);
}

export function addObservation(obs: Observation): void {
  const list = load<Observation[]>(KEY_OBS, []);
  list.unshift(obs);
  save(KEY_OBS, list);
}

export function deleteObservation(id: string): void {
  save(KEY_OBS, load<Observation[]>(KEY_OBS, []).filter((o) => o.id !== id));
}

export function getObservationsByPeriod(
  childId: string,
  startDate: number,
  endDate: number
): Observation[] {
  return load<Observation[]>(KEY_OBS, []).filter(
    (o) => o.childId === childId && o.date >= startDate && o.date <= endDate
  );
}

export function saveAPIKey(_service: string, _key: string): void {}
export function getAPIKey(_service: string): string | null { return null; }
export function deleteAPIKey(_service: string): void {}
