import axios from 'axios';
import { User } from '@/types/user';


const BASE_URL = 'http://192.168.219.102:3000'; 



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