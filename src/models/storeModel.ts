import { openDb } from '../database';

export async function createTable() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      number TEXT,
      cep TEXT
    )
  `);

  await db.exec(`ALTER TABLE stores ADD COLUMN lat REAL`);
  await db.exec(`ALTER TABLE stores ADD COLUMN lng REAL`);
}