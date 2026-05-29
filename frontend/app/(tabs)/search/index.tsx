import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text,
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { styles } from '@/components/styles/search';

import { searchService } from '@/api/search-service';
import { useSearchStore } from '@/store/search-store';

export default function SearchScreen() {

  const insets = useSafeAreaInsets();
  const router = useRouter();

  // zustand store
  const {
    brands,
    setBrands,
    loading,
    setLoading,
    setError,
  } = useSearchStore();

  // 음식 / 물건
  const [activeTab, setActiveTab] =
    useState<'FOOD' | 'HOUSEHOLD'>('FOOD');

  // 검색어
  const [searchQuery, setSearchQuery] =
    useState('');



  /**
   * 브랜드 목록 조회
   */
  const fetchBrands = async () => {

    try {

      setLoading(true);

      const response =
        await searchService.getBrands(
          searchQuery,
          activeTab
        );

      // 반환 값 확인
      console.log(response);

      setBrands(response.data);

    } catch (error: any) {

      console.error(error);

      setError(error.message);

    } finally {

      setLoading(false);
    }
  };



  /**
   * 검색어 / 탭 변경 시 자동 조회
   */
  useEffect(() => {

    fetchBrands();

  }, [searchQuery, activeTab]);



  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* 상단 검색바 영역 */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>

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
            style={styles.input}
            placeholder="브랜드 or 상품"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>



      {/* 음식 / 물건 탭 버튼 영역 */}
      <View style={styles.tabContainer}>

        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'FOOD' &&
            styles.activeTabButton
          ]}
          onPress={() => setActiveTab('FOOD')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'FOOD' &&
              styles.activeTabText
            ]}
          >
            음식
          </Text>
        </TouchableOpacity>
        

        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'HOUSEHOLD' &&
            styles.activeTabButton
          ]}
          onPress={() => setActiveTab('HOUSEHOLD')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'HOUSEHOLD' &&
              styles.activeTabText
            ]}
          >
            물건
          </Text>
        </TouchableOpacity>

      </View>



      {/* 3열 그리드 브랜드 리스트 영역 */}
      <ScrollView contentContainerStyle={styles.gridContainer}>

        {brands.map((brand) => (

          <TouchableOpacity 
            key={brand.brandId} 
            style={styles.brandCard}

            // 브랜드 클릭 시 상세 페이지 이동
            onPress={() =>
              router.push({
                pathname: "/search/[id]",
                params: {
                  id: brand.brandId,
                  name: brand.brandName
                }
              })
            }
          >

            {/* 브랜드 로고 */}
            {brand.logoUrl ? (
              <Image
                source={{ uri: brand.logoUrl }}
                style={styles.logoCircle}
              />
            ) : (
              <View style={styles.logoCircle} />
            )}

            {/* 브랜드 이름 */}
            <Text
              style={styles.brandNameText}
              numberOfLines={1}
            >
              {brand.brandName}
            </Text>

          </TouchableOpacity>
        ))}

      </ScrollView>

    </View>
  );
}