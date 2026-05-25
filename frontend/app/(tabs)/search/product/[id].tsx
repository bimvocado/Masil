import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';
import { InteractionButton } from '@/constants/interaction-button';
import { useStuffDetail } from '@/hooks/useStuffDetail';
import { InteractionStatsBar } from '@/components/ui/interaction-stats-bar';

export default function ProductDetailScreen() {
  const { id, stuffName, brandName } = useLocalSearchParams<{ id: string; stuffName: string; brandName: string }>();

  // 훅에서 로딩상태, 데이터, 클릭함수 꺼내옴
  const { loading, detailData, handleToggle } = useStuffDetail(id);

  if (loading) {
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
          <Text style={styles.imageLabel}>가장 인기 있는 리뷰 사진</Text>
        </View>

        {/* 상품 정보 */}
        <View style={styles.infoSection}>
          <TouchableOpacity>
            <Text style={styles.brandLink}>브랜드: {detailData?.brandName || brandName || "브랜드 미정"}</Text>
          </TouchableOpacity>
          <Text style={styles.productTitle}>{detailData?.stuffName || stuffName || "상품명 없음"}</Text>
          <Text style={styles.priceText}>
            {detailData?.price ? detailData.price.toLocaleString() : '가격 정보 없음'}원
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 통계 지표 (버튼) */}
        <InteractionStatsBar 
          likeStats={detailData?.interactionStats?.like} 
          dislikeStats={detailData?.interactionStats?.dislike} 
        />

        {/* interaction 버튼 */}
        <View style={styles.statsContainer}>
          <InteractionButton
            type="like"
            count={detailData?.interactionStats?.total || 0}
            isActive={detailData?.interactionStats?.myReaction === 'LIKE'}
            onPress={() => handleToggle('LIKE')}
            textPosition="right"
          />
          <InteractionButton
            type="dislike"
            count={detailData?.interactionStats?.total || 0}
            isActive={detailData?.interactionStats?.myReaction === 'DISLIKE'}
            onPress={() => handleToggle('DISLIKE')}
            textPosition="right"
          />
        </View>

        <View style={styles.divider} />

        {/* 추천 조합 */}
        <Text style={styles.sectionTitle}>추천조합</Text>
        <ProductCard rank={1} name="콜라 세트" price="2,000" likes="500" comments="12" />
        <ProductCard rank={2} name="치즈스틱 추가" price="1,500" likes="300" comments="8" />
        
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
          <Text style={{ color: '#666' }}>
            여기는 유저들이 작성한 게시글(Post) 중 {"\n"}
            이 상품({detailData?.stuffName || stuffName})에 대한 리뷰가 뜰 자리입니다!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  imagePlaceholderBox: { height: 180, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
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
  reviewBox: { height: 100, backgroundColor: '#EEE', borderRadius: 20, padding: 20, justifyContent: 'center' }
});