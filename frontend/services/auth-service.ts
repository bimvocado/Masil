import axios from 'axios';
import { User } from '@/types/user';
import { saveToken, getToken } from '@/utils/storage';
import { Platform } from 'react-native';
console.log("!!!!!!!!!! 나 지금 실행됨 !!!!!!!!!!")
export const BASE_URL = 'http://localhost:3000'; 
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const authService = {
  /**
   * 일반 로그인 요청
   */
  login: async (loginId: string, password: string): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        loginId,
        password,
      });

      // ✅ 일반 로그인 성공 시 토큰 저장
      if (response.data.success && response.data.token) {
        await saveToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  },

  /**
   * 구글 로그인 요청
   */
  loginWithGoogle: async (code: string, codeVerifier?: string) => {
    console.log("🚀 [디버그] 구글 로그인 시작. code 존재 여부:", !!code);
    try {
      const response = await axios.post(`${API_URL}/auth/google`, {
        code,          
        codeVerifier   
      });

      if (response.data.success && response.data.token) {
        console.log("💾 [디버그] 백엔드 토큰 수신 성공. 저장 시도...");
        await saveToken(response.data.token);
        console.log("✅ [디버그] 토큰 저장 완료");
      }

      return response.data; 
    } catch (error) {
      console.error('🚨 [디버그] 구글 로그인 통신 에러:', error);
      throw error;
    }
  },

  /**
   * 프로필 로드 (토큰을 꺼내서 헤더에 실어 보냅니다)
   */
  getProfile: async (userId: number) => {
    // 터미널에 강제로 찍히게 하려면 에러를 던지기 전에 명시적으로 확인
    console.log("🔥 터미널/브라우저 동시 확인용 로그: getProfile 실행됨!");
    if (Platform.OS === 'web') {
      console.warn("현재 웹 환경입니다. LocalStorage를 사용해야 합니다.");
    }
  
    try {
      const token = await getToken(); 
      // 만약 여기서 에러가 난다면 tokenStorage 내부가 범인입니다.
      
      const response = await axios.get(`${BASE_URL}/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      // 💡 이 로그가 터미널이나 브라우저 콘솔 어디든 찍혀야 합니다.
      console.error('🔥 [필독] 여기서 에러 발생:', error.message);
      throw error;
    }
  },

  /**
   * 중복 확인 요청
   */
  checkDuplicate: async (type: 'loginId' | 'email', value: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/check-duplicate`, {
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
      const response = await axios.post(`${BASE_URL}/api/users/signup`, userData);
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
      const token = await getToken();
      const response = await axios.patch(`${BASE_URL}/api/users/change-password`, {
        userId,
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};