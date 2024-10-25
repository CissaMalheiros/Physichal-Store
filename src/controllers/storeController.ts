import { Request, Response } from 'express';
import { openDb } from '../database';
import { getAddressByCep } from '../services/cepService';
import { getCoordinates } from '../services/geocodingService';
import { calculateDistance } from '../utils/distanceUtils';

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

export async function listStores(req: Request, res: Response): Promise<void> {
  const db = await openDb();
  const stores = await db.all('SELECT * FROM stores');
  res.json(stores.map(store => ({
    id: store.id,
    name: store.name,
    address: store.address,
    number: store.number,
    cep: store.cep,
    coordinates: {
      lat: store.lat,
      lng: store.lng
    }
  })));
}

export async function findNearbyStores(req: Request, res: Response): Promise<void> {
  const { cep } = req.params;

  try {
    const addressData = await getAddressByCep(cep);
    const fullAddress = `${addressData.logradouro}, ${addressData.localidade}, ${addressData.uf}`;
    const userCoordinates = await getCoordinates(fullAddress);

    const db = await openDb();
    const stores = await db.all('SELECT * FROM stores');

    const nearbyStores = stores
      .map(store => {
        const distance = calculateDistance(userCoordinates.lat, userCoordinates.lng, store.lat, store.lng);
        return { ...store, distance };
      })
      .filter(store => store.distance <= 100)
      .sort((a, b) => a.distance - b.distance);

    if (nearbyStores.length === 0) {
      res.status(404).json({ message: 'Nenhuma loja encontrada num raio de 100km' });
      return;
    }

    res.json(nearbyStores.map(store => ({
      id: store.id,
      name: store.name,
      address: store.address,
      number: store.number,
      cep: store.cep,
      coordinates: {
        lat: store.lat,
        lng: store.lng
      },
      distance: store.distance
    })));
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}