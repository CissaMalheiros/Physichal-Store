import { deleteStore } from '../controllers/storeController';
import { Request, Response } from 'express';

interface CustomResponse extends Partial<Response> {
  body?: any;
}

function validateDeleteStore() {
  const req: Partial<Request> = {
    params: {
      id: '1',
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

  deleteStore(req as Request, res as Response).then(() => {
    console.assert(res.statusCode === 200, 'Expected status 200');
    console.assert(res.body.message === 'Loja deletada com sucesso', 'Expected success message');
  }).catch(console.error);
}

validateDeleteStore();