import { addStore } from '../controllers/storeController';
import { Request, Response } from 'express';

function validateAddStore() {
  const req: Partial<Request> = {
    body: {
      name: 'Loja Teste',
      number: '123',
      cep: '01001-000',
    },
  };

interface CustomResponse extends Partial<Response> {
  body?: any;
}

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

  addStore(req as Request, res as Response).then(() => {
    console.assert(res.statusCode === 201, 'Expected status 201');
    console.assert(res.body.message === 'Loja adicionada com sucesso', 'Expected success message');
  }).catch(console.error);
}

validateAddStore();