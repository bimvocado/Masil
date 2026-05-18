import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { ProfileInput } from '@/components/ui/profile-input';
export default function ProfileEditScreen() {
  const router = useRouter();
  const [name, setName] = useState('current_name');
  const [bio, setBio] = useState('accont ddd');

  return (
    <View style={styles.container}>
      <TopBar title="프로필 설정" showBackButton={true} />

      <View style={styles.content}>
        {/* 프로필 이미지 변경 */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder} />
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>사진 변경</Text>
          </TouchableOpacity>
        </View>

        {/* 이름 입력 */}
        <ProfileInput label="이름" value={name} onChangeText={setName} />

        {/* 계정 설명 입력 */}
        <ProfileInput label="계정 설명" value={bio} onChangeText={setBio} multiline />

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
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
  changePhotoText: { marginTop: 10, color: '#aaa' },
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#E8F5E9', width: '100%', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#8DBA7D', fontWeight: 'bold' }
});