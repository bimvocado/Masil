import { create } from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.219.102:3000'; 

const apiClient = create({
  baseURL: BASE_URL, 
  timeout: 5000,
});

// 토큰 꺼내기
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;