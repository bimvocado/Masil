import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';
import { InteractionButton } from '@/constants/interaction-button';
import { InteractionStatsBar } from '@/components/ui/interaction-stats-bar';

import { useStuffDetail } from '@/hooks/useStuffDetail';

export default function ProductDetailScreen() {
  const { id, stuffName, brandName } = useLocalSearchParams<{
    id: string;
    stuffName: string;
    brandName: string;
  }>();

  const router = useRouter();
  const { loading, detailData, handleToggle } = useStuffDetail(id || '');

  if (loading || !detailData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text style={{ marginTop: 10 }}>로딩중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title={detailData?.stuffName || stuffName || "상품 상세"} showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#f5fbe7' }}>
        {/* 상단 리뷰 사진 영역 */}
        <View style={styles.imagePlaceholderBox}>
          {detailData.bestReviewImageUrl ? (
            <Image
              source={{ uri: detailData.bestReviewImageUrl }}
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
                  id: detailData.brandId,
                  name: detailData.brandName,
                },
              })
            }
          >
            <Text style={styles.brandLink}>브랜드: {detailData?.brandName || brandName || "브랜드 미정"}</Text>
          </TouchableOpacity>

          <Text style={styles.productTitle}>{detailData?.stuffName || stuffName || "상품명 없음"}</Text>
          <Text style={styles.priceText}>
            {detailData?.price ? detailData.price.toLocaleString() : '가격 정보 없음'}원
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 통계 지표 */}
        <InteractionStatsBar 
          likeStats={{
            total: detailData.likeCount,
            korean: detailData.koreanLikeCount,
            foreign: detailData.foreignLikeCount,
          } as any}
          dislikeStats={{
            total: detailData.dislikeCount,
          } as any}
        />

        {/* interaction 버튼 */}
        <View style={styles.statsContainer}>
          <InteractionButton
            type="like"
            count={detailData.likeCount}
            isActive={detailData.myReaction === 'LIKE'}
            onPress={() => {
              console.log('[ProductDetailScreen] like button pressed');
              handleToggle('LIKE');
            }}
            textPosition="right"
          />
          <InteractionButton
            type="dislike"
            count={detailData.dislikeCount}
            isActive={detailData.myReaction === 'DISLIKE'}
            onPress={() => {
              console.log('[ProductDetailScreen] dislike button pressed');
              handleToggle('DISLIKE');
            }}
            textPosition="right"
          />
        </View>

        <View style={styles.divider} />

        {/* 추천 조합 */}
        <Text style={styles.sectionTitle}>추천조합</Text>

        {detailData.recommendedStuffs.length > 0 ? (
          detailData.recommendedStuffs.map((item, index) => (
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
                    brandName: detailData.brandName,
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
          {detailData.bestReview ? (
            <>
              <Text style={{ fontWeight: 'bold' }}>
                {detailData.bestReview.user.nickname}
              </Text>
              <Text style={{ color: '#666', marginTop: 5 }}>
                {detailData.bestReview.content}
              </Text>
              <Text style={{ color: '#888', marginTop: 5 }}>
                옳소 {detailData.bestReview.likeCount}
              </Text>
            </>
          ) : (
            <Text style={{ color: '#666' }}>
              여기는 유저들이 작성한 게시글(Post) 중 {"\n"}
              이 상품({detailData?.stuffName || stuffName})에 대한 리뷰가 뜰 자리입니다!
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