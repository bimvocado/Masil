import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { TopBar } from '@/components/layout/top-bar';
//import { ProductCard } from '@/components/ui/product-card';
import { InteractionButton } from '@/constants/interaction-button';
import { InteractionStatsBar } from '@/components/ui/interaction-stats-bar';

//import { searchService } from '@/api/search-service';

import { useStuffDetail } from '@/hooks/useStuffDetail';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';

// 💡 방법 1: 추천 조합의 이미지가 없을 때 사용할 디폴트 이미지 URL을 정의합니다.
// (원하시는 기본 이미지의 웹 주소로 변경하여 사용하세요!)
const DEFAULT_IMAGE_URL = 'https://supermasil.duckdns.org/uploads/default-product.png'; 

const getImageUrl = (url?: string | null) => {
  // 💡 이미지가 비어있거나 null/undefined인 경우 디폴트 이미지를 반환합니다.
  if (!url) return DEFAULT_IMAGE_URL;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

export default function ProductDetailScreen() {
  const { id, stuffName, brandName } = useLocalSearchParams<{
    id: string;
    stuffName: string;
    brandName: string;
  }>();

  const router = useRouter();
  const { loading, detailData, handleToggle } = useStuffDetail(String(id));

  console.log('상세 detailData:', detailData);

  if (loading || !detailData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text style={{ marginTop: 10 }}>로딩중...</Text>
      </View>
    );
  }

  console.log("==========================================");
  console.log("📍 [상품 상세 데이터 로드 성공]");
  console.log(`- 전체 좋아요: ${detailData.likeCount}`);
  console.log(`- 내국인(K): ${detailData.koreanLikeCount}`);
  console.log(`- 외국인(F): ${detailData.foreignerLikeCount}`);
  console.log(`- 내 국적 상태(isKorean): ${(detailData as any).isKorean}`);
  console.log("==========================================");

  return (
    <View style={styles.container}>
      <TopBar title={detailData.stuffName || stuffName || '상품 상세'} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: '#f5fbe7' }}>
        
        {/* 상단 대표 이미지 */}
        <View style={styles.imagePlaceholderBox}>
          {detailData.imageUrl ? (
            <Image source={{ uri: detailData.imageUrl }} style={styles.reviewImage} />
          ) : (
            <Text style={styles.imageLabel}>베스트 스크랩 리뷰 사진</Text>
          )}
        </View>

        {/* 상품 정보 */}
        <View style={styles.infoSection}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/search/[id]',
                params: { id: String(detailData.brandId), name: detailData.brandName },
              })
            }
          >
            <Text style={styles.brandLink}>브랜드: {detailData.brandName || brandName || '브랜드 미정'}</Text>
          </TouchableOpacity>
          <Text style={styles.productTitle}>{detailData.stuffName || stuffName || '상품명 없음'}</Text>
          <Text style={styles.priceText}>
            {detailData.price ? detailData.price.toLocaleString() : '가격 정보 없음'}원
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 📊 좋아요 / 싫어요 통계 바 */}
        <InteractionStatsBar
          likeStats={{
            total: detailData.likeCount,
            ratio: detailData.likeRatio,
            korean: detailData.koreanLikeCount,
            foreigner: detailData.foreignerLikeCount,
          }}
          dislikeStats={{
            total: detailData.dislikeCount,
            ratio: detailData.dislikeRatio,
            korean: detailData.koreanDislikeCount,
            foreigner: detailData.foreignerDislikeCount,
          }}
        />

        {/* 옳소/싫소 버튼 */}
        <View style={styles.statsContainer}>
            <InteractionButton
              type="like"
              count={detailData.likeCount}
              isActive={detailData.myReaction === 'LIKE'}
              onPress={() => handleToggle('LIKE')}
              textPosition="right"
            />
            <InteractionButton
              type="dislike"
              count={detailData.dislikeCount}
              isActive={detailData.myReaction === 'DISLIKE'}
              onPress={() => handleToggle('DISLIKE')}
              textPosition="right"
            />
        </View>

        <View style={styles.divider} />

        {/* 추천 조합 (2번 문제 해결 - 이미지 디폴트 처리 및 클릭 시 상세이동) */}
        <Text style={styles.sectionTitle}>추천조합</Text>

        {detailData.topPost?.recommendedStuffName ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              const recStuffId = detailData.topPost?.recommendedStuffId;
              const recStuffName = detailData.topPost?.recommendedStuffName;
              const recBrandName = detailData.topPost?.recommendedBrandName;

              if (!recStuffId) {
                console.warn("📍 [경고] 추천 상품의 recommendedStuffId가 없습니다.");
                return;
              }

              console.log(`📍 [이동] 추천 상품 상세 페이지로 이동. ID: ${recStuffId}`);

              router.push({
                pathname: '/search/product/[id]', 
                params: {
                  id: String(recStuffId),
                  stuffName: recStuffName || '',
                  brandName: recBrandName || '',
                },
              });
            }}
            style={styles.recommendedContainer}
          >
            {/* 💡 이미지가 없어도 getImageUrl을 통해 디폴트 이미지 URL을 받아와서 항상 출력합니다. */}
            <Image
              source={{ uri: getImageUrl(detailData.topPost.recommendedImageUrl) }}
              style={styles.recommendedImage}
            />

            <View style={{ justifyContent: 'center', flex: 1 }}>
              <Text style={styles.recBrandText}>{detailData.topPost.recommendedBrandName}</Text>
              <Text style={styles.recStuffText}>{detailData.topPost.recommendedStuffName}</Text>
              <Text style={styles.clickGuideText}>상세보기 〉</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={styles.emptyText}>추천 조합이 없습니다.</Text>
        )}
        
        <TouchableOpacity>
          <Text style={styles.moreText}>더보기 {'>'}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 하단 리뷰 영역 (원래 주신 소스코드 형태를 100% 보존합니다) */}
        <View style={styles.reviewHeader}>
          <Text style={{ fontWeight: 'bold' }}>리뷰</Text>
          <TouchableOpacity>
            <Text>스크랩 많은 순 ▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewBox}>
          {detailData.topPost ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                const postId = detailData.topPost?.postId;
              
                if (!postId) {
                  console.warn('대표 리뷰 postId가 없습니다.');
                  return;
                }
              
                router.push({
                  pathname: '/search/post/[id]',
                  params: {
                    id: String(postId),
                    fetchType: 'single',
                  },
                } as any);
              }}
            >
              
              <Text style={{ fontWeight: 'bold' }}>{detailData.topPost.nickname}</Text>
              <Text style={{ color: '#666', marginTop: 5 }}>{detailData.topPost.content}</Text>
              <Text style={{ color: '#888', marginTop: 5 }}>스크랩 {detailData.topPost.scrapCount}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: '#666' }}>아직 이 상품에 대한 리뷰가 없습니다.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  imagePlaceholderBox: {
    height: 180, backgroundColor: '#fff', borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden',
  },
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
  reviewBox: { minHeight: 100, backgroundColor: '#EEE', borderRadius: 20, padding: 20, justifyContent: 'center' },
  
  // 💡 추천 조합 영역 컴포넌트들을 가로정렬 및 깔끔하게 배치하는 스타일들입니다.
  recommendedContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginVertical: 5,
    alignItems: 'center',
  },
  recommendedImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 12, 
    marginRight: 12 
  },
  recBrandText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  recStuffText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clickGuideText: {
    fontSize: 11,
    color: '#FF8A00',
    marginTop: 4,
    fontWeight: '600',
  },
  emptyText: {
    color: '#888',
    marginVertical: 10,
  },
});