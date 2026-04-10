import { ApiResponse, Character } from '../types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const rickAndMortyApi = {
  async getCharacters(page: number = 1, name?: string, status?: string): Promise<ApiResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
    });
    
    if (name) {
      params.append('name', name);
    }

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${BASE_URL}/character?${params}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          info: {
            count: 0,
            pages: 0,
            next: null,
            prev: null,
          },
          results: [],
        };
      }
      throw new Error('Error fetching characters');
    }
    
    return response.json();
  },

  async getCharacterById(id: number): Promise<Character> {
    const response = await fetch(`${BASE_URL}/character/${id}`);
    
    if (!response.ok) {
      throw new Error('Character not found');
    }
    
    return response.json();
  },

  async getMultipleCharacters(ids: number[]): Promise<Character[]> {
    if (ids.length === 0) return [];
    
    const response = await fetch(`${BASE_URL}/character/${ids.join(',')}`);
    
    if (!response.ok) {
      throw new Error('Error fetching characters');
    }
    
    const data = await response.json();
    // Si solo hay un personaje, la API devuelve un objeto, no un array
    return Array.isArray(data) ? data : [data];
  },
};