import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// 💡 객체 통째로 말고, 함수 하나하나를 내보냅니다.
export const getToken = async () => {
  if (Platform.OS === 'web') {
    const token = localStorage.getItem('userToken');
    console.log("🛠️ Storage: 웹 로컬스토리지 토큰:", token ? "있음" : "없음");
    return token;
  } 
  return await SecureStore.getItemAsync('userToken');
};

export const saveToken = async (value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem('userToken', value);
  } else {
    await SecureStore.setItemAsync('userToken', value);
  }
};

export const removeToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem('userToken');
  } else {
    await SecureStore.deleteItemAsync('userToken');
  }
};