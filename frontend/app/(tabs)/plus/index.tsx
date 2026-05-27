import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { styles } from '@/components/styles/plus';
import { Colors } from '@/constants/colors';
import { postService } from '@/services/post-service';
import { stuffService, StuffSuggestion } from '@/services/stuff-service';
import { searchService } from '@/api/search-service';
import { TopBar } from '@/components/layout/top-bar';

export default function PlusScreen() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [brandName, setBrandName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [isBrandModalVisible, setIsBrandModalVisible] = useState(false);
  const [brandQuery, setBrandQuery] = useState('');
  const [brandResults, setBrandResults] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [price, setPrice] = useState<string>('');
  const [brandCategory, setBrandCategory] = useState<'FOOD' | 'HOUSEHOLD'>('FOOD');

  const [stuffId, setStuffId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<StuffSuggestion[]>([]);

  const handleBackPress = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.push('/(tabs)/home' as Href);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('알림', '이미지 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (isBrandModalVisible) {
      // 모달 열릴 때 해당 카테고리의 모든 브랜드 로드
      const loadBrands = async () => {
        try {
          const res = await searchService.getBrands('', brandCategory);
          setBrandResults(res.data || []);
        } catch (e) {
          console.error('브랜드 로드 실패:', e);
          setBrandResults([]);
        }
      };
      loadBrands();
    }
  }, [isBrandModalVisible, brandCategory]);

  const handleStuffNameChange = async (value: string) => {
    setBrandName(value);
    setStuffId(null);
    // selectedBrandId는 초기화하지 않음 — 브랜드 선택 후 상품명 입력 시 브랜드가 사라지는 버그 방지

    const keyword = value.replace('@', '').trim();

    if (!keyword) {
      setSuggestions([]);
      return;
    }

    try {
      const result = await stuffService.searchStuffs(keyword);
      setSuggestions(result);
    } catch (error) {
      console.error('상품 자동완성 검색 실패:', error);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (item: StuffSuggestion) => {
    setBrandName(`@${item.stuffName}`);
    setStuffId(item.stuffId);
    setSuggestions([]);
  };

  const handleNext = async () => {
    try {
      const cleanName = brandName.replace('@', '').trim();

      if (!cleanName) {
        Alert.alert('알림', '상품명을 입력해주세요.');
        return;
      }

      if (!selectedBrandId) {
        Alert.alert('알림', '브랜드를 먼저 선택해주세요. 좌측 원을 눌러 브랜드를 선택하세요.');
        return;
      }

      // 먼저 같은 이름의 상품이 있는지 조회
      const searchResult = await stuffService.searchStuffs(cleanName);
      const existing = searchResult.find((s: any) => s.stuffName === cleanName && s.brandId === selectedBrandId);

      if (existing) {
        setStuffId(existing.stuffId);
        setBrandName(`@${existing.stuffName}`);
        setSelectedBrandName(selectedBrandName || '');
        setSuggestions([]);
        setStep(2);
        return;
      }

      // 없으면 새로 생성 (가격 포함)
      const priceValue = Number(price) || 0;
      const created = await stuffService.createStuff({
        brandId: selectedBrandId,
        stuffName: cleanName,
        price: priceValue,
      });

      setStuffId(created.stuffId);
      setBrandName(`@${created.stuffName}`);
      setSelectedBrandName(created.brandName || selectedBrandName || '');
      setSuggestions([]);
      setStep(2);
    } catch (error: any) {
      console.error('상품 확인 실패:', error);
      Alert.alert('오류', error.response?.data?.message || '상품 확인에 실패했습니다.');
    }
  };

  // 업로드 완료 후 폼 전체 초기화
  const resetForm = () => {
    setStep(1);
    setBrandName('');
    setSelectedBrandId(null);
    setSelectedBrandName('');
    setBrandQuery('');
    setBrandResults([]);
    setContent('');
    setImageUri(null);
    setPrice('');
    setStuffId(null);
    setSuggestions([]);
  };

  const handleUpload = async () => {
    try {
      if (!stuffId) {
        Alert.alert('알림', '상품을 먼저 선택해주세요.');
        return;
      }

      if (!content.trim()) {
        Alert.alert('알림', '소개글을 작성해주세요.');
        return;
      }

      const result = await postService.createPost({
        content,
        imageUrl: imageUri ?? undefined,
        stuffId,
      });

      console.log('게시글 등록 성공:', result);

      // 성공 후 즉시 폼 초기화 (다시 + 탭 열었을 때 빈 화면으로 시작)
      resetForm();

      Alert.alert('성공', '게시글이 등록되었습니다.');
      router.push('/(tabs)/home' as Href);
    } catch (error: any) {
      console.error('게시글 등록 실패:', error);
      Alert.alert('오류', error.response?.data?.message || '게시글 등록에 실패했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TopBar title="게시물 업로드" onBackPress={handleBackPress} />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
        >
          {step === 1 ? (
            <>
              <TouchableOpacity style={styles.imageUploadCard} onPress={handlePickImage}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('@/assets/icons/search.png')}
                    style={styles.imageIconPlaceHolder}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>

              <View style={styles.userInfoCard}>
                <TouchableOpacity onPress={() => setIsBrandModalVisible(true)}>
                  <View style={styles.avatarPlaceholder} />
                </TouchableOpacity>
                <View style={styles.nameInputWrapper}>
                  <TextInput
                    placeholder="@이름 작성"
                    placeholderTextColor={Colors.gray.light}
                    style={styles.nameInput}
                    value={brandName}
                    onChangeText={handleStuffNameChange}
                  />
                </View>
              </View>

              <Modal visible={isBrandModalVisible} animationType="slide">
                <View style={{ flex: 1, padding: 20 }}>
                  {/* 카테고리 토글 */}
                  <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => setBrandCategory('FOOD')}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        backgroundColor: brandCategory === 'FOOD' ? Colors.masil.button : '#eee',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: brandCategory === 'FOOD' ? '#fff' : '#333', fontWeight: '600' }}>
                        음식
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setBrandCategory('HOUSEHOLD')}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 8,
                        backgroundColor: brandCategory === 'HOUSEHOLD' ? Colors.masil.button : '#eee',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: brandCategory === 'HOUSEHOLD' ? '#fff' : '#333', fontWeight: '600' }}>
                        물건
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* 검색 입력 */}
                  <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                    <TextInput
                      placeholder="브랜드 검색"
                      value={brandQuery}
                      onChangeText={setBrandQuery}
                      style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8 }}
                    />
                    <TouchableOpacity
                      onPress={async () => {
                        try {
                          const res = await searchService.getBrands(brandQuery || '', brandCategory);
                          setBrandResults(res.data || []);
                        } catch (e) {
                          console.error(e);
                          setBrandResults([]);
                        }
                      }}
                      style={{ marginLeft: 8, justifyContent: 'center', paddingHorizontal: 12, backgroundColor: Colors.masil.button, borderRadius: 8 }}
                    >
                      <Text style={{ color: '#fff' }}>찾기</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView>
                    {brandResults.map((b) => (
                      <TouchableOpacity key={b.brandId} style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }} onPress={() => {
                        setSelectedBrandId(b.brandId);
                        setSelectedBrandName(b.brandName);
                        setIsBrandModalVisible(false);
                      }}>
                        <Text>{b.brandName}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity onPress={() => setIsBrandModalVisible(false)} style={{ marginTop: 12, padding: 12, alignItems: 'center' }}>
                    <Text>닫기</Text>
                  </TouchableOpacity>
                </View>
              </Modal>

              {suggestions.length > 0 && (
                <View style={{ backgroundColor: '#fff', borderRadius: 12, marginTop: 8, padding: 8 }}>
                  {suggestions.map((item) => (
                    <TouchableOpacity
                      key={item.stuffId}
                      onPress={() => handleSelectSuggestion(item)}
                      style={{ paddingVertical: 10 }}
                    >
                      <Text>{`@${item.stuffName}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 6, color: Colors.gray.dark }}>가격 (선택, 신규 생성 시 사용)</Text>
                <TextInput
                  placeholder="예: 12000"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                  style={{ borderWidth: 1, borderColor: '#eee', padding: 8, borderRadius: 8 }}
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
                <Text style={styles.submitButtonText}>다음</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.userInfoCard}>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.nameInputWrapper}>
                  <TextInput
                    placeholder="@이름 작성"
                    placeholderTextColor={Colors.gray.light}
                    style={styles.nameInput}
                    value={brandName}
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.contentUploadCard}>
                <View style={styles.contentInputBox}>
                  <TextInput
                    placeholder="소개글을 작성해주세요"
                    placeholderTextColor="#999"
                    style={styles.contentInput}
                    multiline
                    value={content}
                    onChangeText={setContent}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleUpload}>
                <Text style={styles.submitButtonText}>업로드</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}