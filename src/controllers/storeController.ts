import { Request, Response } from 'express';
import { openDb } from '../database';

export async function addStore(req: Request, res: Response) {
  const db = await openDb();
  const { name, address, number, cep } = req.body;
  await db.run('INSERT INTO stores (name, address, number, cep) VALUES (?, ?, ?, ?)', [name, address, number, cep]);
  res.status(201).json({ message: 'Store added successfully' });
}

export async function listStores(req: Request, res: Response) {
  const db = await openDb();
  const stores = await db.all('SELECT * FROM stores');
  res.json(stores);
}