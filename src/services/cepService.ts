import fetch from 'node-fetch';
import logger from '../utils/logger';

interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export async function getAddressByCep(cep: string): Promise<Address> {
  try {
    logger.info(`Fetching address for CEP: ${cep}`);
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      logger.error('Error fetching CEP:', response.statusText);
      throw new Error('Erro ao buscar o CEP');
    }
    const data = await response.json() as Address;
    if (data.erro) {
      logger.error('CEP not found:', cep);
      throw new Error('CEP não encontrado');
    }
    logger.info('Address fetched successfully');
    return data;
  } catch (error) {
    logger.error('Error in getAddressByCep:', error);
    throw error;
  }
}