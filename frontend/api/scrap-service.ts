import apiClient from './client';

export const scrapService = {
  getScrapsByCategory: async (categoryId: number) => {
    try {
      const response = await apiClient.get(`/api/scraps/categories/${categoryId}/posts`);
      return response.data;
    } catch (error) {
      console.error('카테고리별 스크랩 조회 에러:', error);
      throw error;
    }
  },

  createScrap: async (postId: number, data: { userId: number; categoryId: number }) => {
    try {
      const response = await apiClient.post(`/api/scraps/${postId}/scrap`, data);
      return response.data;
    } catch (error) {
      console.error('스크랩 추가 에러:', error);
      throw error;
    }
  },

  deleteScrap: async (postId: number, data: { userId: number }) => {
    try {
      const response = await apiClient.delete(`/api/scraps/${postId}/scrap`, { data });
      return response.data;
    } catch (error) {
      console.error('스크랩 취소 에러:', error);
      throw error;
    }
  },

  getScrapStatus: async (postId: number, userId: number) => {
    try {
      const response = await apiClient.get(`/api/scraps/${postId}/scrap/status`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('스크랩 상태 조회 에러:', error);
      throw error;
    }
  },
};
