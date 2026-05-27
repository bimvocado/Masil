import { getToken } from '@/utils/storage';
import axios from 'axios'; 

const BASE_URL = 'http://localhost:3000'; 

const apiClient = axios.create({
  baseURL: BASE_URL, 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      console.log("📡 [인터셉터] 전송 직전 토큰 상태:", `|${token}|`); 
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;