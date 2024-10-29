import { Request, Response } from 'express';
import { openDb } from '../database';
import { getAddressByCep } from '../services/cepService';
import { getCoordinates } from '../services/geocodingService';
import { calculateDistance } from '../utils/distanceUtils';
import logger from '../utils/logger';

export async function addStore(req: Request, res: Response) {
  const db = await openDb();
  const { name, address, number, cep } = req.body;

  try {
    logger.info(`Adding store: ${name}, CEP: ${cep}`);
    const addressData = await getAddressByCep(cep);
    const fullAddress = `${addressData.logradouro}, ${number}, ${addressData.localidade}, ${addressData.uf}`;
    const coordinates = await getCoordinates(fullAddress);

    await db.run('INSERT INTO stores (name, address, number, cep, lat, lng) VALUES (?, ?, ?, ?, ?, ?)', [name, addressData.logradouro, number, cep, coordinates.lat, coordinates.lng]);
    logger.info(`Store added successfully: ${name}`);
    res.status(201).json({ message: 'Store added successfully' });
  } catch (error) {
    logger.error('Error adding store:', error);
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function listStores(req: Request, res: Response): Promise<void> {
  try {
    logger.info('Listing all stores');
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
    logger.info('Stores listed successfully');
  } catch (error) {
    logger.error('Error listing stores:', error);
    res.status(500).json({ message: 'Error listing stores' });
  }
}

export async function findNearbyStores(req: Request, res: Response): Promise<void> {
  const { cep } = req.params;

  try {
    logger.info(`Finding nearby stores for CEP: ${cep}`);
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
      logger.info('No stores found within 100km radius');
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
    logger.info('Nearby stores found successfully');
  } catch (error) {
    logger.error('Error finding nearby stores:', error);
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function deleteStore(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    logger.info(`Deleting store with ID: ${id}`);
    const db = await openDb();
    const result = await db.run('DELETE FROM stores WHERE id = ?', [id]);

    if (result.changes === 0) {
      logger.info(`Store with ID: ${id} not found`);
      res.status(404).json({ message: 'Loja não encontrada' });
      return;
    }

    logger.info(`Store with ID: ${id} deleted successfully`);
    res.status(200).json({ message: 'Loja deletada com sucesso' });
  } catch (error) {
    logger.error('Error deleting store:', error);
    res.status(500).json({ message: 'Erro ao deletar a loja' });
  }
}