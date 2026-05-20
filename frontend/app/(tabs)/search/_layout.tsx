import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'slide_from_right', 
      }}
    >
      {/* 가장바닥 */}
      <Stack.Screen name="index" />
      
      {/* 아래 파일들이 차곡차곡 쌓일 화면들입니다. */}
      <Stack.Screen name="[id]" />
    </Stack>
  );
}