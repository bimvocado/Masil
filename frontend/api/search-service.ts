import apiClient from './client';

export type Category = 'FOOD' | 'HOUSEHOLD';
export type StuffSort = 'LIKE_DESC' | 'DISLIKE_ASC' | 'LATEST';

export const searchService = {
  // 검색창 - 브랜드 리스트 3열
  getBrands: (category: Category) => {
    return apiClient.get('/api/brands', {
      params: { category },
    });
  },

  // 검색창 - 브랜드로 검색
  searchBrands: (keyword: string, category: Category) => {
    return apiClient.get('/api/brands/search', {
      params: { keyword, category },
    });
  },

  // 검색창 - 상품으로 검색
  searchStuffs: (keyword: string, category: Category) => {
    return apiClient.get('/api/stuffs/search', {
      params: { keyword, category },
    });
  },

  // 브랜드창 - 상품 리스트 나열
  getStuffsByBrand: (
    brandId: number,
    sort: StuffSort,
    page: number,
    size: number
  ) => {
    return apiClient.get(`/api/brands/${brandId}/stuffs`, {
      params: { sort, page, size },
    });
  },

  // 상품창 - 상세 페이지 전체
  getStuffDetail: (stuffId: number) => {
    return apiClient.get(`/api/stuffs/${stuffId}/detail`);
  },
};