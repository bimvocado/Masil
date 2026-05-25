import apiClient from './client'; 
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types/user';

export const authService = {
  /**
   * 로그인 요청
   */
  login: async (loginId: string, password: string): Promise<any> => { 
    try {
      const response = await apiClient.post('/api/users/login', {
        loginId,
        password,
      });
      
      // 로그인 성공 시 토큰 암호화 저장
      const token = response.data.data?.token; 
      if (token) {
        await SecureStore.setItemAsync('userToken', token);
      }

      return response.data;
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  },

  /**
   * 회원가입 요청
   */
  register: async (userData: Partial<User>) => {
    try {
      const response = await apiClient.post('/api/users/signup', userData);
      return response.data;
    } catch (error) {
      console.error('회원가입 에러:', error);
      throw error;
    }
  },

  /**
   * 프로필 로드
   */
  getProfile: async (userId: number) => {
    try {
      const response = await apiClient.get(`/api/users/profile/${userId}`);
      return response.data; 
    } catch (error) {
      console.error('프로필 로딩 에러:', error);
      throw error;
    }
  },
  
  /**
   * 로그아웃
   */
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('userToken'); // 토큰 파쇄!
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  }
};