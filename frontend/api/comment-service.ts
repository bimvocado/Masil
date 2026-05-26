import apiClient from './client';

export const commentService = {
  getComments: async (postId: number) => {
    try {
      const response = await apiClient.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('댓글 목록 조회 에러:', error);
      throw error;
    }
  },

  createComment: async (postId: number, data: { content: string; userId: number }) => {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/comments`, data);
      return response.data;
    } catch (error) {
      console.error('댓글 작성 에러:', error);
      throw error;
    }
  },

  updateComment: async (commentId: number, data: { content: string }) => {
    try {
      const response = await apiClient.put(`/api/comments/${commentId}`, data);
      return response.data;
    } catch (error) {
      console.error('댓글 수정 에러:', error);
      throw error;
    }
  },

  deleteComment: async (commentId: number) => {
    try {
      const response = await apiClient.delete(`/api/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('댓글 삭제 에러:', error);
      throw error;
    }
  },
};
