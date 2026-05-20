import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'slide_from_right', 
      }}
    >
      {/* index는 마이페이지 메인입니다. 가장 바닥에 깔리는 종이예요. */}
      <Stack.Screen name="index" />
      
      {/* 아래 파일들이 차곡차곡 쌓일 화면들입니다. */}
      <Stack.Screen name="edit" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="password-change" />
      <Stack.Screen name="language" />
    </Stack>
  );
}