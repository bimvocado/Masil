import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { Ionicons } from '@expo/vector-icons';
import { SettingMenuItem } from '@/components/ui/setting-menu-item';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TopBar title="프로필 설정" showBackButton={true} />

      <View style={styles.content}>
        {/* 검색창 */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#aaa" />
          <TextInput placeholder="설정 검색" style={styles.searchInput} placeholderTextColor="#aaa" />
        </View>

        {/* 메뉴 리스트 */}
        <SettingMenuItem 
            icon="refresh-outline" 
            label="비밀번호 변경" 
            onPress={() => router.push('/user/password-change')} 
        />
        <SettingMenuItem 
            icon="globe-outline" 
            label="국가 및 언어" 
            onPress={() => router.push('/user/language')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 10, paddingHorizontal: 15, height: 40, marginBottom: 30 },
  searchInput: { flex: 1, marginLeft: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 20, padding: 20, marginBottom: 15 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },

});