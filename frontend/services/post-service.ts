import { Post } from '@/types/post';
import apiClient from '@/api/client';
import { BASE_URL } from '@/api/auth-service';
import axios from 'axios';

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
  createPost: async (postData: FormData): Promise<Post> => {
    const response = await apiClient.post('/api/posts', postData, {
      headers: {
        'Content-Type': undefined,
      },
      transformRequest: (data) => data,
    });

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