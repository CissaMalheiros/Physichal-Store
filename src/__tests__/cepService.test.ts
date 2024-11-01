import { getAddressByCep } from '../services/cepService';
import fetch from 'node-fetch';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('CEP Service', () => {
  it('should get address by CEP successfully', async () => {
    const mockResponse = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107',
    };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(new Response(JSON.stringify(mockResponse)));

    const address = await getAddressByCep('01001-000');
    expect(address).toEqual(mockResponse);
  });

  it('should handle errors when getting address by CEP', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(new Response(JSON.stringify({ erro: true })));

    await expect(getAddressByCep('00000-000')).rejects.toThrow('CEP não encontrado');
  });
});