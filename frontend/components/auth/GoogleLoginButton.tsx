import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session'; // 리다이렉트 주소 생성을 위해 필요
import { authStyles as styles } from '@/components/styles/auth';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/use-auth-store';
import { useRouter } from 'expo-router';
import { saveToken } from '@/utils/storage';

// 웹 환경에서 팝업이 닫히도록 도와주는 함수
WebBrowser.maybeCompleteAuthSession();

export function GoogleLoginButton() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    responseType: 'code', 
    
    
    shouldAutoExchangeCode: false, 
    
    redirectUri: AuthSession.makeRedirectUri(),
  });

  React.useEffect(() => {
    if (response) {
      console.log("구글 응답 상태:", response.type);
    }

    // ✅ 변경: response뿐만 아니라 request에 들어있는 codeVerifier가 필요합니다.
    if (response?.type === 'success' && response.params.code) {
      const { code } = response.params;
      const verifier = request?.codeVerifier; // 🔑 Expo가 만든 PKCE 열쇠 추출
      
      console.log("✅ 인가 코드:", code);
      console.log("🔑 검증기(Verifier):", verifier);
      
      handleGoogleLogin(code, verifier); // 두 개 다 보냅니다!
    } 
    
    if (response?.type === 'error') {
      console.error("❌ 구글 인증 에러:", response.error);
    }
  }, [response]);

  const handleGoogleLogin = async (code: string, codeVerifier?: string) => {
    try {
      console.log("🚀 백엔드로 코드와 열쇠 전송 시작...");
      
      const result = await authService.loginWithGoogle(code, codeVerifier);
      
      if (result.success) {
    
        if (result.data.user) {
          setUser(result.data.user); 
          
          await saveToken(result.data.token);
        }

        router.replace('/(tabs)/home');
      }
    } catch (error) {
      console.error("백엔드 로그인 실패:", error);
      Alert.alert('오류', '구글 로그인 처리 중 백엔드 에러가 발생했습니다.');
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', marginTop: 10 }
      ]} 
      onPress={() => promptAsync()}
      disabled={!request}
    >
      <Text style={[styles.buttonText, { color: '#000' }]}>Google로 시작하기</Text>
    </TouchableOpacity>
  );
}