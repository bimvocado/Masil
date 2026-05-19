import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';

export default function ProductDetailScreen() {
  const { name, brand } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <TopBar title="상품 이름" showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#f5fbe7' }}>
        {/* 상단 리뷰 사진 영역 */}
        <View style={styles.imagePlaceholderBox}>
          <Text style={styles.imageLabel}>옳소 가장 많은 리뷰의 사진</Text>
        </View>

        {/* 상품 정보 */}
        <View style={styles.infoSection}>
          <Text style={styles.brandLink}>브랜드명(누르면 바로감) {brand}</Text>
          <Text style={styles.productTitle}>{name || "새우버거"}</Text>
          <Text style={styles.priceText}>1,234원</Text>
        </View>

        <View style={styles.divider} />

        {/* 통계 지표 (좋아요/싫어요/점수 등) */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}><Text>👍 1,234</Text><Text>👎 1,234</Text></View>
          <View style={styles.statRow}><Text>🟡 1,234</Text><Text>🟡 1,234</Text></View>
          <View style={styles.statRow}><Text>🔵 1,234</Text><Text>🔵 1,234</Text></View>
        </View>

        <View style={styles.divider} />

        {/* 추천 조합 (컴포넌트 재사용!) */}
        <Text style={styles.sectionTitle}>추천조합</Text>
        <ProductCard rank={1} name="상품이름" price="1,234" likes="1,234" comments="1,234" />
        <ProductCard rank={2} name="상품이름" price="1,234" likes="1,234" comments="1,234" />
        
        <TouchableOpacity><Text style={styles.moreText}>더보기 {'>'}</Text></TouchableOpacity>

        {/* 하단 리뷰 영역 */}
        <View style={styles.reviewHeader}>
          <Text>리뷰</Text>
          <Text>옳소리뷰▼</Text>
        </View>
        <View style={styles.reviewBox}>
          <Text>여기 리뷰는 뭐지?? 게시글 연결인가?</Text>
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