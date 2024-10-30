import { openDb } from '../database';

export async function createTable() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      street TEXT,
      number TEXT,
      cep TEXT,
      lat REAL,
      lng REAL,
      city TEXT,
      state TEXT,
      district TEXT
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

  if (!columnNames.includes('city')) {
    await db.exec(`ALTER TABLE stores ADD COLUMN city TEXT`);
  }

  if (!columnNames.includes('state')) {
    await db.exec(`ALTER TABLE stores ADD COLUMN state TEXT`);
  }

  if (!columnNames.includes('district')) {
    await db.exec(`ALTER TABLE stores ADD COLUMN district TEXT`);
  }

  if (!columnNames.includes('street')) {
    await db.exec(`ALTER TABLE stores ADD COLUMN street TEXT`);
  }
}