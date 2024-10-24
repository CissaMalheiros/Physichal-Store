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

  const columns = await db.all(`PRAGMA table_info(stores)`);
  const columnNames = columns.map(column => column.name);

  if (!columnNames.includes('lat')) {
    await db.exec(`ALTER TABLE stores ADD COLUMN lat REAL`);
  }

  if (!columnNames.includes('lng')) {
    await db.exec(`ALTER TABLE stores ADD COLUMN lng REAL`);
  }
}