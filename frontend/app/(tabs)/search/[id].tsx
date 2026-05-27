import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';

import { searchService, StuffSort } from '@/api/search-service';
import { useSearchStore } from '@/store/search-store';

export default function BrandDetailScreen() {
  const { id, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>(); 

  const router = useRouter();

  const [sort] = useState<StuffSort>('LIKE_DESC');

  const {
    stuffs,
    totalElements,
    setStuffs,
    setBrandInfo,
    setLoading,
    setError,
  } = useSearchStore();

  const fetchStuffs = async () => {
    try {
      setLoading(true);

      const response = await searchService.getStuffsByBrand(
        Number(id),
        sort,
        0,
        10
      );

      setStuffs(response.data.stuffList);
      setBrandInfo(response.data.brandName, response.data.totalElements);
    } catch (error: any) {
      console.error('브랜드별 상품 조회 실패:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStuffs();
    }
  }, [id]);

  return (
    <View style={detailStyles.container}>
      <TopBar title={name as string} showBackButton={true} />
      
      <ScrollView style={{ backgroundColor: '#f5fbe7' }} contentContainerStyle={{ padding: 20 }}>
        <Text style={detailStyles.headerText}>{totalElements}개의 템이 있소</Text>
        
        {stuffs.map((item) => (
          <ProductCard 
            key={item.stuffId}
            rank={item.rank}
            name={item.stuffName}
            price={item.price.toLocaleString()}
            likes={item.likeCount.toString()}
            comments={item.dislikeCount.toString()}
            onPress={() => router.push({
              pathname: "/search/product/[id]",
              params: {
                id: item.stuffId,
                stuffName: item.stuffName,
                brandName: name
              }
            } as any)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
});