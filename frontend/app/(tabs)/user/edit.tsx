import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { ProfileInput } from '@/components/ui/profile-input';
import { User } from '@/types/user'; 

export default function ProfileEditScreen() {
  const router = useRouter();

  const [nickname, setNickname] = useState('current_nickname'); // name -> nickname
  const [bio, setBio] = useState('account ddd');
  const [profileImageUrl, setProfileImageUrl] = useState('');


  const handleSave = () => {

    router.back();
  };

  return (
    <View style={styles.container}>
      <TopBar title="프로필 설정" showBackButton={true} />

      <View style={styles.content}>
        {/* 프로필 이미지 변경 */}
        <View style={styles.avatarSection}>
          {profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <TouchableOpacity onPress={() => {/* 이미지 선택 로직 */}}>
            <Text style={styles.changePhotoText}>사진 변경</Text>
          </TouchableOpacity>
        </View>
        
        <ProfileInput 
          label="닉네임" 
          value={nickname} 
          onChangeText={setNickname} 
        />

        {/* 계정 설명 입력 */}
        <ProfileInput 
          label="계정 설명" 
          value={bio} 
          onChangeText={setBio} 
          multiline 
        />

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>변경사항 저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, alignItems: 'center' },
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E0E0E0' },
  avatarImage: { width: 120, height: 120, borderRadius: 60 },
  changePhotoText: { marginTop: 10, color: '#aaa' },
  saveButton: { 
    backgroundColor: '#E8F5E9', 
    width: '100%', 
    padding: 15, 
    borderRadius: 25, 
    alignItems: 'center', 
    marginTop: 20 
  },
  saveButtonText: { color: '#8DBA7D', fontWeight: 'bold' }
});