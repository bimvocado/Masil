import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';

export default function PasswordChangeScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <TopBar title="비밀번호 변경" showBackButton={true} />

      <View style={styles.content}>
        {/* 입력 필드들 - 밑줄 스타일 */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>현재 비밀번호</Text>
          <TextInput style={styles.underlineInput} secureTextEntry />

          <Text style={styles.label}>새 비밀번호</Text>
          <TextInput style={styles.underlineInput} secureTextEntry />

          <Text style={styles.label}>새 비밀번호 확인</Text>
          <TextInput style={styles.underlineInput} secureTextEntry />
        </View>

        {/* 하단 버튼 영역 */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>비밀번호 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity>
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
  submitButton: { backgroundColor: '#F1F8E9', width: '80%', padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 15 },
  submitButtonText: { color: '#C5E1A5', fontWeight: 'bold' }, // 시안의 연한 연두색
  forgotText: { color: '#AAA', fontSize: 14 }
});