import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { ProfileInput } from '@/components/ui/profile-input';
import { authService } from '@/api/auth-service'; // 💡 경로 확인해주세요!
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

  // ✅ 1. 이미지 선택 함수
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('알림', '사진 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0]);
      setProfileImageUrl(result.assets[0].uri); // 프리뷰 즉시 반영
    }
  };

  // ✅ 2. 저장 함수
  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임은 필수입니다.');
      return;
    }

    setIsLoading(true);
    console.log("💾 [디버그] 저장 시도 중...");

    try {
      const formData = new FormData();
      formData.append('nickname', nickname);
      formData.append('bio', bio);
      
      if (newImage) {
        const localUri = newImage.uri;
        
        if (Platform.OS === 'web') {
          const response = await fetch(localUri);
          const blob = await response.blob();
          formData.append('image', blob, 'profile.jpg');
        } else {
          const filename = localUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename || '');
          const type = match ? `image/${match[1]}` : `image/jpeg`;
      
          formData.append('image', {
            uri: localUri,
            name: filename || 'profile.jpg',
            type: type,
          } as any);
        }
      }

      // ✅ 기존 authService 사용하되, multipart 헤더 명시
      const res = await authService.updateProfile(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.success) {
        console.log("✅ 서버 응답 데이터:", res.data);
        setUser(res.data); // Zustand 업데이트
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
          <TouchableOpacity onPress={pickImage}>
            {profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
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
  changePhotoText: { marginTop: 10, color: '#aaa', textAlign: 'center' },
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