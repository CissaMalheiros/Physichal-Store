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
    logger.info(`Buscando endereço para o CEP: ${cep}`);
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      logger.error('Erro ao buscar CEP:', response.statusText);
      throw new Error('Erro ao buscar o CEP');
    }
    const data = await response.json() as Address;
    if (data.erro) {
      logger.error('CEP não encontrado:', cep);
      throw new Error('CEP não encontrado');
    }
    logger.info('Endereço buscado com sucesso');
    return data;
  } catch (error) {
    logger.error('Erro na função getAddressByCep:', error);
    throw error;
  }
}