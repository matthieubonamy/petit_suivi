import * as SQLite from 'expo-sqlite';
import { Child, Observation, APIKeyEntry } from '../types';

const db = SQLite.openDatabaseSync('petit_suivi.db');

export function initDatabase(): void {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      avatar_color TEXT NOT NULL DEFAULT '#C97B4A',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS observations (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('stool', 'urine')),
      color_id TEXT NOT NULL,
      bristol_type INTEGER,
      photo_uri TEXT,
      notes TEXT,
      status TEXT NOT NULL CHECK(status IN ('ok', 'watch', 'alert')),
      created_at TEXT NOT NULL,
      FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      key_value TEXT NOT NULL,
      provider TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_observations_child_id ON observations(child_id);
    CREATE INDEX IF NOT EXISTS idx_observations_created_at ON observations(created_at);
  `);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Children
export function getAllChildren(): Child[] {
  const rows = db.getAllSync<{
    id: string;
    name: string;
    birth_date: string;
    avatar_color: string;
    created_at: string;
    updated_at: string;
  }>('SELECT * FROM children ORDER BY created_at ASC');

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    birthDate: r.birth_date,
    avatarColor: r.avatar_color,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export function getChildById(id: string): Child | null {
  const row = db.getFirstSync<{
    id: string;
    name: string;
    birth_date: string;
    avatar_color: string;
    created_at: string;
    updated_at: string;
  }>('SELECT * FROM children WHERE id = ?', [id]);

  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    avatarColor: row.avatar_color,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function insertChild(data: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>): Child {
  const id = generateId();
  const now = new Date().toISOString();
  db.runSync(
    'INSERT INTO children (id, name, birth_date, avatar_color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, data.name, data.birthDate, data.avatarColor, now, now]
  );
  return { id, ...data, createdAt: now, updatedAt: now };
}

export function updateChild(id: string, data: Partial<Omit<Child, 'id' | 'createdAt' | 'updatedAt'>>): void {
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.birthDate !== undefined) { fields.push('birth_date = ?'); values.push(data.birthDate); }
  if (data.avatarColor !== undefined) { fields.push('avatar_color = ?'); values.push(data.avatarColor); }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.runSync(`UPDATE children SET ${fields.join(', ')} WHERE id = ?`, values);
}

export function deleteChild(id: string): void {
  db.runSync('DELETE FROM children WHERE id = ?', [id]);
}

// Observations
export function getObservationsByChild(
  childId: string,
  limit = 100,
  offset = 0
): Observation[] {
  const rows = db.getAllSync<{
    id: string;
    child_id: string;
    type: string;
    color_id: string;
    bristol_type: number | null;
    photo_uri: string | null;
    notes: string | null;
    status: string;
    created_at: string;
  }>(
    'SELECT * FROM observations WHERE child_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [childId, limit, offset]
  );

  return rows.map((r) => ({
    id: r.id,
    childId: r.child_id,
    type: r.type as 'stool' | 'urine',
    colorId: r.color_id,
    bristolType: r.bristol_type ?? undefined,
    photoUri: r.photo_uri ?? undefined,
    notes: r.notes ?? undefined,
    status: r.status as 'ok' | 'watch' | 'alert',
    createdAt: r.created_at,
  }));
}

export function getObservationsForPeriod(
  childId: string,
  fromDate: string,
  toDate: string
): Observation[] {
  const rows = db.getAllSync<{
    id: string;
    child_id: string;
    type: string;
    color_id: string;
    bristol_type: number | null;
    photo_uri: string | null;
    notes: string | null;
    status: string;
    created_at: string;
  }>(
    'SELECT * FROM observations WHERE child_id = ? AND created_at >= ? AND created_at <= ? ORDER BY created_at DESC',
    [childId, fromDate, toDate]
  );

  return rows.map((r) => ({
    id: r.id,
    childId: r.child_id,
    type: r.type as 'stool' | 'urine',
    colorId: r.color_id,
    bristolType: r.bristol_type ?? undefined,
    photoUri: r.photo_uri ?? undefined,
    notes: r.notes ?? undefined,
    status: r.status as 'ok' | 'watch' | 'alert',
    createdAt: r.created_at,
  }));
}

export function insertObservation(data: Omit<Observation, 'id' | 'createdAt'>): Observation {
  const id = generateId();
  const now = new Date().toISOString();
  db.runSync(
    'INSERT INTO observations (id, child_id, type, color_id, bristol_type, photo_uri, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      data.childId,
      data.type,
      data.colorId,
      data.bristolType ?? null,
      data.photoUri ?? null,
      data.notes ?? null,
      data.status,
      now,
    ]
  );
  return { id, ...data, createdAt: now };
}

export function deleteObservation(id: string): void {
  db.runSync('DELETE FROM observations WHERE id = ?', [id]);
}

// API Keys
export function getAllAPIKeys(): APIKeyEntry[] {
  const rows = db.getAllSync<{
    id: string;
    label: string;
    key_value: string;
    provider: string;
    created_at: string;
  }>('SELECT * FROM api_keys ORDER BY created_at DESC');

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    keyValue: r.key_value,
    provider: r.provider,
    createdAt: r.created_at,
  }));
}

export function insertAPIKey(data: Omit<APIKeyEntry, 'id' | 'createdAt'>): APIKeyEntry {
  const id = generateId();
  const now = new Date().toISOString();
  db.runSync(
    'INSERT INTO api_keys (id, label, key_value, provider, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, data.label, data.keyValue, data.provider, now]
  );
  return { id, ...data, createdAt: now };
}

export function deleteAPIKey(id: string): void {
  db.runSync('DELETE FROM api_keys WHERE id = ?', [id]);
}

// Stats
export function getObservationCountByDay(childId: string, days = 7): Record<string, { stool: number; urine: number }> {
  const result: Record<string, { stool: number; urine: number }> = {};

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result[dateStr] = { stool: 0, urine: 0 };
  }

  const rows = db.getAllSync<{ date: string; type: string; count: number }>(
    `SELECT date(created_at) as date, type, COUNT(*) as count
     FROM observations
     WHERE child_id = ? AND date(created_at) >= date('now', ?)
     GROUP BY date(created_at), type`,
    [childId, `-${days} days`]
  );

  for (const row of rows) {
    if (result[row.date]) {
      if (row.type === 'stool') result[row.date].stool = row.count;
      else result[row.date].urine = row.count;
    }
  }

  return result;
}
