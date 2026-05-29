import apiClient from './client';

export const commentService = {

  getComments: async (postId: number) => {
    const response = await apiClient.get(`/api/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (postId: number, data: { text: string; userId: number }) => {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/comments`, data);
      return response.data;
    } catch (error) {
      console.error('댓글 작성 에러:', error);
      throw error;
    }
  },

   updateComment: async (commentId: number, data: { text: string }) => {
    try {
      const response = await apiClient.put(`/api/comments/${commentId}`, data);
      return response.data;
    } catch (error) {
      console.error('댓글 수정 에러:', error);
      throw error;
    }
  },

  // 4. 댓글 삭제
  deleteComment: async (commentId: number) => {
    console.log(" 삭제 시도 ID:", commentId);
    try {
      const response = await apiClient.delete(`/api/comments/${commentId}`);
      console.log("삭제 성공!");
      return response.data;
    } catch (error: any) {
      console.error("삭제 에러:", error.message);
      throw error;
    }
  }
};