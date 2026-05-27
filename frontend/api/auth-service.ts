import apiClient from './client'; 
import { saveToken, removeToken } from '@/utils/storage'; // 👈 우리가 만든 웹 호환 저장소 가져오기
import { User } from '@/types/user';

export const BASE_URL = 'http://localhost:3000'; // 필요한 경우 추가

export const authService = {
  /**
   * 로그인 요청
   */
  login: async (loginId: string, password: string) => {
    try {
      const response = await apiClient.post('/api/auth/login', { loginId, password });
      
      // 💡 백엔드가 토큰을 어디에 담아주느냐가 핵심입니다.
      const token = response.data?.token || response.data?.data?.token;
  
      if (token) {
        // 💡 여기서 확실히 저장!
        await saveToken(token); 
        console.log("✅ [성공] 주머니에 토큰 넣음! 값:", token);
      } else {
        console.error("❌ [실패] 서버 응답에 토큰이 없어요! 응답구조:", response.data);
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

      await removeToken();
      console.log("✅ 로그아웃: 토큰 삭제 완료");
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  },

  /**
   * 프로필 수정 
   */
  updateProfile: async (formData: FormData, config?: any) => {
    try {
      const response = await apiClient.patch('/api/users/profile', formData, config); 
      return response.data;
    } catch (error) {
      console.error('프로필 수정 에러:', error);
      throw error;
    }
  } };