import { Request, Response } from 'express';
import { addStore } from '../controllers/storeController';
import { openDb } from '../database';
import { getAddressByCep } from '../services/cepService';
import { getCoordinates } from '../services/geocodingService';

jest.mock('../database');
jest.mock('../services/cepService');
jest.mock('../services/geocodingService');

describe('Store Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {
      body: {
        name: 'Loja Teste',
        number: '123',
        cep: '01001000'
      }
    };
    res = {
      status: statusMock
    };
  });

  it('should add a store successfully', async () => {
    (openDb as jest.Mock).mockResolvedValue({
      run: jest.fn().mockResolvedValue({}),
    });
    (getAddressByCep as jest.Mock).mockResolvedValue({
      logradouro: 'Praça da Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      bairro: 'Sé'
    });
    (getCoordinates as jest.Mock).mockResolvedValue({
      lat: -23.55052,
      lng: -46.633308
    });

    await addStore(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Loja adicionada com sucesso' });
  });

  it('should handle errors when adding a store', async () => {
    (openDb as jest.Mock).mockResolvedValue({
      run: jest.fn().mockRejectedValue(new Error('Erro ao adicionar loja')),
    });

    await addStore(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Erro ao adicionar loja' });
  });
});