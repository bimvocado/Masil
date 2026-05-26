import { User } from '@/types/user';
import { saveToken, getToken,removeToken } from '@/utils/storage';
console.log("!!!!!!!!!! 나 지금 실행됨 !!!!!!!!!!")
export const BASE_URL = 'http://localhost:3000'; 
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
import apiClient from '../api/client'; 

export const authService = {

  register: async (userData: Partial<User>) => {
    try {
      const response = await apiClient.post('/api/users/signup', userData);
      

      const token = response.data.data?.token || response.data.token;
      if (response.data.success && token) {
        await saveToken(token);
        console.log("✅ 회원가입 성공 및 토큰 저장 완료");
      }
      
      return response.data;
    } catch (error) {
      console.error('회원가입 에러:', error);
      throw error;
    }
  },
  /**
   * 일반 로그인 요청
   */
  login: async (loginId: string, password: string) => {
    try {
      console.log("🚀 [디버그] 로그인 API 호출 시작 (ID: " + loginId + ")");
      const response = await apiClient.post('/api/users/login', { loginId, password });
      
      console.log("📡 [디버그] 서버 응답 도착:", response.data);

      // 💡 여기서 모든 가능성을 다 뒤집니다.
      const token = response.data?.token || 
                    response.data?.data?.token || 
                    response.data?.accessToken;

      if (token) {
        console.log("✅ [디버그] 토큰 찾음! 저장소에 구워버립니다.");
        await saveToken(token); // 👈 여기서 storage.ts의 saveToken 호출
        
        // 🔍 웹 확인용 (여기에 수동으로 한 번 더 박아봅니다)
        if (typeof window !== 'undefined') {
          localStorage.setItem('userToken', token);
          console.log("🛠️ [웹 전용] localStorage에 직접 박기 성공");
        }
      } else {
        console.error("❌ [경고] 서버 응답에 토큰이 아예 없습니다!");
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
      const response = await apiClient.post('/api/auth/google', { code, codeVerifier });
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
      const response = await apiClient.get(`/api/users/profile/${userId}`);
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
      const response = await apiClient.get('/api/users/check-duplicate', {
        params: { type, value } 
      });
      return response.data;
    } catch (error) {
      console.error(`${type} 중복 체크 에러:`, error);
      throw error;
    }
  },


  /**
   * 비밀번호 변경
   */
  changePassword: async (userId: number, currentPassword: string, newPassword: string) => {
    try {
      // 💡 수동으로 getToken 안 해도 인터셉터가 토큰을 알아서 챙겨줍니다.
      const response = await apiClient.patch('/api/users/change-password', {
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
  },
  updateProfile: async (formData: FormData) => {
    try {
      // 💡 여기서 apiClient를 사용하는지 꼭 확인! (상단에 import apiClient 되어있어야 함)
      const response = await apiClient.patch('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('프로필 수정 에러:', error);
      throw error;
    }
  },
};