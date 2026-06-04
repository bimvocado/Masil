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
import * as FileSystem from 'expo-file-system';

import { styles } from '@/components/styles/plus';
import { Colors } from '@/constants/colors';
import { postService } from '@/services/post-service';
import { getToken } from '@/utils/storage';
import { stuffService, StuffSuggestion } from '@/services/stuff-service';
import { searchService } from '@/api/search-service';
import { TopBar } from '@/components/layout/top-bar';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';
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
  const [brandSelectTarget, setBrandSelectTarget] = useState<'main' | 'recommended'>('main');

  const [brandQuery, setBrandQuery] = useState('');
  const [brandResults, setBrandResults] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [price, setPrice] = useState<string>('');
  const [brandCategory, setBrandCategory] = useState<'FOOD' | 'HOUSEHOLD'>('FOOD');

  const [stuffId, setStuffId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<StuffSuggestion[]>([]);

  // 추천 조합
  const [recommendedStuffName, setRecommendedStuffName] = useState('');
  const [recommendedStuffId, setRecommendedStuffId] = useState<number | null>(null);
  const [recommendedSuggestions, setRecommendedSuggestions] = useState<StuffSuggestion[]>([]);
  const [recommendedPrice, setRecommendedPrice] = useState<string>('');
  const [recommendedImageUri, setRecommendedImageUri] = useState<string | null>(null);

  // 추천 조합 브랜드
  const [recommendedBrandId, setRecommendedBrandId] = useState<number | null>(null);
  const [confirmedRecommendedStuffId, setConfirmedRecommendedStuffId] = useState<number | null>(null);
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

  // 추천 조합 자동완성
  const handleRecommendedStuffChange = async (value: string) => {
    setRecommendedStuffName(value);
    setRecommendedStuffId(null);
    setConfirmedRecommendedStuffId(null);
    setRecommendedPrice('');

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
    setRecommendedStuffId(item.stuffId);
    setConfirmedRecommendedStuffId(item.stuffId);

    // 추천 조합도 자동완성에서 선택하면 브랜드 정보 자동 반영
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

      let finalStuffId = stuffId;
      let finalRecommendedStuffId = recommendedStuffId;

      // 먼저 같은 이름의 상품이 있는지 조회
      const searchResult = await stuffService.searchStuffs(cleanName);
      const existing = searchResult.find((s: any) => s.stuffName === cleanName && s.brandId === selectedBrandId);

      if (existing) {
        finalStuffId = existing.stuffId;
        setStuffId(existing.stuffId);
        setBrandName(`@${existing.stuffName}`);
        setSelectedBrandId(existing.brandId ?? selectedBrandId);
        setSelectedBrandName(existing.brandName ?? selectedBrandName ?? '');
        setSelectedBrandLogoUrl(existing.logoUrl ?? selectedBrandLogoUrl ?? '');
        setSuggestions([]);
      } else {
        // 없으면 새로 생성 (가격 포함)
        const priceValue = Number(price) || 0;
        const created = await stuffService.createStuff({
          brandId: selectedBrandId,
          stuffName: cleanName,
          price: priceValue,
        });

        finalStuffId = created.stuffId;
        setStuffId(created.stuffId);
        setBrandName(`@${created.stuffName}`);
        setSelectedBrandId(created.brandId ?? selectedBrandId);
        setSelectedBrandName(created.brandName || selectedBrandName || '');
        setSelectedBrandLogoUrl(created.logoUrl ?? selectedBrandLogoUrl ?? '');
        setSuggestions([]);
      }

      // 추천 조합 상품 확인
      const cleanRecommendedName = recommendedStuffName.replace('@', '').trim();

      if (cleanRecommendedName) {
        if (!recommendedBrandId) {
          Alert.alert('알림', '추천 조합 브랜드를 먼저 선택해주세요. 추천 조합 좌측 원을 눌러 브랜드를 선택하세요.');
          return;
        }

        const recommendedSearchResult = await stuffService.searchStuffs(cleanRecommendedName);

        const recommendedExisting = recommendedSearchResult.find(
          (s: any) => s.stuffName === cleanRecommendedName && s.brandId === recommendedBrandId
        );

        if (recommendedExisting) {
          finalRecommendedStuffId = recommendedExisting.stuffId;
          setRecommendedStuffId(recommendedExisting.stuffId);
          setConfirmedRecommendedStuffId(recommendedExisting.stuffId);
          setRecommendedStuffName(`@${recommendedExisting.stuffName}`);
          setRecommendedBrandId(recommendedExisting.brandId ?? recommendedBrandId);
          setRecommendedBrandName(recommendedExisting.brandName ?? recommendedBrandName ?? '');
          setRecommendedBrandLogoUrl(recommendedExisting.logoUrl ?? recommendedBrandLogoUrl ?? '');
          setRecommendedSuggestions([]);
        } else {
          const recommendedPriceValue = Number(recommendedPrice) || 0;

          const createdRecommended = await stuffService.createStuff({
            brandId: recommendedBrandId,
            stuffName: cleanRecommendedName,
            price: recommendedPriceValue,
          });

          finalRecommendedStuffId = createdRecommended.stuffId;
          setRecommendedStuffId(createdRecommended.stuffId);
          setConfirmedRecommendedStuffId(createdRecommended.stuffId);
          setRecommendedStuffName(`@${createdRecommended.stuffName}`);
          setRecommendedBrandId(createdRecommended.brandId ?? recommendedBrandId);
          setRecommendedBrandName(createdRecommended.brandName ?? recommendedBrandName ?? '');
          setRecommendedBrandLogoUrl(createdRecommended.logoUrl ?? recommendedBrandLogoUrl ?? '');
          setRecommendedSuggestions([]);
        }
      }

      setConfirmedRecommendedStuffId(finalRecommendedStuffId ?? null);

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

    // 추천 조합 초기화
    setRecommendedStuffName('');
    setRecommendedStuffId(null);
    setConfirmedRecommendedStuffId(null);
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

      if (confirmedRecommendedStuffId !== null) {
        formData.append('recommendedStuffId', String(confirmedRecommendedStuffId));
      }

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

          // Android may return content:// URIs which need to be copied to a file:// path
          let uriForForm = imageUri;
          if (Platform.OS === 'android' && imageUri.startsWith('content://')) {
            try {
              const dest = FileSystem.cacheDirectory + filename;
              const copied = await FileSystem.copyAsync({ from: imageUri, to: dest });
              uriForForm = copied.uri;
            } catch (e) {
              console.warn('파일 복사 실패, 원본 URI 사용:', e);
              // fall back to original uri
              uriForForm = imageUri;
            }
          }

          // Log final URI used for FormData
          console.log('이미지 전송 URI(for image):', uriForForm);

          // Only add file:// prefix for bare paths (starting with '/'),
          // do NOT prefix content:// URIs.
          if (Platform.OS === 'android' && uriForForm.startsWith('/') && !uriForForm.startsWith('file://')) {
            uriForForm = 'file://' + uriForForm;
          }

          formData.append('image', {
            uri: uriForForm,
            name: filename,
            type,
          } as any);
        }
      }

      if (recommendedImageUri) {
        if (Platform.OS === 'web') {
          const response = await fetch(recommendedImageUri);
          const blob = await response.blob();

          const file = new File(
            [blob],
            'recommended-image.jpg',
            { type: blob.type || 'image/jpeg' }
          );

          formData.append('recommendedImage', file);
        } else {
          const filename = recommendedImageUri.split('/').pop() || 'recommended-image.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          let uriForForm = recommendedImageUri;
          if (Platform.OS === 'android' && recommendedImageUri.startsWith('content://')) {
            try {
              const dest = FileSystem.cacheDirectory + filename;
              const copied = await FileSystem.copyAsync({ from: recommendedImageUri, to: dest });
              uriForForm = copied.uri;
            } catch (e) {
              console.warn('추천 이미지 파일 복사 실패, 원본 URI 사용:', e);
              uriForForm = recommendedImageUri;
            }
          }

          console.log('이미지 전송 URI(for recommended):', uriForForm);

          if (Platform.OS === 'android' && uriForForm.startsWith('/') && !uriForForm.startsWith('file://')) {
            uriForForm = 'file://' + uriForForm;
          }

          formData.append('recommendedImage', {
            uri: uriForForm,
            name: filename,
            type,
          } as any);
        }
      }


      console.log('confirmedRecommendedStuffId:', confirmedRecommendedStuffId);

      for (const pair of (formData as any)._parts ?? []) {
        console.log('formData:', pair[0], pair[1]);
      }
      
      
      try {
        const result = await postService.createPost(formData);
        console.log('게시글 등록 성공:', result);
        resetForm();
        Alert.alert('성공', '게시글이 등록되었습니다.');
        router.push('/(tabs)/home' as Href);
      } catch (err: any) {
        console.error('게시글 등록 실패(axios):', err);

        // 폴백: axios Network Error 시 fetch로 재시도
        const isNetworkError = err?.message?.includes('Network Error') || (err?.toString && err.toString().includes('Network Error'));
        if (isNetworkError) {
          try {
            console.log('네트워크 오류 감지: fetch로 재시도합니다.');
            const token = await getToken();
            const url = `${BASE_URL}/api/posts`;
            const headers: any = {};
            if (token) headers.Authorization = `Bearer ${token}`;

            const res = await fetch(url, {
              method: 'POST',
              headers,
              body: formData,
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
              console.error('fetch 업로드 실패:', res.status, json);
              throw new Error(json?.message || 'fetch upload failed');
            }

            console.log('게시글 등록 성공(fetch):', json);
            resetForm();
            Alert.alert('성공', '게시글이 등록되었습니다. (fetch)');
            router.push('/(tabs)/home' as Href);
            return;
          } catch (fetchErr) {
            console.error('fetch 재시도 실패:', fetchErr);
          }
        }

        // 모든 시도 실패
        Alert.alert('오류', err.response?.data?.message || '게시글 등록에 실패했습니다.');
      }
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
                <TouchableOpacity
                  onPress={() => {
                    setBrandSelectTarget('main');
                    setIsBrandModalVisible(true);
                  }}
                >
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
                          if (brandSelectTarget === 'main') {
                            setSelectedBrandId(b.brandId);
                            setSelectedBrandName(b.brandName);
                            setSelectedBrandLogoUrl(b.logoUrl || '');
                          } else {
                            setRecommendedBrandId(b.brandId);
                            setRecommendedBrandName(b.brandName);
                            setRecommendedBrandLogoUrl(b.logoUrl || '');
                          }

                          setBrandQuery('');
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

              <Text style={{ marginBottom: 6, color: Colors.gray.dark }}>
                추천 조합 이미지
              </Text>

              <TouchableOpacity style={styles.imageUploadCard} onPress={handlePickRecommendedImage}>
                {recommendedImageUri ? (
                  <Image
                    source={{ uri: recommendedImageUri }}
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

              <Text style={{ marginBottom: 6, color: Colors.gray.dark }}>
                추천 조합
              </Text>

              <View style={styles.userInfoCard}>
                <TouchableOpacity
                  onPress={() => {
                    setBrandSelectTarget('recommended');
                    setIsBrandModalVisible(true);
                  }}
                >
                  {recommendedBrandLogoUrl ? (
                    <Image
                      source={{ uri: getImageUrl(recommendedBrandLogoUrl) }}
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
                    placeholder="@추천 조합 작성"
                    placeholderTextColor={Colors.gray.light}
                    style={styles.nameInput}
                    value={recommendedStuffName}
                    onChangeText={handleRecommendedStuffChange}
                  />
                </View>
              </View>

              {Array.isArray(recommendedSuggestions) && recommendedSuggestions.length > 0 && (
                <View style={styles.suggestionBox}>
                  {recommendedSuggestions.map((item) => (
                    <TouchableOpacity
                      key={item.stuffId}
                      onPress={() => handleSelectRecommendedSuggestion(item)}
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
                <Text style={{ marginBottom: 6, color: Colors.gray.dark }}>추천 조합 가격 (선택, 신규 생성 시 사용)</Text>
                <TextInput
                  placeholder="예: 1500"
                  keyboardType="numeric"
                  value={recommendedPrice}
                  onChangeText={setRecommendedPrice}
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

              {recommendedStuffName ? (
                <View style={styles.userInfoCard}>
                  {recommendedBrandLogoUrl ? (
                    <Image
                      source={{ uri: getImageUrl(recommendedBrandLogoUrl) }}
                      style={styles.avatarPlaceholder}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.questionMark}>?</Text>
                    </View>
                  )}

                  <View style={styles.nameInputWrapper}>
                    <TextInput
                      placeholder="@추천 조합"
                      placeholderTextColor={Colors.gray.light}
                      style={styles.nameInput}
                      value={recommendedStuffName}
                      editable={false}
                    />
                  </View>
                </View>
              ) : null}

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