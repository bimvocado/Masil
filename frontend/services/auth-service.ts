import axios from 'axios';
import { User } from '@/types/user';
import { saveToken, getToken,removeToken } from '@/utils/storage';
import { Platform } from 'react-native';
console.log("!!!!!!!!!! 나 지금 실행됨 !!!!!!!!!!")
export const BASE_URL = 'http://localhost:3000'; 
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
import apiClient from '../api/client'; // 👈 직접 만든 axios 인스턴스 (인터셉터 포함)

export const authService = {
  /**
   * 일반 로그인 요청
   */
  login: async (loginId: string, password: string) => {
    try {
      const response = await apiClient.post('/users/login', { loginId, password });
      // 백엔드 구조에 맞춰서 토큰 추출 (보통 response.data.data.token)
      const token = response.data.data?.token || response.data.token;
      if (response.data.success && token) {
        await saveToken(token);
      }
      return response.data;
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  },

  /**
   * 구글 로그인 요청 (코드 살려두기)
   */
  loginWithGoogle: async (code: string, codeVerifier?: string) => {
    try {
      const response = await apiClient.post('/auth/google', { code, codeVerifier });
      const token = response.data.data?.token || response.data.token;
      if (response.data.success && token) {
        await saveToken(token);
      }
      return response.data;
    } catch (error) {
      console.error('구글 로그인 에러:', error);
      throw error;
    }
  },

  /**
   * 프로필 로드 (💡 이제 토큰 수동으로 안 꺼내도 됨!)
   */
  getProfile: async (userId: number) => {
    try {
      // apiClient를 쓰면 인터셉터가 알아서 헤더에 토큰을 실어줍니다.
      const response = await apiClient.get(`/users/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('프로필 로딩 에러:', error);
      throw error;
    }
  },

  /**
   * 중복 확인 요청
   */
  checkDuplicate: async (type: 'loginId' | 'email', value: string) => {
    try {
      const response = await apiClient.get('/users/check-duplicate', {
        params: { type, value } 
      });
      return response.data;
    } catch (error) {
      console.error(`${type} 중복 체크 에러:`, error);
      throw error;
    }
  },

  /**
   * 회원가입 요청
   */
  register: async (userData: Partial<User>) => {
    try {
      const response = await apiClient.post('/users/signup', userData);
      return response.data;
    } catch (error) {
      console.error('회원가입 에러:', error);
      throw error;
    }
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (userId: number, currentPassword: string, newPassword: string) => {
    try {
      // 💡 수동으로 getToken 안 해도 인터셉터가 토큰을 알아서 챙겨줍니다.
      const response = await apiClient.patch('/users/change-password', {
        userId,
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('비밀번호 변경 에러:', error);
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    await removeToken();
  }
};