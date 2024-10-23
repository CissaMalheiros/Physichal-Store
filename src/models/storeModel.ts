import { openDb } from '../database';

export async function createTable() {
  const db = await openDb();
  await db.exec('CREATE TABLE IF NOT EXISTS stores (id INTEGER PRIMARY KEY, name TEXT, address TEXT, number TEXT, cep TEXT)');
}