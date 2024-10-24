import { Request, Response } from 'express';
import { openDb } from '../database';
import { getAddressByCep } from '../services/cepService';

export async function addStore(req: Request, res: Response) {
  const db = await openDb();
  const { name, address, number, cep } = req.body;

  try {
    const addressData = await getAddressByCep(cep);
    await db.run('INSERT INTO stores (name, address, number, cep) VALUES (?, ?, ?, ?)', [name, addressData.logradouro, number, cep]);
    res.status(201).json({ message: 'Store added successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
}

export async function listStores(req: Request, res: Response) {
  const db = await openDb();
  const stores = await db.all('SELECT * FROM stores');
  res.json(stores);
}