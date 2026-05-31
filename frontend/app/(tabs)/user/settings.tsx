import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { TopBar } from '@/components/layout/top-bar';
import { Ionicons } from '@expo/vector-icons';
import { SettingMenuItem } from '@/components/ui/setting-menu-item';
import { useLogout } from '@/hooks/use-logout'; 
import { router } from 'expo-router';
import { CommonModal } from '@/components/ui/common-modal';

export default function SettingsScreen() {
  const { 
  modalVisible, 
  handleLogoutPress, 
  closeLogoutModal, 
  confirmLogout 
} = useLogout();

  return (
    <View style={styles.container}>
      <TopBar title="프로필 설정" showBackButton={true} />

      <View style={styles.content}>
        {/* 검색창 */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18}  color="#aaa" />
          <TextInput placeholder="설정 검색" style={styles.searchInput} placeholderTextColor="#aaa" />
        </View>

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

        <TouchableOpacity style={styles.logoutWrapper} onPress={handleLogoutPress}>
          <View style={styles.logoutItem}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <Text style={styles.logoutLabel}>로그아웃</Text>
          </View>
        </TouchableOpacity>
      </View>
      <CommonModal
        visible={modalVisible}
        title="로그아웃"
        message="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        onConfirm={confirmLogout}      
        onCancel={closeLogoutModal}   
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, alignItems: 'center' },
  searchBar: { paddingLeft: 20, width:'90%',flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 20, paddingHorizontal: 15, height: 40, marginBottom: 30 },
  searchInput: { flex: 1, marginLeft: 8 },
  logoutWrapper: { marginTop: 20, width: '90%', },
  logoutItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#FFF5F5', 
    borderRadius: 25, 
    paddingLeft:32,
  },
  logoutLabel: { 
    marginLeft: 15, 
    fontSize: 16, 
    color: '#FF6B6B', 
    fontWeight: '600' ,
    
  },
});