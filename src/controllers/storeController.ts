import { Request, Response } from 'express';
import { openDb } from '../database';
import { getAddressByCep } from '../services/cepService';
import { getCoordinates } from '../services/geocodingService';

export async function addStore(req: Request, res: Response) {
  const db = await openDb();
  const { name, address, number, cep } = req.body;

  try {
    const addressData = await getAddressByCep(cep);
    const fullAddress = `${addressData.logradouro}, ${number}, ${addressData.localidade}, ${addressData.uf}`;
    const coordinates = await getCoordinates(fullAddress);

    await db.run('INSERT INTO stores (name, address, number, cep, lat, lng) VALUES (?, ?, ?, ?, ?, ?)', [name, addressData.logradouro, number, cep, coordinates.lat, coordinates.lng]);
    res.status(201).json({ message: 'Store added successfully' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function listStores(req: Request, res: Response) {
  const db = await openDb();
  const stores = await db.all('SELECT * FROM stores');
  res.json(stores);
}