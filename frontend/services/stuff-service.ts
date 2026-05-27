import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export interface StuffSuggestion {
  stuffId: number;
  stuffName: string;
  brandId: number;
  price?: number;
}

export const stuffService = {
  searchStuffs: async (keyword: string): Promise<StuffSuggestion[]> => {
    const response = await axios.get(`${BASE_URL}/api/stuffs/search`, {
      params: { keyword },
    });

    return response.data.data;
  },

  findOrCreateStuff: async (stuffName: string): Promise<StuffSuggestion> => {
    const response = await axios.post(`${BASE_URL}/api/stuffs/find-or-create`, {
      stuffName,
    });

    return response.data.data;
  },
};