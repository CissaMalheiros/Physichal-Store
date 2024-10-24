import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  throw new Error('A chave da API do Google não foi definida');
}

export async function getCoordinates(address: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`;
    console.log('Requesting URL:', url);

    const response = await fetch(url);
    if (!response.ok) {
      console.error('Erro na resposta da API:', response.statusText);
      throw new Error('Erro ao buscar coordenadas');
    }

    const data = await response.json();
    console.log('Geocoding API response:', data);

    if (data.status !== 'OK') {
      console.error('Erro nos dados da API:', data.status);
      throw new Error('Endereço não encontrado');
    }

    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng
    };
  } catch (error) {
    console.error('Erro na função getCoordinates:', error);
    throw error;
  }
}