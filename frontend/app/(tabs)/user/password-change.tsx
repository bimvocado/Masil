import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/use-auth-store';

export default function PasswordChangeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
console.log("🔥 지금 스토어 유저 객체 상태:", JSON.stringify(user, null, 2));
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleInputChange = (name: string, value: string) => {
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async () => {
    console.log("1. 버튼 클릭됨");
    const { current, new: newPwd, confirm } = passwords;
    
    // 1. 유효성 검사
    if (!user?.userId) {
      console.log("에러: 유저 ID 없음");
      return alert("로그인 정보가 없습니다.");
    }
    if (!current || !newPwd || !confirm) {
      return alert('모든 필드를 입력해주세요.');
    }
    if (newPwd !== confirm) {
      return alert('새 비밀번호가 일치하지 않습니다.');
    }
    if (newPwd.length < 4) {
      return alert('비밀번호를 4자 이상 입력해주세요.');
    }

    try {
      console.log("2. 서비스 호출 시도", { userId: user.userId });
      const result = await authService.changePassword(user.userId, current, newPwd);
      
      console.log("3. 백엔드 응답 완료:", result);
      
      if (result.success) {
        Alert.alert('성공', '비밀번호가 성공적으로 변경되었습니다.', [
          { text: '확인', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error("4. 서비스 호출 에러:", error);
      const errorMsg = error.response?.data?.message || '비밀번호 변경에 실패했습니다.';
      alert(errorMsg);
    }
  }; // 함수 끝

  return (
    <View style={styles.container}>
      <TopBar title="비밀번호 변경" showBackButton={true} />

      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>현재 비밀번호</Text>
          <TextInput 
            style={styles.underlineInput} 
            secureTextEntry 
            value={passwords.current}
            onChangeText={(v) => handleInputChange('current', v)}
          />

          <Text style={styles.label}>새 비밀번호</Text>
          <TextInput 
            style={styles.underlineInput} 
            secureTextEntry 
            value={passwords.new}
            onChangeText={(v) => handleInputChange('new', v)}
          />

          <Text style={styles.label}>새 비밀번호 확인</Text>
          <TextInput 
            style={styles.underlineInput} 
            secureTextEntry 
            value={passwords.confirm}
            onChangeText={(v) => handleInputChange('confirm', v)}
          />
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={[styles.submitButton, { backgroundColor: '#8DBA7D' }]} 
            onPress={handlePasswordChange}
          >
            <Text style={[styles.submitButtonText, { color: '#fff' }]}>비밀번호 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('고객센터에 문의해주세요.')}>
            <Text style={styles.forgotText}>비밀번호를 까먹으셨나요?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  inputSection: { marginBottom: 50 },
  label: { fontSize: 16, color: '#000', marginBottom: 10, marginTop: 20 },
  underlineInput: { borderBottomWidth: 1, borderBottomColor: '#CCC', paddingVertical: 8, fontSize: 16 },
  buttonSection: { alignItems: 'center', marginTop: 'auto', marginBottom: 50 },
  submitButton: { width: '80%', padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
  submitButtonText: { fontWeight: 'bold' }, 
  forgotText: { color: '#AAA', fontSize: 14 }
});