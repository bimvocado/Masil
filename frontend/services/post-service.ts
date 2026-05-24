import axios from 'axios';
import { Post } from '@/types/post';

// const BASE_URL = 'http://192.168.219.102:3000';
const BASE_URL = 'http://localhost:3000';

export const postService = {
  // 게시글 전체 조회
  getPosts: async (): Promise<Post[]> => {
    const response = await axios.get(`${BASE_URL}/api/posts`);
    return response.data.data;
  },

  // 게시글 개별 조회
  getPost: async (postId: number): Promise<Post> => {
    const response = await axios.get(`${BASE_URL}/api/posts/${postId}`);
    return response.data.data;
  },

  // 게시글 등록
  createPost: async (postData: {
    content: string;
    imageUrl?: string;
    stuffId: number;
  }): Promise<Post> => {
    const response = await axios.post(`${BASE_URL}/api/posts`, postData);
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
    const response = await axios.patch(`${BASE_URL}/api/posts/${postId}`, postData);
    return response.data.data;
  },

  // 게시글 삭제
  deletePost: async (postId: number) => {
    const response = await axios.delete(`${BASE_URL}/api/posts/${postId}`);
    return response.data.data;
  },
};