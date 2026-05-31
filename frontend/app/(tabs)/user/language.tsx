import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { TopBar } from '@/components/layout/top-bar';
import apiClient from '@/api/client';
import { useFocusEffect, useRouter } from 'expo-router';

const COUNTRIES = [
  { id: 'KR', name: '대한민국(South Korea)' },
  { id: 'US', name: '미국(USA)' },
  { id: 'JP', name: '일본(Japan)' },
  { id: 'VN', name: '베트남(Vietnam)' },
];

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('대한민국(South Korea)');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 💡 1. 화면에 들어올 때마다 서버에서 최신 국가 정보 가져오기
 useFocusEffect(
    useCallback(() => {
      console.log("📱 [프론트] 화면 포커스됨!");
      
      const fetchCurrentCountry = async () => {
        try {
          setFetching(true); // 1. 로딩 시작
          const res = await apiClient.get('/api/users/profile');
          
          if (res.data.data.country) {
            setSelectedCountry(res.data.data.country);
          }
        } catch (e) {
          console.log('현재 설정 로드 실패:', e);
        } finally {
          setFetching(false); // 2. 성공하든 실패하든 로딩 끝내기 (이게 빠지면 무한로딩!)
        }
      };

      fetchCurrentCountry();
    }, [])
  );

  // 💡 2. 국가 저장 로직
  const handleConfirm = async () => {
    setLoading(true);
    try {
      // 서버에 PATCH 요청 (is_korean은 백엔드에서 알아서 계산함!)
      await apiClient.patch('/api/users/profile', {
        country: selectedCountry
      });
      
      Alert.alert("알림", "국가 설정이 저장되었습니다.", [
        { text: "확인", onPress: () => router.back() } // 저장 후 이전 화면으로 이동
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FF8A00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="국가 설정" showBackButton={true} />

      <View style={styles.content}>
        <Text style={styles.label}>현재 거주/활동 국가</Text>
        
        <TouchableOpacity 
          style={styles.selectBox} 
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.selectText}>{selectedCountry}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>
          * 설정하신 국가에 따라 상품 반응 통계가 다르게 집계될 수 있습니다.
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.confirmButton, loading && { backgroundColor: '#ccc' }]}
        onPress={handleConfirm}
        disabled={loading}
      >
        <Text style={styles.confirmButtonText}>
          {loading ? '저장 중...' : '확인'}
        </Text>
      </TouchableOpacity>

      {/* 국가 선택 모달 */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>국가 선택</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.countryItem}
                  onPress={() => {
                    setSelectedCountry(item.name);
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.countryText, 
                    selectedCountry === item.name && { color: '#FF8A00', fontWeight: 'bold' }
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setIsModalVisible(false)}
            >
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, flex: 1 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fafafa',
  },
  selectText: { fontSize: 16, color: '#000' },
  arrow: { color: '#888' },
  infoText: { marginTop: 15, color: '#888', fontSize: 13, lineHeight: 18 },
  confirmButton: {
    margin: 20,
    backgroundColor: '#FF8A00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', width: '80%', borderRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  countryItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  countryText: { fontSize: 16, textAlign: 'center' },
  closeButton: { marginTop: 15, alignItems: 'center', padding: 10 },
});