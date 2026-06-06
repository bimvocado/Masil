import React, { useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
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

  const fetchStuffs = useCallback(async () => {
    try {
      setLoading(true);

      const response = await searchService.getStuffsByBrand(
        Number(id),
        sort,
        0,
        10
      );

      const result = response.data.result;

      // 💰 [정제] 백엔드 응답 필드가 무엇이든 averagePrice로 통일하여 매핑합니다.
      const processedStuffs = (result.stuffs || []).map((item: any) => ({
        ...item,
        averagePrice: item.averagePrice ?? item.avgPrice ?? item.price ?? 0
      }));

      setStuffs(processedStuffs);
      setBrandInfo(result.brandName, result.totalStuffCount);
    } catch (error: any) {
      console.error('브랜드별 상품 조회 실패:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id, sort, setStuffs, setBrandInfo, setLoading, setError]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchStuffs();
      }
      return () => {};
    }, [id, fetchStuffs])
  );

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
        
        {stuffs.map((item: any, index: number) => {
          return (
            <ProductCard 
              key={item.stuffId}
              rank={index + 1}
              name={item.stuffName}
              // 💸 정제된 averagePrice를 안전하게 콤마 포맷팅합니다.
              price={Number(item.averagePrice ?? 0).toLocaleString()}
              likes={String(item.likeCount || 0)}
              comments={String(item.postCount || 0)}
              imageUrl={
                item.imageUrl?.startsWith('http')
                  ? item.imageUrl
                  : `${process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org'}${item.imageUrl?.startsWith('/') ? '' : '/'}${item.imageUrl}`
              }
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
          );
        })}
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