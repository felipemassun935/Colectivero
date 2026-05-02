import * as SQLite from 'expo-sqlite';

export interface Catch {
  id: number;
  linea: string;
  unidad: string;
  interno: string;
  timestamp: string;
  notes: string | null;
  isDuplicate: boolean;
}

export interface Stats {
  totalCatches: number;
  uniqueLineas: number;
  uniqueUnidades: number;
  currentStreak: number;
  mostRiddenLinea: string | null;
  rarestCatch: Catch | null;
}

const db = SQLite.openDatabase('colectivero.db');

function execSQL(
  sql: string,
  args: (string | number | null)[] = []
): Promise<SQLite.SQLResultSet> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          args,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return true;
          }
        );
      },
      (error) => reject(error)
    );
  });
}

function queryAll<T>(
  sql: string,
  args: (string | number | null)[] = []
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          args,
          (_, result) => {
            const rows: T[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              rows.push(result.rows.item(i) as T);
            }
            resolve(rows);
          },
          (_, error) => {
            reject(error);
            return true;
          }
        );
      },
      (error) => reject(error)
    );
  });
}

function queryFirst<T>(
  sql: string,
  args: (string | number | null)[] = []
): Promise<T | null> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          args,
          (_, result) => {
            resolve(result.rows.length > 0 ? (result.rows.item(0) as T) : null);
          },
          (_, error) => {
            reject(error);
            return true;
          }
        );
      },
      (error) => reject(error)
    );
  });
}

function rowToCatch(row: {
  id: number;
  linea: string;
  unidad: string;
  interno: string;
  timestamp: string;
  notes: string | null;
  isDuplicate: number;
}): Catch {
  return {
    id: row.id,
    linea: row.linea,
    unidad: row.unidad,
    interno: row.interno,
    timestamp: row.timestamp,
    notes: row.notes,
    isDuplicate: row.isDuplicate === 1,
  };
}

export async function initDB(): Promise<void> {
  await execSQL(`
    CREATE TABLE IF NOT EXISTS catches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      linea TEXT NOT NULL,
      unidad TEXT NOT NULL,
      interno TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      notes TEXT,
      isDuplicate INTEGER NOT NULL DEFAULT 0
    )
  `);
}

export async function logCatch(
  linea: string,
  unidad: string,
  interno: string,
  notes?: string
): Promise<Catch> {
  const existing = await queryFirst<{ count: number }>(
    'SELECT COUNT(*) as count FROM catches WHERE linea = ? AND unidad = ?',
    [linea, unidad]
  );

  const isDuplicate = existing ? existing.count > 0 : false;
  const timestamp = new Date().toISOString();
  const notesValue = notes && notes.trim().length > 0 ? notes.trim() : null;

  const result = await execSQL(
    'INSERT INTO catches (linea, unidad, interno, timestamp, notes, isDuplicate) VALUES (?, ?, ?, ?, ?, ?)',
    [linea, unidad, interno, timestamp, notesValue, isDuplicate ? 1 : 0]
  );

  const newCatch = await queryFirst<{
    id: number;
    linea: string;
    unidad: string;
    interno: string;
    timestamp: string;
    notes: string | null;
    isDuplicate: number;
  }>('SELECT * FROM catches WHERE id = ?', [result.insertId ?? 0]);

  if (!newCatch) throw new Error('Failed to retrieve newly inserted catch');
  return rowToCatch(newCatch);
}

export async function getAllCatches(): Promise<Catch[]> {
  const rows = await queryAll<{
    id: number;
    linea: string;
    unidad: string;
    interno: string;
    timestamp: string;
    notes: string | null;
    isDuplicate: number;
  }>('SELECT * FROM catches ORDER BY timestamp DESC');
  return rows.map(rowToCatch);
}

export async function getCatchesByLinea(linea: string): Promise<Catch[]> {
  const rows = await queryAll<{
    id: number;
    linea: string;
    unidad: string;
    interno: string;
    timestamp: string;
    notes: string | null;
    isDuplicate: number;
  }>('SELECT * FROM catches WHERE linea = ? ORDER BY timestamp DESC', [linea]);
  return rows.map(rowToCatch);
}

export async function getCatchById(id: number): Promise<Catch | null> {
  const row = await queryFirst<{
    id: number;
    linea: string;
    unidad: string;
    interno: string;
    timestamp: string;
    notes: string | null;
    isDuplicate: number;
  }>('SELECT * FROM catches WHERE id = ?', [id]);
  if (!row) return null;
  return rowToCatch(row);
}

export async function getDistinctLineas(): Promise<string[]> {
  const rows = await queryAll<{ linea: string }>(
    'SELECT DISTINCT linea FROM catches ORDER BY linea ASC'
  );
  return rows.map((r) => r.linea);
}

function getArgentineDateStr(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });
}

export async function getStats(): Promise<Stats> {
  const totalRow = await queryFirst<{ count: number }>(
    'SELECT COUNT(*) as count FROM catches'
  );
  const totalCatches = totalRow?.count ?? 0;

  const lineaRow = await queryFirst<{ count: number }>(
    'SELECT COUNT(DISTINCT linea) as count FROM catches'
  );
  const uniqueLineas = lineaRow?.count ?? 0;

  const unidadRow = await queryFirst<{ count: number }>(
    'SELECT COUNT(DISTINCT unidad) as count FROM catches'
  );
  const uniqueUnidades = unidadRow?.count ?? 0;

  const mostRiddenRow = await queryFirst<{ linea: string; cnt: number }>(
    'SELECT linea, COUNT(*) as cnt FROM catches GROUP BY linea ORDER BY cnt DESC LIMIT 1'
  );
  const mostRiddenLinea = mostRiddenRow?.linea ?? null;

  const rarestRow = await queryFirst<{ linea: string; cnt: number }>(
    'SELECT linea, COUNT(*) as cnt FROM catches GROUP BY linea ORDER BY cnt ASC LIMIT 1'
  );

  let rarestCatch: Catch | null = null;
  if (rarestRow) {
    const rarestCatchRow = await queryFirst<{
      id: number;
      linea: string;
      unidad: string;
      interno: string;
      timestamp: string;
      notes: string | null;
      isDuplicate: number;
    }>('SELECT * FROM catches WHERE linea = ? ORDER BY timestamp DESC LIMIT 1', [
      rarestRow.linea,
    ]);
    if (rarestCatchRow) rarestCatch = rowToCatch(rarestCatchRow);
  }

  const allTimestamps = await queryAll<{ timestamp: string }>(
    'SELECT timestamp FROM catches ORDER BY timestamp DESC'
  );

  let currentStreak = 0;
  if (allTimestamps.length > 0) {
    const dateSet = new Set<string>();
    for (const row of allTimestamps) {
      dateSet.add(getArgentineDateStr(row.timestamp));
    }

    const todayStr = new Date().toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });

    const todayLocalISO = new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });
    const todayDate = new Date(todayLocalISO + 'T00:00:00');

    const formatES = (d: Date): string =>
      d.toLocaleDateString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
      });

    const startDate = dateSet.has(todayStr) ? todayDate : (() => {
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      return dateSet.has(formatES(yesterday)) ? yesterday : null;
    })();

    if (startDate) {
      currentStreak = 1;
      let prev = new Date(startDate);
      prev.setDate(prev.getDate() - 1);
      while (dateSet.has(formatES(prev))) {
        currentStreak++;
        prev.setDate(prev.getDate() - 1);
      }
    }
  }

  return { totalCatches, uniqueLineas, uniqueUnidades, currentStreak, mostRiddenLinea, rarestCatch };
}
