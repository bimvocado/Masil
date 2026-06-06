import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Dimensions, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { TopBar } from '@/components/layout/top-bar';
import { InteractionButton } from '@/constants/interaction-button';
import { InteractionStatsBar } from '@/components/ui/interaction-stats-bar';

import { useStuffDetail } from '@/hooks/useStuffDetail';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';

// 🌟 가로 스와이프 시 다음 추천 상품이 화면 우측에 살짝 노출되도록 카드 너비를 정의합니다. (화면 가로폭의 82%)
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;

// 추천 조합의 이미지가 없을 때 사용할 디폴트 이미지 URL
const DEFAULT_IMAGE_URL = 'https://supermasil.duckdns.org/uploads/default-product.png'; 

const getImageUrl = (url?: string | null) => {
  if (!url) return DEFAULT_IMAGE_URL;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

export default function ProductDetailScreen() {
  const { id, stuffName, brandName } = useLocalSearchParams<{
    id: string;
    name: string;
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

  // 🌟 백엔드 DTO에서 추가해준 recommendations 배열을 가져옵니다. (안전하게 최대 4개 보장)
  const recommendationsData = (detailData as any).recommendations?.slice(0, 4) || [];

  // 🌟 가로 스크롤로 렌더링할 개별 추천 카드 컴포넌트
  const renderRecommendationItem = ({ item }: { item: any }) => {
    // 💰 [추가/수정] 추천 조합 상품 리스트의 유저 포스트 정산 평균 가격을 최우선으로 추출합니다.
    const recAvgPrice = item.averagePrice ?? item.avgPrice ?? item.price ?? 0;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          const recStuffId = item.recommendedStuffId;
          const recStuffName = item.recommendedStuffName;
          const recBrandName = item.recommendedBrandName;

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
        <Image
          source={{ uri: getImageUrl(item.recommendedImageUrl) }}
          style={styles.recommendedImage}
        />

        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Text style={styles.recBrandText}>{item.recommendedBrandName}</Text>
          <Text style={styles.recStuffText} numberOfLines={1}>{item.recommendedStuffName}</Text>
          {/* 💸 정산된 평균 가격을 천 단위로 콤마 처리하여 렌더링합니다. */}
          <Text style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
            평균 {recAvgPrice ? Number(recAvgPrice).toLocaleString() : '0'}원
          </Text>
          <Text style={styles.clickGuideText}>상세보기 〉</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // 메인 상품의 평균 가격 계산 유연화
  const mainAveragePrice = detailData.averagePrice ?? detailData.avgPrice ?? detailData.price;

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
            평균 {mainAveragePrice ? Number(mainAveragePrice).toLocaleString() : '0'}원
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

        {/* 추천조합 타이틀 영역 */}
        <View style={styles.recommendationHeader}>
          <Text style={styles.sectionTitle}>추천조합</Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/search/product/[id]/recommendations', 
                params: {
                  id: String(detailData.stuffId),
                  mainStuffName: detailData.stuffName || stuffName || '',
                },
              } as any);
            }}
          >
            <Text style={styles.moreText}>더보기 {'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* 🌟 다중 리스트 혹은 백업용 단일 리스트 분기 영역 */}
        {recommendationsData.length > 0 ? (
          <FlatList
            data={recommendationsData}
            renderItem={renderRecommendationItem}
            keyExtractor={(item, index) => item.recommendedStuffId ? String(item.recommendedStuffId) : String(index)}
            horizontal={true}                    
            showsHorizontalScrollIndicator={false} 
            snapToInterval={CARD_WIDTH + 12}      
            decelerationRate="fast"
            contentContainerStyle={styles.horizontalListPadding}
          />
        ) : (
          /* ✅ [수정 완료] 백업용 topPost 단일 렌더링 카드 내에서도 평균 가격 데이터를 우선 조회하도록 수정합니다. */
          detailData.topPost?.recommendedStuffName ? (
            <FlatList
              data={[detailData.topPost]}
              renderItem={({ item }: { item: any }) => {
                const legacyPrice = item.averagePrice ?? item.avgPrice ?? item.price ?? 0;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      const recStuffId = item.recommendedStuffId;
                      if (!recStuffId) return;
                      router.push({
                        pathname: '/search/product/[id]', 
                        params: { id: String(recStuffId), stuffName: item.recommendedStuffName || '', brandName: item.recommendedBrandName || '' },
                      });
                    }}
                    style={styles.recommendedContainer}
                  >
                    <Image source={{ uri: getImageUrl(item.recommendedImageUrl) }} style={styles.recommendedImage} />
                    <View style={{ justifyContent: 'center', flex: 1 }}>
                      <Text style={styles.recBrandText}>{item.recommendedBrandName}</Text>
                      <Text style={styles.recStuffText}>{item.recommendedStuffName}</Text>
                      <Text style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
                        {/* 💸 기존 단가 고정 노출 대신 정산된 평균 가격을 반영합니다. */}
                        평균 {legacyPrice ? Number(legacyPrice).toLocaleString() : '0'}원
                      </Text>
                      <Text style={styles.clickGuideText}>상세보기 〉</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              horizontal={true}
              contentContainerStyle={styles.horizontalListPadding}
            />
          ) : (
            <Text style={styles.emptyText}>추천 조합이 없습니다.</Text>
          )
        )}

        <View style={styles.divider} />

        {/* 하단 리뷰 영역 */}
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
                });
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
  scrollContent: { paddingBottom: 30 }, 
  imagePlaceholderBox: {
    height: 180, backgroundColor: '#fff', borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, marginTop: 20, marginBottom: 20, overflow: 'hidden',
  },
  reviewImage: { width: '100%', height: '100%' },
  imageLabel: { color: '#888', textAlign: 'center' },
  infoSection: { paddingHorizontal: 20, marginBottom: 15 },
  brandLink: { color: '#888', fontSize: 12, marginBottom: 5 },
  productTitle: { fontSize: 24, fontWeight: 'bold' },
  priceText: { fontSize: 18, color: '#FF8A00', fontWeight: 'bold' }, 
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 15, marginHorizontal: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' }, 
  moreText: { color: '#888', fontSize: 12 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 10, paddingHorizontal: 20 },
  reviewBox: { minHeight: 100, backgroundColor: '#EEE', borderRadius: 20, padding: 20, justifyContent: 'center', marginHorizontal: 20 },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  horizontalListPadding: {
    paddingHorizontal: 20, 
  },
  recommendedContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    width: CARD_WIDTH,  
    marginRight: 12,    
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
    paddingHorizontal: 20,
  },
});