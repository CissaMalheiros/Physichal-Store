import { openDb } from '../database';
import sqlite3 from 'sqlite3';

jest.mock('sqlite3');
jest.mock('sqlite', () => ({
  open: jest.fn().mockResolvedValue({
    run: jest.fn(),
    all: jest.fn(),
    exec: jest.fn(),
  }),
}));

describe('Database', () => {
  it('should open the database successfully', async () => {
    const db = await openDb();
    expect(db).toBeDefined();
  });
});