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

const BASE_URL = 'http://localhost:3000';

const getImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

export default function PlusScreen() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [brandName, setBrandName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedBrandName, setSelectedBrandName] = useState('');

  // 브랜드 이미지
  const [selectedBrandLogoUrl, setSelectedBrandLogoUrl] = useState('');
  
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
      // const loadBrands = async () => {
      //   try {
      //     const res = await searchService.getBrands('', brandCategory);
      //     setBrandResults(res.data || []);
      //   } catch (e) {
      //     console.error('브랜드 로드 실패:', e);
      //     setBrandResults([]);
      //   }
      // };

      // 수정!
      const loadBrands = async () => {
        try {
          const res = brandQuery.trim()
            ? await searchService.searchBrands(brandQuery, brandCategory)
            : await searchService.getBrands(brandCategory);

          setBrandResults(res.data?.result?.brands ?? []);
        } catch (e) {
          console.error('브랜드 로드 실패:', e);
          setBrandResults([]);
        }
      };
      loadBrands();
    }
  // }, [isBrandModalVisible, brandCategory]);
  }, [isBrandModalVisible, brandCategory, brandQuery]);

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
      setSuggestions(result ?? []);
    } catch (error) {
      console.error('상품 자동완성 검색 실패:', error);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (item: StuffSuggestion) => {
    setBrandName(`@${item.stuffName}`);
    setStuffId(item.stuffId);

    setPrice(
      item.averagePrice !== undefined && item.averagePrice !== null
      ? String(Math.round(item.averagePrice))
      : item.price !== undefined && item.price !== null
        ? String(item.price)
        : ''
  );
  
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
    setSelectedBrandLogoUrl('');
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

      const formData = new FormData();
      formData.append('content', content);
      formData.append('stuffId', String(stuffId));
      formData.append('price', price);

      if (imageUri) {
        if (Platform.OS === 'web') {
          const response = await fetch(imageUri);
          const blob = await response.blob();

          const file = new File(
            [blob],
            'post-image.jpg',
            { type: blob.type || 'image/jpeg' }
          );

          formData.append('image', file);
        } else {
          const filename = imageUri.split('/').pop() || 'post-image.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          formData.append('image', {
            uri: imageUri,
            name: filename,
            type,
          } as any);
        }
      }

      const result = await postService.createPost(formData);

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
                {/* <TouchableOpacity onPress={() => setIsBrandModalVisible(true)}>
                  <View style={styles.avatarPlaceholder} />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => setIsBrandModalVisible(true)}>
                  {selectedBrandLogoUrl ? (
                    <Image
                      source={{ uri: getImageUrl(selectedBrandLogoUrl) }}
                      style={styles.avatarPlaceholder}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.questionMark}>?</Text>
                    </View>
                  )}
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
                <View style={styles.modalContainer}>

                  {/* 상단 검색바 영역 */}
                  <View style={styles.modalSearchBarContainer}>
                    <View style={styles.modalSearchBar}>

                      <Image
                        source={require('@/assets/icons/search.png')}
                        style={{
                          width: 16,
                          height: 16,
                          tintColor: '#aaa',
                          marginRight: 8,
                        }}
                      />

                      <TextInput
                        style={styles.modalSearchInput}
                        placeholder="브랜드 or 상품"
                        placeholderTextColor="#aaa"
                        value={brandQuery}
                        onChangeText={setBrandQuery}
                      />

                    </View>
                  </View>

                  {/* 음식 / 물건 탭 버튼 영역 */}
                  <View style={styles.modalTabContainer}>

                    <TouchableOpacity
                      style={[
                        styles.modalTabButton,
                        brandCategory === 'FOOD' &&
                        styles.modalActiveTabButton
                      ]}
                      onPress={() => setBrandCategory('FOOD')}
                    >
                      <Text
                        style={[
                          styles.modalTabText,
                          brandCategory === 'FOOD' &&
                          styles.modalActiveTabText
                        ]}
                      >
                        음식
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modalTabButton,
                        brandCategory === 'HOUSEHOLD' &&
                        styles.modalActiveTabButton
                      ]}
                      onPress={() => setBrandCategory('HOUSEHOLD')}
                    >
                      <Text
                        style={[
                          styles.modalTabText,
                          brandCategory === 'HOUSEHOLD' &&
                          styles.modalActiveTabText
                        ]}
                      >
                        물건
                      </Text>
                    </TouchableOpacity>

                  </View>

                  {/* 3열 그리드 브랜드 리스트 영역 */}
                  <ScrollView contentContainerStyle={styles.modalBrandGridContainer}>

                    {brandResults.map((b) => (

                      <TouchableOpacity
                        key={b.brandId}
                        style={styles.modalBrandCard}
                        onPress={() => {
                          setSelectedBrandId(b.brandId);
                          setSelectedBrandName(b.brandName);
                          setSelectedBrandLogoUrl(b.logoUrl || '');
                          setIsBrandModalVisible(false);
                        }}
                      >

                        {/* 브랜드 로고 */}
                        {b.logoUrl ? (
                          <Image
                            source={{ uri: getImageUrl(b.logoUrl) }}
                            style={styles.modalBrandLogoCircle}
                          />
                        ) : (
                          <View style={styles.modalBrandLogoCircle} />
                        )}

                        {/* 브랜드 이름 */}
                        <Text
                          style={styles.modalBrandNameText}
                          numberOfLines={1}
                        >
                          {b.brandName}
                        </Text>

                      </TouchableOpacity>
                    ))}

                  </ScrollView>

                </View>
              </Modal>

                {Array.isArray(suggestions) && suggestions.length > 0 && (
                  <View style={styles.suggestionBox}>
                    {suggestions.map((item) => (
                      <TouchableOpacity
                        key={item.stuffId}
                        onPress={() => handleSelectSuggestion(item)}
                        style={styles.suggestionItem}
                      >
                        <Text style={styles.suggestionText}>
                          @{item.stuffName}
                        </Text>
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
                {selectedBrandLogoUrl ? (
                  <Image
                    source={{ uri: getImageUrl(selectedBrandLogoUrl) }}
                    style={styles.avatarPlaceholder}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.questionMark}>?</Text>
                  </View>
                )}
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