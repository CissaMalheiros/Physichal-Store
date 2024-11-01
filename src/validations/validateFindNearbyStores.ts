import { findNearbyStores } from '../controllers/storeController';
import { Request, Response } from 'express';

interface CustomResponse extends Partial<Response> {
  body?: any;
  statusCode?: number;
}

function validateFindNearbyStores() {
  const req: Partial<Request> = {
    params: {
      cep: '01001-000',
    },
  };

  const res: CustomResponse = {
    status: function (code: number) {
      this.statusCode = code;
      return this as Response;
    },
    json: function (body: any) {
      this.body = body;
      return this as Response;
    },
  };

  findNearbyStores(req as Request, res as Response).then(() => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', res.body);
    if (res.statusCode === 404) {
      console.assert(res.body.message === 'Nenhuma loja encontrada num raio de 100km', 'Expected no stores found message');
    } else {
      console.assert(res.statusCode === 200, 'Expected status 200');
      console.assert(Array.isArray(res.body), 'Expected an array of nearby stores');
    }
  }).catch(console.error);
}

validateFindNearbyStores();