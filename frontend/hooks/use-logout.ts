import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/use-auth-store';
import { Alert, Platform } from 'react-native';

export const useLogout = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    const startLogout = async () => {
      try {
        await logout(); 
        router.replace('/');
      } catch (error) {
        console.error('로그아웃 에러:', error);
      }
    };
  
    // 웹(맥) 테스트용
    if (Platform.OS === 'web') {
      if (window.confirm("정말 로그아웃 하시겠습니까?")) {
        console.log("2. 웹 확인 누름");
        startLogout();
      }
    } else {
      // 앱용
      Alert.alert(
        '로그아웃',
        '정말 로그아웃 하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { text: '확인', style: 'destructive', onPress: startLogout }
        ]
      );
    }
  };

  return { handleLogout };
};