import apiClient from './client';

export type BrandCategory = 'FOOD' | 'HOUSEHOLD';
export type StuffSort = 'LIKE_DESC' | 'DISLIKE_ASC' | 'LATEST';

export const searchService = {
  /**
   * 브랜드 검색 / 카테고리별 브랜드 조회
   */
  getBrands: async (keyword: string, category: BrandCategory) => {
    try {
      const response = await apiClient.get('/api/brands/search', {
        params: {
          keyword,
          category,
        },
      });

      return response.data;
    } catch (error) {
      console.error('브랜드 목록 조회 에러:', error);
      throw error;
    }
  },

  /**
   * 브랜드별 상품 목록 조회
   */
  getStuffsByBrand: async (
    brandId: number,
    sort: StuffSort = 'LATEST',
    page: number = 0,
    size: number = 10
  ) => {
    try {
      const response = await apiClient.get(`/api/stuffs/brand/${brandId}`, {
        params: {
          sort,
          page,
          size,
        },
      });

      return response.data;
    } catch (error) {
      console.error('브랜드별 상품 목록 조회 에러:', error);
      throw error;
    }
  },

  /**
   * 상품 상세 조회
   */
  getStuffDetail: async (stuffId: number) => {
    try {
      const response = await apiClient.get(`/api/stuffs/${stuffId}/detail`);

      return response.data;
    } catch (error) {
      console.error('상품 상세 조회 에러:', error);
      throw error;
    }
  },
};