import { getCoordinates } from '../services/geocodingService';
import fetch from 'node-fetch';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('Geocoding Service', () => {
  it('should get coordinates successfully', async () => {
    const mockResponse = {
      status: 'OK',
      results: [{ geometry: { location: { lat: 10, lng: 20 } } }],
    };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(new Response(JSON.stringify(mockResponse)));

    const coordinates = await getCoordinates('some address');
    expect(coordinates).toEqual({ lat: 10, lng: 20 });
  });

  it('should handle errors when getting coordinates', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(new Response(JSON.stringify({ status: 'ZERO_RESULTS' })));

    await expect(getCoordinates('some address')).rejects.toThrow('Endereço não encontrado');
  });
});