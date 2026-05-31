import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

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

    return response.data.result?.stuffs ?? [];
  },

  createStuff: async (data: { brandId: number; stuffName: string; price?: number }) => {
    const response = await axios.post(`${BASE_URL}/api/stuffs`, data);
    return response.data.result;
  },

  findOrCreateStuff: async (stuffName: string): Promise<StuffSuggestion> => {
    const response = await axios.post(`${BASE_URL}/api/stuffs/find-or-create`, {
      stuffName,
    });

    return response.data.data;
  },
};