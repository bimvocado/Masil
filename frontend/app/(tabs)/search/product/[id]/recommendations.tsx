import React, { useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';
import { stuffService, RecommendedStuff } from '@/services/stuff-service'; 

export default function RecommendedListScreen() {
  // 중첩 라우팅 구조([id]/recommendations) 덕분에 id 인자를 온전히 인식합니다.
  const { id, mainStuffName } = useLocalSearchParams<{
    id: string;
    mainStuffName: string;
  }>();

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedStuffs, setRecommendedStuffs] = useState<RecommendedStuff[]>([]);

  const fetchRecommendedStuffs = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
        
      const resultData = await stuffService.getRecommendationsByStuff(Number(id));
      setRecommendedStuffs(resultData.stuffs || []);
    } catch (err: any) {
      console.error('추천 조합 상세 리스트 조회 실패:', err);
      setError(err.message || '데이터를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchRecommendedStuffs();
      }
      return () => {};
    }, [id, fetchRecommendedStuffs])
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text style={{ marginTop: 10 }}>추천 조합 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title={`${mainStuffName || '상품'} 추천 조합`} showBackButton={true} />
      
      <ScrollView
        style={{ backgroundColor: '#f5fbe7' }}
        contentContainerStyle={{ padding: 20 }}
      >
        <Text style={styles.headerText}>
          {recommendedStuffs.length}개의 추천 조합
        </Text>
        
        {recommendedStuffs.map((item: RecommendedStuff, index: number) => {
          // 💰 [평균가 주입] item.averagePrice나 item.avgPrice가 있으면 쓰고, 없으면 기존 단가로 백업 처리
          const calculatedAvgPrice = item.averagePrice ?? (item as any).avgPrice ?? item.price ?? 0;

          return (
            <View key={item.recommendedStuffId || index} style={styles.rankRowContainer}>
              
              <View style={styles.rankNumberBox}>
                <Text style={styles.rankNumberText}>{index + 1}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <ProductCard 
                  name={item.recommendedStuffName}
                  // 💰 기존 `item.price` 대신 여러 유저의 평균 가격으로 포맷팅하여 컴포넌트에 주입합니다.
                  price={Number(calculatedAvgPrice).toLocaleString()}
                  likes={String(item.likeCount || 0)}
                  comments={String(item.scrapCount || 0)} 
                  imageUrl={
                    item.recommendedImageUrl?.startsWith('http')
                      ? item.recommendedImageUrl
                      : `${process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org'}${item.recommendedImageUrl?.startsWith('/') ? '' : '/'}${item.recommendedImageUrl}`
                  }
                  onPress={() =>
                    router.push({
                      pathname: "/search/product/[id]",
                      params: {
                        id: String(item.recommendedStuffId),
                        stuffName: item.recommendedStuffName,
                        brandName: item.recommendedBrandName,
                      }
                    })
                  }
                />
              </View>

            </View>
          );
        })}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, color: '#444' },
  rankRowContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  rankNumberBox: { width: 35, alignItems: 'center', justifyContent: 'center', marginRight: 5 },
  rankNumberText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 }
});