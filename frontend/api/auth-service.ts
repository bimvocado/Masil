import apiClient from './client'; 
import { tokenStorage } from '@/utils/storage'; // 👈 우리가 만든 웹 호환 저장소 가져오기
import { User } from '@/types/user';

export const BASE_URL = 'http://localhost:3000'; // 필요한 경우 추가

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
      
      const token = response.data.data?.token; 
      if (token) {

        await tokenStorage.saveToken(token);
        console.log("✅ 토큰 저장 완료");
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
  getProfile: async (userId?: number | string) => {
    try {
      // 💡 여기서 apiClient가 내부적으로 토큰을 쓰는지 확인이 필요하지만, 
      // 일단 url 구조 맞춰서 호출합니다.
      const url = userId ? `/api/users/profile/${userId}` : `/api/users/profile`;
      const response = await apiClient.get(url);
      
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

      await tokenStorage.removeToken();
      console.log("✅ 로그아웃: 토큰 삭제 완료");
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  },

  /**
   * 프로필 수정 
   */
  updateProfile: async (formData: FormData) => {
    try {
      const response = await apiClient.patch('/api/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('프로필 수정 에러:', error);
      throw error;
    }
  }
};