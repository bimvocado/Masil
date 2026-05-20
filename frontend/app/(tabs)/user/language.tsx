import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TopBar } from '@/components/layout/top-bar';

export default function LanguageSettingsScreen() {
  return (
    <View style={styles.container}>
      <TopBar title="국가 및 언어" showBackButton={true} />

      <View style={styles.content}>
        {/* 국가 선택 */}
        <View style={styles.section}>
          <Text style={styles.label}>국가 선택</Text>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>대한민국(South Korea)</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>한국거주자 인증하기</Text>
        </View>

        {/* 언어 선택 */}
        <View style={styles.section}>
          <Text style={styles.label}>언어 선택</Text>
          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>한글(Korean)</Text>
          </TouchableOpacity>
        </View>

        {/* 확인 버튼 */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  section: { marginBottom: 40 },
  label: { fontSize: 18, fontWeight: '500', marginBottom: 15 },
  selectBox: { borderWidth: 1, borderColor: '#DDD', borderRadius: 5, padding: 15 },
  selectText: { fontSize: 16, textAlign: 'center' },
  helperText: { textAlign: 'right', color: '#CCC', fontSize: 12, marginTop: 5 },
  buttonSection: { marginTop: 'auto', marginBottom: 50, alignItems: 'center' },
  confirmButton: { backgroundColor: '#F1F8E9', width: '80%', padding: 15, borderRadius: 25, alignItems: 'center' },
  confirmButtonText: { color: '#C5E1A5', fontWeight: 'bold' }
});