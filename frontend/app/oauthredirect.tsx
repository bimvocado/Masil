// app/oauthredirect.tsx 파일 내용
import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function OAuthRedirectPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
      router.replace({
      pathname: '/', 
      params: params,
    });
  }, [params]);

  return null;
}