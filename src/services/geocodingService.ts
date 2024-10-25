import fetch from 'node-fetch';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error('A chave da API do Google não foi definida');
}

export async function getCoordinates(address: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      logger.error('Erro na resposta da API:', response.statusText);
      throw new Error('Erro ao buscar coordenadas');
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      logger.error('Erro nos dados da API:', data.status);
      throw new Error('Endereço não encontrado');
    }

    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng
    };
  } catch (error) {
    logger.error('Erro na função getCoordinates:', error);
    throw error;
  }
}