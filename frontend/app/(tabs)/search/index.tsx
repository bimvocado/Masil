import React, { useState } from 'react';
import { 
  View, 
  Text,
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '../../../components/styles/search';

interface BrandMock {
  brandId: number;
  brandName: string;
  category: 'FOOD' | 'STUFF';
}

// 일단 하드코딩으로 예시 맞춰둠 -> 나중에 연동해주세용
const MOCK_BRANDS: BrandMock[] = [
  { brandId: 1, brandName: '롯데리아', category: 'FOOD' },
  { brandId: 2, brandName: '맥도날드', category: 'FOOD' },
  { brandId: 3, brandName: '버거킹', category: 'FOOD' },
  { brandId: 4, brandName: '맘스터치', category: 'FOOD' },
  { brandId: 5, brandName: 'KFC', category: 'FOOD' },
  { brandId: 6, brandName: '서브웨이', category: 'FOOD' },
  { brandId: 7, brandName: '다이소', category: 'STUFF' },
  { brandId: 8, brandName: '올리브영', category: 'STUFF' },
  { brandId: 9, brandName: '이마트', category: 'STUFF' },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  
  // 음식 / 물건
  const [activeTab, setActiveTab] = useState<'FOOD' | 'STUFF'>('FOOD');
  const [searchQuery, setSearchQuery] = useState('');

  // 현재 선택된 탭의 브랜드만 필터링
  const filteredBrands = MOCK_BRANDS.filter(
    (brand) => brand.category === activeTab && brand.brandName.includes(searchQuery)
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* 상단 검색바 영역 */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Image
            source={require('@/assets/icons/search.png')}
            style={{ width: 16, height: 16, tintColor: '#aaa', marginRight: 8 }}
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

      {/*'음식 / 물건' 탭 버튼 영역 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'FOOD' && styles.activeTabButton]}
          onPress={() => setActiveTab('FOOD')}
        >
          <Text style={[styles.tabText, activeTab === 'FOOD' && styles.activeTabText]}>음식</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'STUFF' && styles.activeTabButton]}
          onPress={() => setActiveTab('STUFF')}
        >
          <Text style={[styles.tabText, activeTab === 'STUFF' && styles.activeTabText]}>물건</Text>
        </TouchableOpacity>
      </View>

      {/* 3열 그리드 브랜드 리스트 영역 */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {filteredBrands.map((brand) => (
          <TouchableOpacity key={brand.brandId} style={styles.brandCard}>
            {/* 동그라미 로고 플레이스홀더 */}
            <View style={styles.logoCircle} />
            <Text style={styles.brandNameText} numberOfLines={1}>
              {brand.brandName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </View>
  );
}

