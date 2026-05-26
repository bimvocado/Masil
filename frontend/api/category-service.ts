import apiClient from './client';

export const categoryService = {
  getCategories: async (userId: number) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/categories`);
      return response.data;
    } catch (error) {
      console.error('카테고리 목록 조회 에러:', error);
      throw error;
    }
  },

  createCategory: async (userId: number, data: { categoryName: string }) => {
    try {
      const response = await apiClient.post(`/api/users/${userId}/categories`, data);
      return response.data;
    } catch (error) {
      console.error('카테고리 생성 에러:', error);
      throw error;
    }
  },

  updateCategory: async (categoryId: number, data: { categoryName: string }) => {
    try {
      const response = await apiClient.put(`/api/users/categories/${categoryId}`, data);
      return response.data;
    } catch (error) {
      console.error('카테고리 수정 에러:', error);
      throw error;
    }
  },

  deleteCategory: async (categoryId: number) => {
    try {
      const response = await apiClient.delete(`/api/users/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('카테고리 삭제 에러:', error);
      throw error;
    }
  },
};
