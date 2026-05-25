import axios from 'axios';
import { User } from '@/types/user';


const BASE_URL = 'http://localhost:3000'; 



export const authService = {
  /**
   * 로그인 요청
   * @param loginId 유저 아이디
   * @param password 유저 비밀번호
   */
  login: async (loginId: string, password: string): Promise<any> => { // User 대신 any로 우선 변경
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, {
        loginId,
        password,
      });
      return response.data; // 이제 { success: true, data: ... } 가 통째로 나감
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  },

   /**
   * 중복 확인 요청
   * @param type 'loginId' | 'email'
   * @param value 확인할 값
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
      console.log('실제 요청 보내는 주소:', `${BASE_URL}/api/users/signup`); // 👈 주소 확인용
      const response = await axios.post(`${BASE_URL}/api/users/signup`, userData, {
        timeout: 5000 // 👈 5초 지나면 에러 뱉게 강제 설정
      });
      console.log('백엔드 응답 도착:', response.data); // 👈 응답 확인용
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('상세 에러 정보:', error.response?.status, error.message);
      }
      throw error;
    }
  },


  /**
   * 프로필로드
   */
  getProfile: async (userId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/profile/${userId}`);
      return response.data; 
    } catch (error) {
      console.error('프로필 로딩 에러:', error);
      throw error;
    }
  }


};