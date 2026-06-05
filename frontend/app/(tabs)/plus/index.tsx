import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform, // 💡 Platform이 누락되어 있다면 반드시 추가하세요!
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { styles } from '@/components/styles/plus';
import { Colors } from '@/constants/colors';
import { postService } from '@/services/post-service';
import { stuffService, StuffSuggestion } from '@/services/stuff-service';
import { searchService } from '@/api/search-service';
import { TopBar } from '@/components/layout/top-bar';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';
const getImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

// 💡 FileSystem 에러를 완전히 우회하기 위해 바로 밑에 이 한 줄을 추가해 주세요.
const ExpoFileSystem = FileSystem as any;

export default function PlusScreen() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [brandName, setBrandName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [selectedBrandLogoUrl, setSelectedBrandLogoUrl] = useState('');
  
  const [isBrandModalVisible, setIsBrandModalVisible] = useState(false);
  const [brandSelectTarget, setBrandSelectTarget] = useState<'main' | 'recommended'>('main');

  const [brandQuery, setBrandQuery] = useState('');
  const [brandResults, setBrandResults] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [price, setPrice] = useState<string>('');
  const [brandCategory, setBrandCategory] = useState<'FOOD' | 'HOUSEHOLD'>('FOOD');

  const [suggestions, setSuggestions] = useState<StuffSuggestion[]>([]);

  // 추천 조합 관련 State
  const [recommendedStuffName, setRecommendedStuffName] = useState('');
  const [recommendedSuggestions, setRecommendedSuggestions] = useState<StuffSuggestion[]>([]);
  const [recommendedPrice, setRecommendedPrice] = useState<string>('');
  const [recommendedImageUri, setRecommendedImageUri] = useState<string | null>(null);

  const [recommendedBrandId, setRecommendedBrandId] = useState<number | null>(null);
  const [recommendedBrandName, setRecommendedBrandName] = useState('');
  const [recommendedBrandLogoUrl, setRecommendedBrandLogoUrl] = useState('');

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

  const handlePickRecommendedImage = async () => {
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
      setRecommendedImageUri(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (isBrandModalVisible) {
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
  }, [isBrandModalVisible, brandCategory, brandQuery]);

  const handleStuffNameChange = async (value: string) => {
    setBrandName(value);
    const keyword = value.replace('@', '').trim();
    if (!keyword) {
      setSuggestions([]);
      return;
    }
    try {
      const result = await stuffService.searchStuffs(keyword);
      setSuggestions(result ?? []);
    } catch (error) {
      console.error('상품 검색 실패:', error);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (item: StuffSuggestion) => {
    setBrandName(`@${item.stuffName}`);
    setSelectedBrandId(item.brandId ?? selectedBrandId);
    setSelectedBrandName(item.brandName ?? '');
    setSelectedBrandLogoUrl(item.logoUrl ?? '');
    setPrice(
      item.averagePrice !== undefined && item.averagePrice !== null
        ? String(Math.round(item.averagePrice))
        : item.price !== undefined && item.price !== null
          ? String(item.price)
          : ''
    );
    setSuggestions([]);
  };

  const handleRecommendedStuffChange = async (value: string) => {
    setRecommendedStuffName(value);
    const keyword = value.replace('@', '').trim();
    if (!keyword) {
      setRecommendedSuggestions([]);
      return;
    }
    try {
      const result = await stuffService.searchStuffs(keyword);
      setRecommendedSuggestions(result ?? []);
    } catch (error) {
      console.error('추천 조합 자동완성 검색 실패:', error);
      setRecommendedSuggestions([]);
    }
  };

  const handleSelectRecommendedSuggestion = (item: StuffSuggestion) => {
    setRecommendedStuffName(`@${item.stuffName}`);
    setRecommendedBrandId(item.brandId ?? null);
    setRecommendedBrandName(item.brandName ?? '');
    setRecommendedBrandLogoUrl(item.logoUrl ?? '');
    setRecommendedPrice(
      item.averagePrice !== undefined && item.averagePrice !== null
        ? String(Math.round(item.averagePrice))
        : item.price !== undefined && item.price !== null
          ? String(item.price)
          : ''
    );
    setRecommendedSuggestions([]);
  };

  const handleNext = async () => {
    const cleanName = brandName.replace('@', '').trim();
    if (!cleanName) {
      Alert.alert('알림', '상품명을 입력해주세요.');
      return;
    }
    if (!selectedBrandId) {
      Alert.alert('알림', '브랜드를 먼저 선택해주세요.');
      return;
    }

    const cleanRecommendedName = recommendedStuffName.replace('@', '').trim();
    if (cleanRecommendedName && !recommendedBrandId) {
      Alert.alert('알림', '추천 조합 브랜드를 선택해주세요.');
      return;
    }

    setStep(2);
  };

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
    setSuggestions([]);
    setRecommendedStuffName('');
    setRecommendedSuggestions([]);
    setRecommendedPrice('');
    setRecommendedImageUri(null);
    setRecommendedBrandId(null);
    setRecommendedBrandName('');
    setRecommendedBrandLogoUrl('');
    setBrandSelectTarget('main');
  };

const handleUpload = async () => {
    try {
      if (!content.trim()) {
        Alert.alert('알림', '소개글을 작성해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('content', content);
      formData.append('brandId', String(selectedBrandId));
      formData.append('stuffName', brandName.replace('@', '').trim());
      formData.append('price', price || '0');

      const cleanRecName = recommendedStuffName.replace('@', '').trim();
      if (cleanRecName && recommendedBrandId) {
        formData.append('recommendedBrandId', String(recommendedBrandId));
        formData.append('recommendedStuffName', cleanRecName);
        formData.append('recommendedPrice', recommendedPrice || '0');
      }

      // 🔥 [수정] TypeScript가 에러를 뿜지 못하도록 안전하게 문자열 인덱스로 캐시 디렉토리를 가져옵니다.
      const targetCacheDir = ExpoFileSystem['cacheDirectory'] || ExpoFileSystem['documentDirectory'] || '';

      // 1. 메인 이미지 처리
      if (imageUri) {
        if (Platform.OS === 'web') {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const file = new File([blob], 'post-image.jpg', { type: blob.type || 'image/jpeg' });
          formData.append('image', file);
        } else {
          const filename = imageUri.split('/').pop() || 'post-image.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          let uriForForm = imageUri;
          if (Platform.OS === 'android' && imageUri.startsWith('content://')) {
            try {
              if (targetCacheDir) {
                const dest = targetCacheDir + filename;
                // 🔥 [수정] copyAsync도 안전하게 우회 호출합니다.
                await ExpoFileSystem.copyAsync({ from: imageUri, to: dest });
                uriForForm = dest;
              }
            } catch (e) {
              console.warn('파일 복사 실패, 원본 URI 사용:', e);
            }
          }

          if (Platform.OS === 'android' && !uriForForm.startsWith('file://') && !uriForForm.startsWith('content://')) {
            uriForForm = 'file://' + uriForForm;
          }

//           if (!appended) {
//             if (Platform.OS === 'android' && uriForForm.startsWith('/') && !uriForForm.startsWith('file://')) {
//               uriForForm = 'file://' + uriForForm;
//             }

            formData.append('image', {
              uri: uriForForm,
              name: filename,
              type,
            } as any);
          }
        }
      }

      // 2. 추천 이미지 처리
      if (recommendedImageUri) {
        if (Platform.OS === 'web') {
          const response = await fetch(recommendedImageUri);
          const blob = await response.blob();
          const file = new File([blob], 'recommended-image.jpg', { type: blob.type || 'image/jpeg' });
          formData.append('recommendedImage', file);
        } else {
          const filename = recommendedImageUri.split('/').pop() || 'recommended-image.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          let uriForForm = recommendedImageUri;
          if (Platform.OS === 'android' && recommendedImageUri.startsWith('content://')) {
            try {
              if (targetCacheDir) {
                const dest = targetCacheDir + filename;
                // 🔥 [수정] copyAsync도 안전하게 우회 호출합니다.
                await ExpoFileSystem.copyAsync({ from: recommendedImageUri, to: dest });
                uriForForm = dest;
              }
            } catch (e) {
              console.warn('추천 이미지 파일 복사 실패, 원본 URI 사용:', e);
            }
          }

          if (Platform.OS === 'android' && !uriForForm.startsWith('file://') && !uriForForm.startsWith('content://')) {
            uriForForm = 'file://' + uriForForm;
          }

//           if (!appendedRec) {
//             if (Platform.OS === 'android' && uriForForm.startsWith('/') && !uriForForm.startsWith('file://')) {
//               uriForForm = 'file://' + uriForForm;
//             }

            formData.append('recommendedImage', {
              uri: uriForForm,
              name: filename,
              type,
            } as any);
          }
        }
      }

      const result = await postService.createPost(formData);
      resetForm();
      Alert.alert('성공', '게시글이 등록되었습니다.');
      router.push('/(tabs)/home' as Href);
    } catch (error: any) {
      console.error('게시글 등록 완전 실패:', error);
      Alert.alert('오류', error.response?.data?.message || '게시글 등록 과정에 실패했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TopBar title="게시물 업로드" onBackPress={handleBackPress} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}>
          {step === 1 ? (
            <>
              <TouchableOpacity style={styles.imageUploadCard} onPress={handlePickImage}>
                {imageUri ? <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" /> : <Image source={require('@/assets/icons/search.png')} style={styles.imageIconPlaceHolder} resizeMode="contain" />}
              </TouchableOpacity>

              <View style={styles.userInfoCard}>
                <TouchableOpacity onPress={() => { setBrandSelectTarget('main'); setIsBrandModalVisible(true); }}>
                  {selectedBrandLogoUrl ? <Image source={{ uri: getImageUrl(selectedBrandLogoUrl) }} style={styles.avatarPlaceholder} /> : <View style={styles.avatarPlaceholder}><Text style={styles.questionMark}>?</Text></View>}
                </TouchableOpacity>
                <View style={styles.nameInputWrapper}>
                  <TextInput placeholder="@이름 작성" placeholderTextColor={Colors.gray.light} style={styles.nameInput} value={brandName} onChangeText={handleStuffNameChange} />
                </View>
              </View>

              {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {suggestions.map((item) => (
                    <TouchableOpacity key={item.stuffId} style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)}>
                      <Text style={styles.suggestionText}>{item.stuffName} ({item.brandName})</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>단가</Text>
                <TextInput placeholder="원 가격 입력" placeholderTextColor={Colors.gray.light} style={styles.priceInput} keyboardType="numeric" value={price} onChangeText={setPrice} />
              </View>

              <View style={styles.divider} />

              <View style={styles.recommendSection}>
                <Text style={styles.recommendTitle}>추천 조합 상품</Text>
                <View style={styles.userInfoCard}>
                  <TouchableOpacity onPress={() => { setBrandSelectTarget('recommended'); setIsBrandModalVisible(true); }}>
                    {recommendedBrandLogoUrl ? <Image source={{ uri: getImageUrl(recommendedBrandLogoUrl) }} style={styles.avatarPlaceholder} /> : <View style={styles.avatarPlaceholder}><Text style={styles.questionMark}>?</Text></View>}
                  </TouchableOpacity>
                  <View style={styles.nameInputWrapper}>
                    <TextInput placeholder="@추천 조합 상품명 작성" placeholderTextColor={Colors.gray.light} style={styles.nameInput} value={recommendedStuffName} onChangeText={handleRecommendedStuffChange} />
                  </View>
                </View>

                {recommendedSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {recommendedSuggestions.map((item) => (
                      <TouchableOpacity key={item.stuffId} style={styles.suggestionItem} onPress={() => handleSelectRecommendedSuggestion(item)}>
                        <Text style={styles.suggestionText}>{item.stuffName} ({item.brandName})</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>단가</Text>
                  <TextInput placeholder="원 가격 입력" placeholderTextColor={Colors.gray.light} style={styles.priceInput} keyboardType="numeric" value={recommendedPrice} onChangeText={setRecommendedPrice} />
                </View>

                <TouchableOpacity style={styles.imageUploadCardSmall} onPress={handlePickRecommendedImage}>
                  {recommendedImageUri ? <Image source={{ uri: recommendedImageUri }} style={styles.previewImage} resizeMode="cover" /> : <Text style={styles.imagePlaceholderText}>추천 상품 사진 등록</Text>}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>다음</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput placeholder="조합에 대한 소개글을 작성해 주세요." placeholderTextColor={Colors.gray.light} style={styles.contentInput} multiline textAlignVertical="top" value={content} onChangeText={setContent} />
              <TouchableOpacity style={styles.nextButton} onPress={handleUpload}>
                <Text style={styles.nextButtonText}>업로드</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        <Modal visible={isBrandModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tabButton, brandCategory === 'FOOD' && styles.activeTabButton]} onPress={() => setBrandCategory('FOOD')}><Text style={[styles.tabText, brandCategory === 'FOOD' && styles.activeTabText]}>식품</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.tabButton, brandCategory === 'HOUSEHOLD' && styles.activeTabButton]} onPress={() => setBrandCategory('HOUSEHOLD')}><Text style={[styles.tabText, brandCategory === 'HOUSEHOLD' && styles.activeTabText]}>생활용품</Text></TouchableOpacity>
              </View>
              <TextInput placeholder="브랜드 검색..." style={styles.brandSearchInput} value={brandQuery} onChangeText={brandQuery => setBrandQuery(brandQuery)} />
              <ScrollView style={{ flex: 1 }}>
                {brandResults.map((brand: any) => (
                  <TouchableOpacity
                    key={brand.brandId}
                    style={styles.brandItem}
                    onPress={() => {
                      if (brandSelectTarget === 'main') {
                        setSelectedBrandId(brand.brandId);
                        setSelectedBrandName(brand.brandName);
                        setSelectedBrandLogoUrl(brand.logoUrl);
                      } else {
                        setRecommendedBrandId(brand.brandId);
                        setRecommendedBrandName(brand.brandName);
                        setRecommendedBrandLogoUrl(brand.logoUrl);
                      }
                      setIsBrandModalVisible(false);
                      setBrandQuery('');
                    }}
                  >
                    <Image source={{ uri: getImageUrl(brand.logoUrl) }} style={styles.brandLogo} />
                    <Text style={styles.brandNameText}>{brand.brandName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={() => { setIsBrandModalVisible(false); setBrandQuery(''); }}><Text style={styles.closeButtonText}>닫기</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}