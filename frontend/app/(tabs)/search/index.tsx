import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text,
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';

import { useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';

import { styles } from '@/components/styles/search';

import { searchService } from '@/api/search-service';
import { useSearchStore } from '@/store/search-store';
import { ProductCard } from '@/components/ui/product-card';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';
const getImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

export default function SearchScreen() {
  const router = useRouter();

  const {
  brands,
  stuffs,

  setBrands,
  setStuffs,

  setLoading,
  setError,
} = useSearchStore();

  const [activeTab, setActiveTab] =
    useState<'FOOD' | 'HOUSEHOLD'>('FOOD');

  const [searchQuery, setSearchQuery] =
    useState('');

  // 검색창 - 브랜드 리스트 3열
  const fetchBrands = async () => {
    try {
      setLoading(true);

      const keyword = searchQuery.trim();

      // 검색어가 없으면 브랜드 3열 목록 조회
//       if (!keyword) {
//         const response = await searchService.getBrands  (activeTab);
//
//         setBrands(response.data.result.brands);
//         setStuffs([]);
//
//         return;
//       }

      if (!keyword) {
        setStuffs([]);

        const response = await searchService.getBrands(activeTab);

        const brandList =
          response.data.result.brands ||
          response.data.result.brandList ||
          [];

        setBrands(brandList);

        return;
      }

      // 1. 먼저 브랜드명으로 검색
      const brandResponse = await searchService.  searchBrands(
        keyword,
        activeTab
      );

      const brandResults = brandResponse.data.result. brands;

      // 브랜드 검색 결과가 있으면 브랜드 카드만 보여줌
      if (brandResults.length > 0) {
        setBrands(brandResults);
        setStuffs([]);
        return;
      }

      // 2. 브랜드 결과가 없으면 상품명으로 검색
      const stuffResponse = await searchService.  searchStuffs(
        keyword,
        activeTab
      );

      const stuffResults = stuffResponse.data.result. stuffs;

      // 상품 검색 결과가 있으면 상품 카드만 보여줌
      setBrands([]);
      setStuffs(stuffResults);
    } catch (error: any) {
      console.error('검색 실패:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [searchQuery, activeTab]);

  return (
    <View style={styles.container}>
      <TopBar title="검색" showBackButton={false} />

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
            onChangeText={(text) => {
              setSearchQuery(text);

              if (text.trim() === '') {
                setStuffs([]);
              }
            }}
          />
        </View>
      </View>

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

      <ScrollView
        contentContainerStyle={
          searchQuery.trim() !== '' && stuffs.length > 0
            ? detailStyles.productListContainer
            : styles.gridContainer
        }
      >

        {/* 브랜드 카드 - 검색어 없거나 브랜드 검색 결과가 있을 때 */}
        {brands.map((brand) => (
          <TouchableOpacity 
            key={brand.brandId} 
            style={styles.brandCard}
            onPress={() =>
              router.push({
                pathname: "/search/[id]",
                params: {
                  id: String(brand.brandId),
                  name: brand.brandName,
                }
              })
            }
          >
            {brand.logoUrl ? (
              <Image
                source={{ uri: getImageUrl(brand.logoUrl) }}
                style={styles.logoCircle}
              />
            ) : (
              <View style={styles.logoCircle} />
            )}

            <Text
              style={styles.brandNameText}
              numberOfLines={1}
            >
              {brand.brandName}
            </Text>
          </TouchableOpacity>
        ))}

        {/* 상품 카드 - 브랜드 검색 결과가 없고 상품 검색         결과만 있을 때 */}
        {brands.length === 0 &&
          searchQuery.trim() !== '' &&
          stuffs.map((item: any, index: number) => (
            <ProductCard
              key={item.stuffId}
              rank={index + 1}
              name={item.stuffName}
              price={Number(item.price || 0).toLocaleString       ()}
              likes={String(item.likeCount || 0)}
              comments={String(item.postCount || 0)}
              onPress={() =>
                router.push({
                  pathname: '/search/product/[id]',
                  params: {
                    id: String(item.stuffId),
                    stuffName: item.stuffName,
                    brandName: item.brandName,
                  },
                } as any)
              }
            />
          ))}

      </ScrollView>

    </View>
  );
}

const detailStyles = StyleSheet.create({
  productListContainer: {
    padding: 20,
  },
});