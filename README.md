# Physical Store API

## Descrição
Este projeto é uma API para gerenciamento de lojas físicas de uma determinada loja eCommerce. A API permite adicionar, listar, buscar lojas próximas a um CEP e deletar lojas. A localização das lojas é obtida através da API do ViaCEP e da API de Geocodificação do Google.

## Funcionalidades
- Adicionar uma nova loja
- Listar todas as lojas
- Buscar lojas próximas a um CEP em um raio de 100km
- Deletar uma loja pelo ID
- Geração de logs em formato JSON utilizando Winston
- Documentação da API com Swagger
- Testes automatizados com Jest
- Validações sem bibliotecas externas

## Tecnologias Utilizadas
- Node.js
- Express
- TypeScript
- SQLite
- Winston
- Jest
- Swagger

## Estrutura do Projeto
```
physical-store/
├── .env
├── .gitignore
├── data/
│   ├── database.db
├── jest.config.js
├── logs/
│   ├── combined.log
│   └── error.log
├── package.json
├── src/
│   ├── __tests__/
│   │   ├── cepService.test.ts
│   │   ├── database.test.ts
│   │   ├── geocodingService.test.ts
│   │   └── storeController.test.ts
│   ├── app.ts
│   ├── controllers/
│   │   └── storeController.ts
│   ├── database.ts
│   ├── models/
│   │   └── storeModel.ts
│   ├── routes/
│   │   └── storeRoutes.ts
│   ├── services/
│   │   ├── cepService.ts
│   │   └── geocodingService.ts
│   ├── utils/
│   │   ├── distanceUtils.ts
│   │   └── logger.ts
│   └── validations/
│       ├── validateAddStore.ts
│       ├── validateDeleteStore.ts
│       ├── validateFindNearbyStores.ts
│       ├── validateListStores.ts
├── swagger.json
└── tsconfig.json
```

## Instalação

1. Clone o repositório:
```
git clone https://github.com/CissaMalheiros/Physichal-Store
cd Physichal-Store
```

2. Instale as dependências:
```
npm install
```

3. Crie um arquivo .env na raiz do projeto e adicione sua chave da API do Google ( será disponibilizada temporariamente uma chave válida para testes ):
```
GOOGLE_API_KEY=AIzaSyDEg_Q75KwbrLKhHInZUDl37X3-ShjMifs
```

## Utilização

1. Inicie o servidor no terminal da pasta clonada
```
npx ts-node src/app.ts
```

2. Acesse a documentação da API no navegador com swagger:
http://localhost:3000/api-docs

## Endpoints

### Adicionar uma nova loja

```
http://localhost:3000/api/stores
```

- URL: /api/stores
- Método: POST
- Body
```
{
  "name": "Nome da Loja",
  "number": "Número",
  "cep": "CEP"
}
```

- Resposta de Sucesso:
```
{
  "message": "Loja adicionada com sucesso"
}
```

- Resposta de Erro:
```
{
  "message": "Erro ao adicionar loja"
}
```

### Listar todas as lojas

```
http://localhost:3000/api/stores
```

- URL: /api/stores
- Método: GET

- Resposta de Sucesso:
```
[
  {
    "id": 1,
    "nome": "Nome da Loja",
    "cidade": "Cidade",
    "estado": "Estado",
    "bairro": "Bairro",
    "rua": "Rua",
    "numero": "Número",
    "cep": "CEP",
    "coordenadas": {
      "lat": -23.55052,
      "lng": -46.633308
    }
  }
]
```

- Resposta de Erro:
```
{
  "message": "Erro ao listar lojas"
}
```

### Buscar lojas próximas a um CEP

```
http://localhost:3000/api/stores/nearby/:cep
```

- URL: /api/stores/nearby/:cep
- Método: GET
- Parâmetros:
- cep: CEP para buscar lojas próximas

- Resposta de Sucesso:
  
```
[
  {
    "id": 1,
    "nome": "Nome da Loja",
    "cidade": "Cidade",
    "estado": "Estado",
    "bairro": "Bairro",
    "rua": "Rua",
    "numero": "Número",
    "cep": "CEP",
    "coordenadas": {
      "lat": -23.55052,
      "lng": -46.633308
    },
    "distancia": 10.5
  }
]
```

- Resposta de Erro:

```
{
  "message": "Nenhuma loja encontrada num raio de 100km"
}
```

### Deletar uma loja pelo ID

```
http://localhost:3000/api/stores/:id
```

- URL: /api/stores/:id
- Método: DELETE
- Parâmetros:
- id: ID da loja a ser deletada

- Resposta de Sucesso:
```
{
  "message": "Loja deletada com sucesso"
}
```

- Resposta de Erro:
```
{
  "message": "Loja não encontrada"
}
```

## Testes

Para rodar os testes, utilize o comando:
```
npx jest
```

## Validações
As validações foram implementadas sem o uso de bibliotecas externas. As funções de validação estão localizadas na pasta validations. Para rodar as validações, utilize os comandos:
```
npx ts-node src/validations/validateAddStore.ts
npx ts-node src/validations/validateListStores.ts
npx ts-node src/validations/validateFindNearbyStores.ts
npx ts-node src/validations/validateDeleteStore.ts
```

### Obrigado pela leitura e aproveite!
