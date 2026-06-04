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
        // Ensure axios does not set an incorrect Content-Type without boundary
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
      console.log('📡 [인터셉터] FormData 전송, headers after cleanup:', config.headers);
    }

    // Debug: log request basics for multipart failures
    try {
      if (config && config.url) {
        console.log(`📡 [요청] ${config.method?.toUpperCase()} ${config.url} dataType=${Object.prototype.toString.call(config.data)}`);
      }
    } catch (e) {
      // ignore
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;