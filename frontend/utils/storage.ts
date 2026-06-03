import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

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
    console.log("🛠️ Storage: 웹 로컬스토리지 토큰 삭제 완료");
  } else {
    await SecureStore.deleteItemAsync('userToken');
    console.log("🛠️ Storage: 모바일 SecureStore 토큰 삭제 완료");
  }
};