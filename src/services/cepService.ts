import fetch from 'node-fetch';

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
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) {
    throw new Error('Erro ao buscar o CEP');
  }
  const data = await response.json() as Address;
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }
  return data;
}