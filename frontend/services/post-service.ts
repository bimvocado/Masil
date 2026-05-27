import axios from 'axios';
import { Post } from '@/types/post';
import { getToken } from '@/utils/storage';

const BASE_URL = 'http://localhost:3000';

const getAuthHeader = async () => {
  const token = await getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

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
    const headers = await getAuthHeader();

    const response = await axios.post(
      `${BASE_URL}/api/posts`,
      postData,
      { headers }
    );

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