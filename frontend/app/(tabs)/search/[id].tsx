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

  // 브랜드창 - 상품 리스트 나열
  const fetchStuffs = async () => {
    try {
      setLoading(true);

      const response = await searchService.getStuffsByBrand(
        Number(id),
        sort,
        0,
        10
      );

      const result = response.data.result;

      setStuffs(result.stuffs);
      setBrandInfo(result.brandName, result.totalStuffCount);
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
  }, [id, sort]);

  return (
    <View style={detailStyles.container}>
      <TopBar title={name as string} showBackButton={true} />
      
      <ScrollView
        style={{ backgroundColor: '#f5fbe7' }}
        contentContainerStyle={{ padding: 20 }}
      >
        <Text style={detailStyles.headerText}>
          {totalElements}개의 템이 있소
        </Text>
        
        {stuffs.map((item: any, index: number) => (
          <ProductCard 
            key={item.stuffId}
            rank={index + 1}
            name={item.stuffName}
            price={Number(item.price || 0).toLocaleString()}
            likes={String(item.likeCount || 0)}
            comments={String(item.postCount || 0)}
            onPress={() =>
              router.push({
                pathname: "/search/product/[id]",
                params: {
                  id: String(item.stuffId),
                  stuffName: item.stuffName,
                  brandName: name as string,
                }
              } as any)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});