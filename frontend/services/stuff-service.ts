import axios from 'axios';
import { getToken } from '@/utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';

export interface StuffSuggestion {
  stuffId: number;
  stuffName: string;
  brandId: number;
  brandName: string;
  logoUrl?: string;
  price?: number;
  averagePrice?: number; 
  avgPrice?: number;
}

// 추천 조합 아이템 데이터 구조 인터페이스 정의
export interface RecommendedStuff {
  recommendedStuffId: number;
  recommendedStuffName: string;
  recommendedBrandName: string;
  price: number;
  likeCount: number;
  scrapCount: number;
  recommendedImageUrl: string | null;
  averagePrice?: number; // 💰 백엔드 트랜잭션 결과 대응 추가
  avgPrice?: number;     // 💰 백엔드 숏네임 대응 추가
}

export const stuffService = {
  searchStuffs: async (keyword: string): Promise<StuffSuggestion[]> => {
    const response = await axios.get(`${BASE_URL}/api/stuffs/search`, {
      params: { keyword },
    });
    return response.data.result?.stuffs ?? [];
  },

  createStuff: async (data: {
    brandId: number;
    stuffName: string;
    price?: number;
    imageUrl?: string;
  }): Promise<StuffSuggestion> => {
    const response = await axios.post(`${BASE_URL}/api/stuffs`, data);
    return response.data.result;
  },

  findOrCreateStuff: async (stuffName: string): Promise<StuffSuggestion> => {
    const response = await axios.post(`${BASE_URL}/api/stuffs/find-or-create`, {
      stuffName,
    });
    return response.data.data;
  },

  // 특정 상품의 추천 조합 전체 리스트 가져오기
  getRecommendationsByStuff: async (stuffId: number): Promise<{ totalCount: number; stuffs: RecommendedStuff[] }> => {
    try {
      const token = await getToken(); 

      const response = await axios.get(`${BASE_URL}/api/stuffs/${stuffId}/recommendations`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      return response.data.data;
    } catch (error) {
      console.error('추천 조합 상세 리스트 조회 실패:', error);
      throw error;
    }
  },
};