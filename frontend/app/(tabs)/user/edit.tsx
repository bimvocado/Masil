import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { ProfileInput } from '@/components/ui/profile-input';
import { authService } from '@/services/auth-service';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/use-auth-store'; 

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [newImage, setNewImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
      setBio(user.bio || '');
      setProfileImageUrl(user.profileImageUrl || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임은 필수입니다.');
      return;
    }

    setIsLoading(true);
    console.log("💾 [디버그] 저장 버튼 눌림!");

    try {
      const formData = new FormData();
      formData.append('nickname', nickname);
      formData.append('bio', bio);
      
      if (newImage) {
        // 웹 브라우저용 이미지 처리 (기존 로직 유지)
        const response = await fetch(newImage.uri);
        const blob = await response.blob();
        formData.append('image', blob, 'profile.jpg');
      }

      console.log("[디버그] 서버로 쏘는 중...");
      
    
      const res = await authService.updateProfile(formData);
      if (res.success) {
        
        setUser(res.data);
        Alert.alert('성공', '프로필이 변경되었습니다.', [
          { text: '확인', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error("❌ [디버그] 저장 에러:", error.response?.data || error.message);
      Alert.alert('오류', '저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <TopBar title="프로필 설정" showBackButton={true} />

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          {profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <TouchableOpacity onPress={() => {/* ImagePicker 로직 */}}>
            <Text style={styles.changePhotoText}>사진 변경</Text>
          </TouchableOpacity>
        </View>
        
        <ProfileInput 
          label="닉네임" 
          value={nickname} 
          onChangeText={setNickname} 
          placeholder="닉네임을 입력하세요"
        />

        <ProfileInput 
          label="계정 설명" 
          value={bio} 
          onChangeText={setBio} 
          multiline 
          placeholder="나를 소개해 보세요"
        />

        <TouchableOpacity 
          style={[styles.saveButton, isLoading && { opacity: 0.5 }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#8DBA7D" />
          ) : (
            <Text style={styles.saveButtonText}>변경사항 저장</Text>
          )}
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