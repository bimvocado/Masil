import React, { useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';

// 🌟 searchService 대신, 방금 우리가 수정한 진짜 stuffService를 가져옵니다!
import { stuffService } from '@/services/stuff-service'; // 프로젝트 폴더 구조에 맞게 경로 확인

export default function RecommendedListScreen() {
  const { id, mainStuffName } = useLocalSearchParams<{
    id: string;
    mainStuffName: string;
  }>();

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedStuffs, setRecommendedStuffs] = useState<any[]>([]);

  const fetchRecommendedStuffs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
        
      // 🌟 수정한 프론트엔드 서비스 함수 호출
      const resultData = await stuffService.getRecommendationsByStuff(Number(id));

      // 서비스 레이어에서 이미 가공된 stuffs 배열을 상태에 넣어줍니다.
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
        
        {recommendedStuffs.map((item: any, index: number) => (
          <View key={item.recommendedStuffId || index} style={styles.rankRowContainer}>
            
            <View style={styles.rankNumberBox}>
              <Text style={styles.rankNumberText}>{index + 1}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <ProductCard 
                name={item.recommendedStuffName}
                price={Number(item.price || 0).toLocaleString()}
                likes={String(item.likeCount || 0)}
                comments={String(item.scrapCount || 0)} // 백엔드 서비스의 scrapCount와 바인딩
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
                  } as any)
                }
              />
            </View>

          </View>
        ))}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
    </View>
  );
}

// 스타일시트 생략 (기존 스타일 그대로 유지)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, color: '#444' },
  rankRowContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  rankNumberBox: { width: 35, alignItems: 'center', justifyContent: 'center', marginRight: 5 },
  rankNumberText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 }
});