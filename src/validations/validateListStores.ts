import { listStores } from '../controllers/storeController';
import { Request, Response } from 'express';

interface CustomResponse extends Partial<Response> {
  body?: any;
  statusCode?: number;
}

function validateListStores() {
  const req: Partial<Request> = {};

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

  listStores(req as Request, res as Response).then(() => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', res.body);
    console.assert(res.statusCode === 200, 'Expected status 200');
    console.assert(Array.isArray(res.body), 'Expected an array of stores');
  }).catch(console.error);
}

validateListStores();