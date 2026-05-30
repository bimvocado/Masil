import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { TopBar } from '@/components/layout/top-bar';
import { ProductCard } from '@/components/ui/product-card';
import { InteractionButton } from '@/constants/interaction-button';
import { InteractionStatsBar } from '@/components/ui/interaction-stats-bar';

import { searchService } from '@/api/search-service';

type TopPost = {
  postId: number;
  content: string;
  imageUrl: string | null;
  userId: number;
  nickname: string;
  scrapCount: number;
  createdAt: string;
};

type StuffDetail = {
  stuffId: number;
  stuffName: string;
  price: number;

  brandId: number;
  brandName: string;
  logoUrl?: string | null;

  imageUrl: string | null;

  totalLikeCount: number;
  koreanLikeCount: number;
  foreignerLikeCount: number;

  totalDislikeCount: number;
  koreanDislikeCount: number;
  foreignerDislikeCount: number;

  totalPostCount: number;

  topPost: TopPost | null;
};

export default function ProductDetailScreen() {
  const { id, stuffName, brandName } = useLocalSearchParams<{
    id: string;
    stuffName: string;
    brandName: string;
  }>();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState<StuffDetail | null>(null);

  // 상품창 - 상세 페이지 전체
  const fetchStuffDetail = async () => {
    try {
      setLoading(true);

      const response = await searchService.getStuffDetail(Number(id));
      setDetailData(response.data.result);
    } catch (error) {
      console.error('상품 상세 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStuffDetail();
    }
  }, [id]);

  if (loading || !detailData) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text style={{ marginTop: 10 }}>로딩중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title={detailData.stuffName || stuffName || '상품 상세'}
        showBackButton={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor: '#f5fbe7' }}
      >
        {/* 상단 대표 이미지 */}
        <View style={styles.imagePlaceholderBox}>
          {detailData.imageUrl ? (
            <Image
              source={{ uri: detailData.imageUrl }}
              style={styles.reviewImage}
            />
          ) : (
            <Text style={styles.imageLabel}>
              가장 인기 있는 리뷰 사진
            </Text>
          )}
        </View>

        {/* 상품 정보 */}
        <View style={styles.infoSection}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/search/[id]',
                params: {
                  id: String(detailData.brandId),
                  name: detailData.brandName,
                },
              })
            }
          >
            <Text style={styles.brandLink}>
              브랜드: {detailData.brandName || brandName || '브랜드 미정'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.productTitle}>
            {detailData.stuffName || stuffName || '상품명 없음'}
          </Text>

          <Text style={styles.priceText}>
            {detailData.price
              ? detailData.price.toLocaleString()
              : '가격 정보 없음'}
            원
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 좋아요 / 싫어요 통계 */}
        <InteractionStatsBar
          likeStats={{
            total: detailData.totalLikeCount,
            korean: detailData.koreanLikeCount,
            foreign: detailData.foreignerLikeCount,
          } as any}
          dislikeStats={{
            total: detailData.totalDislikeCount,
            korean: detailData.koreanDislikeCount,
            foreign: detailData.foreignerDislikeCount,
          } as any}
        />

        {/* 좋아요 / 싫어요 버튼 */}
        <View style={styles.statsContainer}>
          <InteractionButton
            type="like"
            count={detailData.totalLikeCount}
            isActive={false}
            onPress={() => {
              console.log('좋아요 버튼 클릭');
            }}
            textPosition="right"
          />

          <InteractionButton
            type="dislike"
            count={detailData.totalDislikeCount}
            isActive={false}
            onPress={() => {
              console.log('싫어요 버튼 클릭');
            }}
            textPosition="right"
          />
        </View>

        <View style={styles.divider} />

        {/* 추천 조합 - 아직 백엔드 미구현 */}
        <Text style={styles.sectionTitle}>추천조합</Text>

        <Text style={{ color: '#666' }}>
          추천 조합이 없습니다.
        </Text>

        <TouchableOpacity>
          <Text style={styles.moreText}>더보기 {'>'}</Text>
        </TouchableOpacity>

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
              onPress={() =>
                router.push({
                  pathname: '/user/post-feed/[id]',
                  params: { id: String(detailData.topPost?.postId) },
                })
              }
            >
              <Text style={{ fontWeight: 'bold' }}>
                {detailData.topPost.nickname}
              </Text>

              <Text style={{ color: '#666', marginTop: 5 }}>
                {detailData.topPost.content}
              </Text>

              <Text style={{ color: '#888', marginTop: 5 }}>
                스크랩 {detailData.topPost.scrapCount}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: '#666' }}>
              아직 이 상품에 대한 리뷰가 없습니다.
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
  imagePlaceholderBox: {
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  reviewImage: { width: '100%', height: '100%' },
  imageLabel: { color: '#888', textAlign: 'center' },
  infoSection: { marginBottom: 15 },
  brandLink: { color: '#888', fontSize: 12, marginBottom: 5 },
  productTitle: { fontSize: 24, fontWeight: 'bold' },
  priceText: { fontSize: 18, color: '#444' },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 15 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  moreText: { textAlign: 'right', color: '#888', fontSize: 12 },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  reviewBox: {
    minHeight: 100,
    backgroundColor: '#EEE',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },
});