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
  StyleSheet,
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

// 💡 FileSystem 에러 완전 방어
const ExpoFileSystem = FileSystem as any;
// 💡 스타일 파일에 누락된 속성이 있어도 뻗지 않도록 Any 처리
const safeStyles = styles as any;

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
  
  // 💡Fallback 지정용 로컬 상태 선언
  const [recBrandLogoUrl, setRecBrandLogoUrl] = useState('');

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

  // 💡 모달이 열리지 않아도 자동완성 시 brandResults를 조회할 수 있도록 조건 완화 (백그라운드 로드 보장)
  useEffect(() => {
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

  // 🎯 메인 상품 선택 시 brandId 기반 브랜드 로고 실시간 룩업(Lookup) + 가격 매핑 단일화
  const handleSelectSuggestion = (item: StuffSuggestion) => {
    setBrandName(`@${item.stuffName}`);
    
    const finalBrandId = item.brandId ?? selectedBrandId;
    setSelectedBrandId(finalBrandId);
    setSelectedBrandName(item.brandName ?? '');
    
    // 🔍 1단계: 프론트엔드 brandResults 마스터 데이터에서 brandId 매칭 추적
    let finalLogoUrl = '';
    if (finalBrandId && brandResults.length > 0) {
      const matchedBrand = brandResults.find((b: any) => Number(b.brandId) === Number(finalBrandId));
      if (matchedBrand) {
        finalLogoUrl = matchedBrand.logoUrl;
      }
    }

    // 🔍 2단계: 만약 캐시에 없다면 백엔드가 던져준 원본 객체의 예외 필드 마지막 탐색
    if (!finalLogoUrl) {
      const rawItem = item as any;
      finalLogoUrl = 
        rawItem.brand?.logoUrl || 
        rawItem.brandLogoUrl || 
        rawItem.brandLogo || 
        rawItem.logo_url || 
        rawItem.logoUrl || 
        '';
    }
      
    setSelectedBrandLogoUrl(finalLogoUrl);

    // 💰 [백엔드 가격 캐싱 반영] 중복 필드 없이 완전히 축소된 단일 캐싱 price만 매핑합니다.
    setPrice(
      item.price !== undefined && item.price !== null
        ? String(Math.round(item.price))
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

  // 🎯 추천 조합 상품 선택 시 brandId 기반 브랜드 로고 실시간 룩업(Lookup) + 가격 매핑 단일화
  const handleSelectRecommendedSuggestion = (item: StuffSuggestion) => {
    setRecommendedStuffName(`@${item.stuffName}`);
    
    const finalRecBrandId = item.brandId ?? null;
    setRecommendedBrandId(finalRecBrandId);
    setRecommendedBrandName(item.brandName ?? '');
    
    // 🔍 1단계: 프론트엔드 brandResults 마스터 데이터에서 brandId 매칭 추적
    let finalRecLogoUrl = '';
    if (finalRecBrandId && brandResults.length > 0) {
      const matchedBrand = brandResults.find((b: any) => Number(b.brandId) === Number(finalRecBrandId));
      if (matchedBrand) {
        finalRecLogoUrl = matchedBrand.logoUrl;
      }
    }

    // 🔍 2단계: 예외 보루 필드 탐색
    if (!finalRecLogoUrl) {
      const rawItem = item as any;
      finalRecLogoUrl = 
        rawItem.brand?.logoUrl || 
        rawItem.brandLogoUrl || 
        rawItem.brandLogo || 
        rawItem.logo_url || 
        rawItem.logoUrl || 
        '';
    }

    setRecBrandLogoUrl(finalRecLogoUrl);

    // 💰 [백엔드 가격 캐싱 반영] 추천 상품도 순정 price 기반 매핑 고정
    setRecommendedPrice(
      item.price !== undefined && item.price !== null
        ? String(Math.round(item.price))
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
    setRecBrandLogoUrl(''); 
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
      
      // 💰 [대원칙 반영] 순수 숫자 문자열만 추출하여 전송 (백엔드 에러 원천 차단)
      const purePrice = price.replace(/[^0-9]/g, '') || '0';
      formData.append('price', purePrice);

      const cleanRecName = recommendedStuffName.replace('@', '').trim();
      if (cleanRecName && recommendedBrandId) {
        formData.append('recommendedBrandId', String(recommendedBrandId));
        formData.append('recommendedStuffName', cleanRecName);
        
        // 💰 추천 상품 단가도 동일하게 숫자가 아닌 값 정제 후 전송
        const pureRecPrice = recommendedPrice.replace(/[^0-9]/g, '') || '0';
        formData.append('recommendedPrice', pureRecPrice);
      }

      const cacheDirKey = 'cacheDirectory';
      const docDirKey = 'documentDirectory';
      const targetCacheDir = ExpoFileSystem[cacheDirKey] || ExpoFileSystem[docDirKey] || '';

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
                await ExpoFileSystem['copyAsync']({ from: imageUri, to: dest });
                uriForForm = dest;
              }
            } catch (e) {
              console.warn('파일 복사 실패, 원본 URI 사용:', e);
            }
          }

          if (Platform.OS === 'android' && !uriForForm.startsWith('file://') && !uriForForm.startsWith('content://')) {
            uriForForm = 'file://' + uriForForm;
          }

          formData.append('image', {
            uri: uriForForm,
            name: filename,
            type,
          } as any);
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
                await ExpoFileSystem['copyAsync']({ from: recommendedImageUri, to: dest });
                uriForForm = dest;
              }
            } catch (e) {
              console.warn('추천 이미지 파일 복사 실패, 원본 URI 사용:', e);
            }
          }

          if (Platform.OS === 'android' && !uriForForm.startsWith('file://') && !uriForForm.startsWith('content://')) {
            uriForForm = 'file://' + uriForForm;
          }

          formData.append('recommendedImage', {
            uri: uriForForm,
            name: filename,
            type,
          } as any);
        }
      }

      await postService.createPost(formData);
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
      <View style={safeStyles.container || { flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}>
          {step === 1 ? (
            <>
              <TouchableOpacity style={safeStyles.imageUploadCard || {}} onPress={handlePickImage}>
                {imageUri ? <Image source={{ uri: imageUri }} style={safeStyles.previewImage || {}} resizeMode="cover" /> : <Image source={require('@/assets/icons/search.png')} style={safeStyles.imageIconPlaceHolder || {}} resizeMode="contain" />}
              </TouchableOpacity>

              <View style={safeStyles.userInfoCard || {}}>
                <TouchableOpacity onPress={() => { setBrandSelectTarget('main'); setIsBrandModalVisible(true); }}>
                  {selectedBrandLogoUrl ? <Image source={{ uri: getImageUrl(selectedBrandLogoUrl) }} style={safeStyles.avatarPlaceholder || {}} /> : <View style={safeStyles.avatarPlaceholder || {}}><Text style={safeStyles.questionMark || {}}>?</Text></View>}
                </TouchableOpacity>
                <View style={safeStyles.nameInputWrapper || {}}>
                  <TextInput placeholder="@이름 작성" placeholderTextColor={Colors.gray.light} style={safeStyles.nameInput || {}} value={brandName} onChangeText={handleStuffNameChange} />
                </View>
              </View>

              {/* 메인 상품 자동완성 추천 가이드 리스트 */}
              {suggestions.length > 0 && (
                <View style={safeStyles.suggestionsContainer || {}}>
                  {suggestions.map((item) => {
                    const rawItem = item as any;
                    
                    let itemLogoUrl = '';
                    if (item.brandId && brandResults.length > 0) {
                      const mBrand = brandResults.find((b: any) => Number(b.brandId) === Number(item.brandId));
                      if (mBrand) itemLogoUrl = mBrand.logoUrl;
                    }
                    if (!itemLogoUrl) {
                      itemLogoUrl = rawItem.brand?.logoUrl || rawItem.brandLogoUrl || rawItem.brandLogo || rawItem.logo_url || rawItem.logoUrl;
                    }

                    const suggestionLabel = item.brandName ? `${item.stuffName} (${item.brandName})` : item.stuffName;
                    return (
                      <TouchableOpacity 
                        key={item.stuffId} 
                        style={[safeStyles.suggestionItem || {}, localStyles.suggestionRow]} 
                        onPress={() => handleSelectSuggestion(item)}
                      >
                        {itemLogoUrl ? (
                          <Image source={{ uri: getImageUrl(itemLogoUrl) }} style={localStyles.miniBrandLogo} />
                        ) : (
                          <View style={localStyles.miniBrandLogoPlaceholder}><Text style={{fontSize: 10, color: '#aaa'}}>?</Text></View>
                        )}
                        <Text style={safeStyles.suggestionText || {}}>{suggestionLabel}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <View style={safeStyles.priceRow || {}}>
                <Text style={safeStyles.priceLabel || {}}>단가</Text>
                <TextInput placeholder="원 가격 입력" placeholderTextColor={Colors.gray.light} style={safeStyles.priceInput || {}} keyboardType="numeric" value={price} onChangeText={setPrice} />
              </View>

              <View style={safeStyles.divider || {}} />

              <View style={safeStyles.recommendSection || {}}>
                <Text style={safeStyles.recommendTitle || {}}>추천 조합 상품</Text>
                <View style={safeStyles.userInfoCard || {}}>
                  <TouchableOpacity onPress={() => { setBrandSelectTarget('recommended'); setIsBrandModalVisible(true); }}>
                    {recBrandLogoUrl ? <Image source={{ uri: getImageUrl(recBrandLogoUrl) }} style={safeStyles.avatarPlaceholder || {}} /> : <View style={safeStyles.avatarPlaceholder || {}}><Text style={safeStyles.questionMark || {}}>?</Text></View>}
                  </TouchableOpacity>
                  <View style={safeStyles.nameInputWrapper || {}}>
                    <TextInput placeholder="@추천 조합 상품명 작성" placeholderTextColor={Colors.gray.light} style={safeStyles.nameInput || {}} value={recommendedStuffName} onChangeText={handleRecommendedStuffChange} />
                  </View>
                </View>

                {/* 추천 상품 자동완성 추천 가이드 리스트 */}
                {recommendedSuggestions.length > 0 && (
                  <View style={safeStyles.suggestionsContainer || {}}>
                    {recommendedSuggestions.map((item) => {
                      const rawItem = item as any;
                      
                      let itemLogoUrl = '';
                      if (item.brandId && brandResults.length > 0) {
                        const mBrand = brandResults.find((b: any) => Number(b.brandId) === Number(item.brandId));
                        if (mBrand) itemLogoUrl = mBrand.logoUrl;
                      }
                      if (!itemLogoUrl) {
                        itemLogoUrl = rawItem.brand?.logoUrl || rawItem.brandLogoUrl || rawItem.brandLogo || rawItem.logo_url || rawItem.logoUrl;
                      }
                    
                      const suggestionLabel = item.brandName ? `${item.stuffName} (${item.brandName})` : item.stuffName;
                      return (
                        <TouchableOpacity 
                          key={item.stuffId} 
                          style={[safeStyles.suggestionItem || {}, localStyles.suggestionRow]} 
                          onPress={() => handleSelectRecommendedSuggestion(item)}
                        >
                          {itemLogoUrl ? (
                            <Image source={{ uri: getImageUrl(itemLogoUrl) }} style={localStyles.miniBrandLogo} />
                          ) : (
                            <View style={localStyles.miniBrandLogoPlaceholder}><Text style={{fontSize: 10, color: '#aaa'}}>?</Text></View>
                          )}
                          <Text style={safeStyles.suggestionText || {}}>{suggestionLabel}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                <View style={safeStyles.priceRow || {}}>
                  <Text style={safeStyles.priceLabel || {}}>단가</Text>
                  <TextInput placeholder="원 가격 입력" placeholderTextColor={Colors.gray.light} style={safeStyles.priceInput || {}} keyboardType="numeric" value={recommendedPrice} onChangeText={setRecommendedPrice} />
                </View>

                <TouchableOpacity style={safeStyles.imageUploadCardSmall || {}} onPress={handlePickRecommendedImage}>
                  {recommendedImageUri ? <Image source={{ uri: recommendedImageUri }} style={safeStyles.previewImage || {}} resizeMode="cover" /> : <Text style={safeStyles.imagePlaceholderText || {}}>추천 상품 사진 등록</Text>}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={safeStyles.nextButton || {}} onPress={handleNext}>
                <Text style={safeStyles.nextButtonText || {}}>다음</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput placeholder="소개글을 작성해 주세요." placeholderTextColor={Colors.gray.light} style={safeStyles.contentInput || {}} multiline textAlignVertical="top" value={content} onChangeText={setContent} />
              <TouchableOpacity style={safeStyles.nextButton || {}} onPress={handleUpload}>
                <Text style={safeStyles.nextButtonText || {}}>업로드</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        <Modal visible={isBrandModalVisible} animationType="slide" transparent>
          <View style={safeStyles.modalOverlay || { flex: 1 }}>
            <View style={safeStyles.modalContainer || { flex: 1, backgroundColor: 'white' }}>
              <View style={safeStyles.tabContainer || { flexDirection: 'row' }}>
                <TouchableOpacity style={[safeStyles.tabButton || {}, brandCategory === 'FOOD' && (safeStyles.activeTabButton || {})]} onPress={() => setBrandCategory('FOOD')}><Text style={[safeStyles.tabText || {}, brandCategory === 'FOOD' && (safeStyles.activeTabText || {})]}>식품</Text></TouchableOpacity>
                <TouchableOpacity style={[safeStyles.tabButton || {}, brandCategory === 'HOUSEHOLD' && (safeStyles.activeTabButton || {})]} onPress={() => setBrandCategory('HOUSEHOLD')}><Text style={[safeStyles.tabText || {}, brandCategory === 'HOUSEHOLD' && (safeStyles.activeTabText || {})]}>생활용품</Text></TouchableOpacity>
              </View>
              <TextInput placeholder="브랜드 검색..." style={safeStyles.brandSearchInput || {}} value={brandQuery} onChangeText={brandQuery => setBrandQuery(brandQuery)} />
              <ScrollView style={{ flex: 1 }}>
                {brandResults.map((brand: any) => (
                  <TouchableOpacity
                    key={brand.brandId}
                    style={safeStyles.brandItem || { padding: 10 }}
                    onPress={() => {
                      if (brandSelectTarget === 'main') {
                        setSelectedBrandId(brand.brandId);
                        setSelectedBrandName(brand.brandName);
                        setSelectedBrandLogoUrl(brand.logoUrl);
                      } else {
                        setRecommendedBrandId(brand.brandId);
                        setRecommendedBrandName(brand.brandName);
                        setRecBrandLogoUrl(brand.logoUrl);
                      }
                      setIsBrandModalVisible(false);
                      setBrandQuery('');
                    }}
                  >
                    <Image source={{ uri: getImageUrl(brand.logoUrl) }} style={safeStyles.brandLogo || { width: 40, height: 40 }} />
                    <Text style={safeStyles.brandNameText || {}}>{brand.brandName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={safeStyles.closeButton || { padding: 15 }} onPress={() => { setIsBrandModalVisible(false); setBrandQuery(''); }}><Text style={safeStyles.closeButtonText || {}}>닫기</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const localStyles = StyleSheet.create({
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  miniBrandLogo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
  },
  miniBrandLogoPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  }
});