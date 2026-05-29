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

  const {
    brands,
    setBrands,
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

      const response = keyword
        ? await searchService.searchBrands(keyword, activeTab)
        : await searchService.getBrands(activeTab);

      setBrands(response.data.result.brands);
    } catch (error: any) {
      console.error('브랜드 조회 실패:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [searchQuery, activeTab]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
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

      <ScrollView contentContainerStyle={styles.gridContainer}>

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
                source={{ uri: brand.logoUrl }}
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

      </ScrollView>

    </View>
  );
}