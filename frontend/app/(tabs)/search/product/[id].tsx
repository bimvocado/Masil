import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';
import { Post } from '@/types/post'; 

export default function ProductDetailScreen() {
  
  const { stuffName, brandName } = useLocalSearchParams<{ stuffName: string; brandName: string }>();

  return (
    <View style={styles.container}>
      <TopBar title={stuffName || "상품 상세"} showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#f5fbe7' }}>
        {/* 상단 리뷰 사진 영역 */}
        <View style={styles.imagePlaceholderBox}>
          <Text style={styles.imageLabel}>가장 인기 있는 리뷰 사진</Text>
        </View>

        {/* 상품 정보 */}
        <View style={styles.infoSection}>
          {/* 브랜드 클릭 시 해당 브랜드 상세로 이동하게 설계하면 좋음 */}
          <TouchableOpacity>
            <Text style={styles.brandLink}>브랜드: {brandName || "브랜드 미정"}</Text>
          </TouchableOpacity>
          <Text style={styles.productTitle}>{stuffName || "상품명 없음"}</Text>
          <Text style={styles.priceText}>1,234원</Text>
        </View>

        <View style={styles.divider} />

        {/* 통계 지표 */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text>👍 좋아요 1,234</Text>
            <Text>👎 별로요 1,234</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 추천 조합 (ProductCard 내부 변수명도 stuffName으로 통일하면 더 좋음!) */}
        <Text style={styles.sectionTitle}>추천조합</Text>
        <ProductCard rank={1} name="콜라 세트" price="2,000" likes="500" comments="12" />
        <ProductCard rank={2} name="치즈스틱 추가" price="1,500" likes="300" comments="8" />
        
        <TouchableOpacity><Text style={styles.moreText}>더보기 {'>'}</Text></TouchableOpacity>

        <View style={styles.divider} />

        {/* 하단 리뷰 영역: 여기가 바로 '게시글(Post)'들이 보일 곳입니다! */}
        <View style={styles.reviewHeader}>
          <Text style={{ fontWeight: 'bold' }}>리뷰</Text>
          <TouchableOpacity>
            <Text>옳소리뷰 순 ▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewBox}>
          <Text style={{ color: '#666' }}>
            여기는 유저들이 작성한 게시글(Post) 중 {"\n"}
            이 상품({stuffName})에 대한 리뷰가 뜰 자리입니다!
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
  statsContainer: { paddingHorizontal: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  moreText: { textAlign: 'right', color: '#888', fontSize: 12 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 10 },
  reviewBox: { height: 100, backgroundColor: '#EEE', borderRadius: 20, padding: 20, justifyContent: 'center' }
});