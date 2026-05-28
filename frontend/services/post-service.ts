import { Post } from '@/types/post';
import apiClient from '@/api/client';

export const postService = {
  // 게시글 전체 조회
  getPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get('/api/posts');
    return response.data.data;
  },

  // 사용자별 게시글 조회
  getUserPosts: async (userId: number): Promise<Post[]> => {
    const response = await apiClient.get(`/api/users/${userId}/posts`);
    return response.data.data;
  },

  // 게시글 개별 조회
  getPost: async (postId: number): Promise<Post> => {
    const response = await apiClient.get(`/api/posts/${postId}`);
    return response.data.data;
  },

  // 게시글 등록
  createPost: async (
    postData:
      | FormData
      | {
          content: string;
          imageUrl?: string;
          stuffId: number;
          price?: number;
        },
    config?: any
  ): Promise<Post> => {
    const response = await apiClient.post('/api/posts', postData, config);
    return response.data.data;
  },


  // 게시글 수정
  updatePost: async (
    postId: number,
    postData: {
      content: string;
      imageUrl?: string;
    }
  ): Promise<Post> => {
    const headers = await getAuthHeader();

    const response = await axios.patch(
      `${BASE_URL}/api/posts/${postId}`,
      postData,
      { headers }
    );

    return response.data.data;
  },

  // 게시글 삭제
  deletePost: async (postId: number) => {
    const headers = await getAuthHeader();

    const response = await axios.delete(
      `${BASE_URL}/api/posts/${postId}`,
      { headers }
    );

    return response.data.data;
  },
};