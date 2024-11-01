import { Request, Response } from 'express';
import { openDb } from '../database';
import { getAddressByCep } from '../services/cepService';
import { getCoordinates } from '../services/geocodingService';
import { calculateDistance } from '../utils/distanceUtils';
import logger from '../utils/logger';

export async function addStore(request: Request, response: Response) {
  const db = await openDb();
  const { name, number, cep } = request.body;

  try {
    logger.info(`Adicionando loja: ${name}, CEP: ${cep}`);
    const addressData = await getAddressByCep(cep);
    const fullAddress = `${addressData.logradouro}, ${number}, ${addressData.localidade}, ${addressData.uf}`;
    const coordinates = await getCoordinates(fullAddress);

    await db.run('INSERT INTO stores (name, street, number, cep, lat, lng, city, state, district) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, addressData.logradouro, number, cep, coordinates.lat, coordinates.lng, addressData.localidade, addressData.uf, addressData.bairro]);
    logger.info(`Loja adicionada com sucesso: ${name}`);
    response.status(201).json({ message: 'Loja adicionada com sucesso' });
  } catch (error) {
    logger.error('Erro ao adicionar loja:', error);
    response.status(400).json({ message: (error as Error).message });
  }
}

export async function listStores(request: Request, response: Response): Promise<void> {
  try {
    logger.info('Listando todas as lojas');
    const db = await openDb();
    const stores = await db.all('SELECT * FROM stores');
    response.status(200).json(stores.map(store => ({
      id: store.id,
      nome: store.name,
      cidade: store.city,
      estado: store.state,
      bairro: store.district,
      rua: store.street,
      numero: store.number,
      cep: store.cep,
      coordenadas: {
        lat: store.lat,
        lng: store.lng
      }
    })));
    logger.info('Lojas listadas com sucesso');
  } catch (error) {
    logger.error('Erro ao listar lojas:', error);
    response.status(500).json({ message: 'Erro ao listar lojas' });
  }
}

export async function findNearbyStores(request: Request, response: Response): Promise<void> {
  const { cep } = request.params;

  try {
    logger.info(`Buscando lojas próximas para o CEP: ${cep}`);
    const addressData = await getAddressByCep(cep);
    const fullAddress = `${addressData.logradouro}, ${addressData.localidade}, ${addressData.uf}`;
    const userCoordinates = await getCoordinates(fullAddress);

    const db = await openDb();
    const stores = await db.all('SELECT * FROM stores');

    const nearbyStores = stores
      .map(store => {
        const distance = calculateDistance(userCoordinates.lat, userCoordinates.lng, store.lat, store.lng);
        return { ...store, distance: parseFloat(distance.toFixed(3)) };
      })
      .filter(store => store.distance <= 100)
      .sort((a, b) => a.distance - b.distance);

    if (nearbyStores.length === 0) {
      logger.info('Nenhuma loja encontrada num raio de 100km');
      response.status(404).json({ message: 'Nenhuma loja encontrada num raio de 100km' });
      return;
    }

    response.status(200).json(nearbyStores.map(store => ({
      id: store.id,
      nome: store.name,
      cidade: store.city,
      estado: store.state,
      bairro: store.district,
      rua: store.street,
      numero: store.number,
      cep: store.cep,
      coordenadas: {
        lat: store.lat,
        lng: store.lng
      },
      distancia: store.distance
    })));
    logger.info('Lojas próximas encontradas com sucesso');
  } catch (error) {
    logger.error('Erro ao buscar lojas próximas:', error);
    response.status(400).json({ message: (error as Error).message });
  }
}

export async function deleteStore(request: Request, response: Response): Promise<void> {
  const { id } = request.params;

  try {
    logger.info(`Deletando loja com ID: ${id}`);
    const db = await openDb();
    const result = await db.run('DELETE FROM stores WHERE id = ?', [id]);

    if (result.changes === 0) {
      logger.info(`Loja com ID: ${id} não encontrada`);
      response.status(404).json({ message: 'Loja não encontrada' });
      return;
    }

    logger.info(`Loja com ID: ${id} deletada com sucesso`);
    response.status(200).json({ message: 'Loja deletada com sucesso' });
  } catch (error) {
    logger.error('Erro ao deletar loja:', error);
    response.status(500).json({ message: 'Erro ao deletar a loja' });
  }
}