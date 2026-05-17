import { Tabs } from 'expo-router';
import { BottomTab } from '@/components/layout/bottom-tab';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home/index"
      tabBar={() => <BottomTab />}
      
      screenOptions={{
        headerShown: false,
      }}
    >

      <Tabs.Screen name="home/index" />
      <Tabs.Screen name="bookmark/index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="plus/index" />
      <Tabs.Screen name="user/index" />
    </Tabs>
  );
}