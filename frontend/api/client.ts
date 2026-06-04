import { getToken } from '@/utils/storage';
import axios from 'axios'; 

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      console.log("📡 [인터셉터] 전송 직전 토큰 상태:", `|${token}|`);
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;