import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';
import { InteractionButton } from '@/constants/interaction-button';
import { InteractionStatsBar } from '@/components/ui/interaction-stats-bar';

import { searchService } from '@/api/search-service';
import { useSearchStore } from '@/store/search-store';

export default function ProductDetailScreen() {
  const { id, stuffName, brandName } = useLocalSearchParams<{
    id: string;
    stuffName: string;
    brandName: string;
  }>();

  const router = useRouter();

  const {
    stuffDetail,
    loading,
    setStuffDetail,
    setLoading,
    setError,
  } = useSearchStore();

  const fetchStuffDetail = async () => {
    try {
      setLoading(true);

      const response = await searchService.getStuffDetail(Number(id));

      setStuffDetail(response.data);
    } catch (error: any) {
      console.error('상품 상세 조회 실패:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStuffDetail();
    }
  }, [id]);

  if (loading || !stuffDetail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text style={{ marginTop: 10 }}>로딩중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title={stuffDetail?.stuffName || stuffName || "상품 상세"} showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#f5fbe7' }}>
        {/* 상단 리뷰 사진 영역 */}
        <View style={styles.imagePlaceholderBox}>
          {stuffDetail.bestReviewImageUrl ? (
            <Image
              source={{ uri: stuffDetail.bestReviewImageUrl }}
              style={styles.reviewImage}
            />
          ) : (
            <Text style={styles.imageLabel}>가장 인기 있는 리뷰 사진</Text>
          )}
        </View>

        {/* 상품 정보 */}
        <View style={styles.infoSection}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/search/[id]',
                params: {
                  id: stuffDetail.brandId,
                  name: stuffDetail.brandName,
                },
              })
            }
          >
            <Text style={styles.brandLink}>브랜드: {stuffDetail?.brandName || brandName || "브랜드 미정"}</Text>
          </TouchableOpacity>

          <Text style={styles.productTitle}>{stuffDetail?.stuffName || stuffName || "상품명 없음"}</Text>
          <Text style={styles.priceText}>
            {stuffDetail?.price ? stuffDetail.price.toLocaleString() : '가격 정보 없음'}원
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 통계 지표 */}
        <InteractionStatsBar 
          likeStats={{
            total: stuffDetail.likeCount,
            korean: stuffDetail.koreanLikeCount,
            foreign: stuffDetail.foreignLikeCount,
          } as any}
          dislikeStats={{
            total: stuffDetail.dislikeCount,
          } as any}
        />

        {/* interaction 버튼 */}
        <View style={styles.statsContainer}>
          <InteractionButton
            type="like"
            count={stuffDetail.likeCount}
            isActive={false}
            onPress={() => {}}
            textPosition="right"
          />
          <InteractionButton
            type="dislike"
            count={stuffDetail.dislikeCount}
            isActive={false}
            onPress={() => {}}
            textPosition="right"
          />
        </View>

        <View style={styles.divider} />

        {/* 추천 조합 */}
        <Text style={styles.sectionTitle}>추천조합</Text>

        {stuffDetail.recommendedStuffs.length > 0 ? (
          stuffDetail.recommendedStuffs.map((item, index) => (
            <ProductCard
              key={item.stuffId}
              rank={index + 1}
              name={item.stuffName}
              price={item.price.toLocaleString()}
              likes={item.likeCount.toString()}
              comments={item.dislikeCount.toString()}
              onPress={() =>
                router.push({
                  pathname: "/search/product/[id]",
                  params: {
                    id: item.stuffId,
                    stuffName: item.stuffName,
                    brandName: stuffDetail.brandName,
                  },
                } as any)
              }
            />
          ))
        ) : (
          <Text style={{ color: '#666' }}>추천 조합이 없습니다.</Text>
        )}
        
        <TouchableOpacity><Text style={styles.moreText}>더보기 {'>'}</Text></TouchableOpacity>

        <View style={styles.divider} />

        {/* 하단 리뷰 영역 */}
        <View style={styles.reviewHeader}>
          <Text style={{ fontWeight: 'bold' }}>리뷰</Text>
          <TouchableOpacity>
            <Text>옳소리뷰 순 ▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewBox}>
          {stuffDetail.bestReview ? (
            <>
              <Text style={{ fontWeight: 'bold' }}>
                {stuffDetail.bestReview.user.nickname}
              </Text>
              <Text style={{ color: '#666', marginTop: 5 }}>
                {stuffDetail.bestReview.content}
              </Text>
              <Text style={{ color: '#888', marginTop: 5 }}>
                옳소 {stuffDetail.bestReview.likeCount}
              </Text>
            </>
          ) : (
            <Text style={{ color: '#666' }}>
              여기는 유저들이 작성한 게시글(Post) 중 {"\n"}
              이 상품({stuffDetail?.stuffName || stuffName})에 대한 리뷰가 뜰 자리입니다!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  imagePlaceholderBox: { height: 180, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  reviewImage: { width: '100%', height: '100%' },
  imageLabel: { color: '#888', textAlign: 'center' },
  infoSection: { marginBottom: 15 },
  brandLink: { color: '#888', fontSize: 12, marginBottom: 5 },
  productTitle: { fontSize: 24, fontWeight: 'bold' },
  priceText: { fontSize: 18, color: '#444' },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 15 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 5 }, 
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  moreText: { textAlign: 'right', color: '#888', fontSize: 12 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 },
  reviewBox: { minHeight: 100, backgroundColor: '#EEE', borderRadius: 20, padding: 20, justifyContent: 'center' }
});