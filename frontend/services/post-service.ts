import { Post } from '@/types/post';
import apiClient from '@/api/client';

export const postService = {
  // 게시글 전체 조회 (필요하면 stuffId로 필터링 가능)
  getPosts: async (userId?: number, stuffId?: number): Promise<Post[]> => {
    const params = new URLSearchParams();
    if (typeof stuffId === 'number') params.append('stuffId', String(stuffId));
    const query = params.toString();
    const response = await apiClient.get(`/api/posts${query ? `?${query}` : ''}`);
    return response.data.data;
  },

  // 사용자별 게시글 조회
  getUserPosts: async (userId: number, viewerId?: number): Promise<Post[]> => {
    const query = viewerId ? `?viewerId=${viewerId}` : '';
    const response = await apiClient.get(`/api/users/${userId}/posts${query}`);
    return response.data.data;
  },

  // 게시글 개별 조회
  getPost: async (postId: number, viewerId?: number): Promise<Post> => {
    const query = viewerId ? `?viewerId=${viewerId}` : '';
    const response = await apiClient.get(`/api/posts/${postId}${query}`);
    return response.data.data;
  },

  // 게시글 등록
  createPost: async (postData: FormData): Promise<Post> => {
    const response = await apiClient.post('/api/posts', postData);
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
    const response = await apiClient.patch(`/api/posts/${postId}`, postData);
    return response.data.data;
  },

  // 게시글 삭제
  deletePost: async (postId: number) => {
    const response = await apiClient.delete(`/api/posts/${postId}`);
    return response.data.data;
  },
};