import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { authStyles as styles } from '@/components/styles/auth';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/use-auth-store';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export function GoogleLoginButton() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  // .env에 저장한 그 ID를 사용합니다
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
  
      // 💡 여기서 에러가 났던 겁니다. 
      // 아래처럼 조건문으로 감싸서 'undefined'가 아님을 보장해 줘야 해요.
      if (authentication?.accessToken) {
        handleGoogleLogin(authentication.accessToken);
      } else {
        console.warn("구글 토큰이 없습니다.");
      }
    }
  }, [response]);

  const handleGoogleLogin = async (token: string) => {
    try {
      // 백엔드에 구글 토큰 전달 (아까 만든 API 호출)
      const result = await authService.loginWithGoogle(token);
      if (result.success) {
        setUser(result.data);
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      Alert.alert('오류', '구글 로그인 중 문제가 발생했습니다.');
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', marginTop: 10 }]} 
      onPress={() => promptAsync()}
      disabled={!request}
    >
      <Text style={[styles.buttonText, { color: '#000' }]}>Google로 시작하기</Text>
    </TouchableOpacity>
  );
}