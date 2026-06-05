import apiClient from './client'; 
import { saveToken, removeToken } from '@/utils/storage';
import { User } from '@/types/user';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';export const API_URL = BASE_URL;

export const authService = {
 
 login: async (loginId: string, password: string) => {
  try {
    console.log(`[디버그] 로그인 API 호출 시작 (ID: ${loginId})`);
    const response = await apiClient.post('/api/auth/login', { loginId, password });
    
    const token = response.data?.token || 
                  response.data?.data?.token || 
                  response.data?.accessToken;

    if (token) {
      await saveToken(token);
      console.log("[디버그] 네이티브 저장소에 토큰 저장 완료");
    }
    
    return response.data;
  } catch (error) {
    console.error('일반 로그인 에러:', error);
    throw error;
  }
},

  /**
   * 프로필 로드: 
   */
  getProfile: async (userId?: number) => { 
    try {
      const url = userId ? `/api/users/profile/${userId}` : `/api/users/me`;
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('프로필 로딩 에러 (404 발생 시 백엔드 라우터 확인!):', error);
      throw error;
    }
  },

  /**
   * 회원가입
   */
  register: async (userData: Partial<User>) => {
    try {
      const response = await apiClient.post('/api/users/signup', userData);
      const token = response.data.data?.token || response.data.token;
      if (token) await saveToken(token);
      return response.data;
    } catch (error) {
      console.error('회원가입 에러:', error);
      throw error;
    }
  },

  /**
   * 중복 확인
   */
  checkDuplicate: async (type: 'loginId' | 'email', value: string) => {
    try {
      const response = await apiClient.get('/api/users/check-duplicate', {
        params: { type, value } 
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`${type} 중복 체크 에러:`, error);
      throw error;
    }
  },

  /**
   * 프로필 수정
   */
  updateProfile: async (formData: FormData, config?: any) => { // 👈 config?: any 추가
    try {
      const response = await apiClient.patch('/api/users/profile', formData, {
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error('프로필 수정 에러:', error);
      throw error;
    }
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (userId: number, currentPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.patch('/api/users/change-password', {
        userId, currentPassword, newPassword
      });
      return response.data;
    } catch (error) {
      console.error('비밀번호 변경 에러:', error);
      throw error;
    }
  },

  /**
   * 구글 로그인
   */
loginWithGoogle: async (idToken: string) => {
    try {
      // 🚨 백엔드가 req.body에서 { idToken } 을 꺼내서 verifyIdToken을 하므로 키값을 똑같이 맞춰줍니다!
      const response = await apiClient.post('/api/auth/google', { idToken }); 
      return response.data;
    } catch (error) {
      console.error('구글 로그인 에러:', error);
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  logout: async () => {
    await removeToken();
    console.log("로그아웃 완료");
  },
};