import React, { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { TopBar } from '@/components/layout/top-bar';
import { postService } from '@/services/post-service';

export default function ProductReviewsScreen() {
  const { id, mainStuffName } = useLocalSearchParams<{ id: string; mainStuffName: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const posts = await postService.getPosts(undefined, Number(id));
      setReviews([...(posts || [])].sort((a, b) => (b.scrapCount || 0) - (a.scrapCount || 0)));
    } catch (error) {
      console.error('리뷰 전체 조회 실패:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [fetchReviews])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text style={styles.loadingText}>리뷰를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title={`${mainStuffName || '상품'} 리뷰`} showBackButton />
      <ScrollView style={{ backgroundColor: '#f5fbe7' }} contentContainerStyle={styles.content}>
        <Text style={styles.headerText}>{reviews.length}개의 리뷰</Text>

        {reviews.length === 0 ? (
          <Text style={styles.emptyText}>아직 등록된 리뷰가 없습니다.</Text>
        ) : (
          reviews.map((item, index) => (
            <TouchableOpacity
              key={item.postId || index}
              style={styles.reviewCard}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/search/post/[id]', params: { id: String(item.postId), fetchType: 'single' } })}
            >
              <View style={styles.reviewTitleRow}>
                <Text style={styles.reviewRank}>{index + 1}</Text>
                <Text style={styles.reviewAuthor}>{item.nickname || '익명'}</Text>
              </View>
              <Text style={styles.reviewContent} numberOfLines={3}>{item.content}</Text>
              <Text style={styles.reviewMeta}>스크랩 {item.scrapCount || 0} · 좋아요 {item.likeCount || 0} · 댓글 {item.commentCount || 0}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666' },
  content: { padding: 20, paddingBottom: 40 },
  headerText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#444' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 20 },
  reviewCard: { backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#EAEAEA' },
  reviewTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reviewRank: { width: 28, fontSize: 15, fontWeight: 'bold', color: '#FF8A00' },
  reviewAuthor: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  reviewContent: { color: '#666', lineHeight: 18 },
  reviewMeta: { color: '#888', fontSize: 12, marginTop: 6 },
});
