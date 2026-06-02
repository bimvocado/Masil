import React from 'react';
import { TouchableOpacity, Text, Alert, View, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import Svg, { Path } from 'react-native-svg'; 
import { useAuthStore } from '@/store/use-auth-store';
import { useRouter } from 'expo-router';
import { authService } from '@/api/auth-service';
import { saveToken } from '@/utils/storage';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export function GoogleLoginButton() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [request, response, promptAsync] = Google.useAuthRequest({
  redirectUri: makeRedirectUri({
    scheme: 'frontend',
    preferLocalhost: true
  }),

  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
});

  React.useEffect(() => {
    if (response?.type === 'success' && response.params.code) {
      const { code } = response.params;
      const verifier = request?.codeVerifier;
      handleGoogleLogin(code, verifier);
    }
  }, [response]);

  const handleGoogleLogin = async (code: string, codeVerifier?: string) => {
    try {
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
      Alert.alert('오류', '구글 로그인 중 에러가 발생했습니다.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.gsiMaterialButton}
      onPress={() => promptAsync()}
      disabled={!request}
      activeOpacity={0.7}
    >
      <View style={styles.gsiMaterialButtonContentWrapper}>
        {/* 구글 G 로고 SVG */}
        <View style={[styles.gsiMaterialButtonIcon,]}>
          <Svg viewBox="0 0 48 48" width={20} height={20}>
            <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </Svg>
        </View>
        <Text style={styles.gsiMaterialButtonContents}>Sign in with Google</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gsiMaterialButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#747775',
    borderRadius: 20, 
    height: 40,
    width: '88%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  gsiMaterialButtonContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  gsiMaterialButtonIcon: {
    marginRight: 12,
  },
  gsiMaterialButtonContents: {
    color: '#1F1F1F',
    fontSize: 14,
    fontWeight: '500', // Medium
    letterSpacing: 0.25,
  },
});