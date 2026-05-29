import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Post } from '@/types/post';
import apiClient from '@/api/client';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');
const BASE_URL = 'http://localhost:3000';

const getImageUrl = (url?: string | null) => {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

interface PostItemProps {
  item: Post;
  user: any;
  onOpenComments: (postId: number) => void;
  isScrapped: boolean;
  onScrapPress: () => void;
  onBack: () => void;
}

export const PostItem = ({ item, user, onOpenComments, isScrapped, onScrapPress, onBack }: PostItemProps) => {
  // 1. 좋아요/싫어요 상태 및 숫자 관리
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(item.dislikeCount || 0);

  // 2. 초기 데이터 싱크 (부모로부터 받은 값 세팅)
  useEffect(() => {
    setLikeCount(item.likeCount || 0);
    setDislikeCount(item.dislikeCount || 0);
    
    if ((item as any).isLiked) setLiked(true);
    if ((item as any).isDisliked) setDisliked(true);
  }, [item]);

  // 3. 좋아요/싫어요 로직 (실시간 숫자 반영)
  const toggleReaction = async (reactionType: 'LIKE' | 'DISLIKE') => {
    if (!user) return;
    try {
      const response = await apiClient.post(`/api/interactions/${item.stuffId}/interactions`, { reactionType });
      
      const { action, stats } = response.data?.data || {};

      // 아이콘 상태 업데이트
      if (action === 'DELETED') {
        setLiked(false);
        setDisliked(false);
      } else if (action === 'CREATED' || action === 'UPDATED') {
        setLiked(reactionType === 'LIKE');
        setDisliked(reactionType === 'DISLIKE');
      }

      if (stats) {
        setLikeCount(stats.like?.total || 0);
        setDislikeCount(stats.dislike?.total || 0);
      }
      
    } catch (error) { 
      console.error("인터랙션 오류:", error); 
    }
  };

  return (
    <View style={styles.page}>
      {/* 배경 이미지 */}
      <View style={styles.backgroundContainer}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: getImageUrl(item.imageUrl) }} 
            style={{ flex: 1, width: '100%' }} 
            resizeMode="cover" 
          />
        ) : (
          <Text style={styles.emptyText}>이미지 없음</Text>
        )}
      </View>

      {/* 우측 아이콘 바 */}
      <View style={styles.rightOverlay}>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => toggleReaction('LIKE')}>
            <Text style={[styles.icon, { color: liked ? '#FF6B6B' : '#fff' }]}>👍</Text>
            <Text style={styles.iconCount}>{likeCount}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => toggleReaction('DISLIKE')}>
            <Text style={[styles.icon, { color: disliked ? '#6B9BD1' : '#fff' }]}>👎</Text>
            <Text style={styles.iconCount}>{dislikeCount}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconGroup} onPress={() => onOpenComments(item.postId)}>
          <Text style={styles.icon}>💬</Text>
          <Text style={styles.iconCount}>{item.commentCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconGroup} onPress={onScrapPress}>
          <Text style={styles.icon}>{isScrapped ? '🔖' : '📌'}</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 텍스트 정보 */}
      <View style={styles.bottomOverlay}>
        <View style={styles.userRow}>
          <View style={styles.userCircle}>
            {/* 프로필 이미지가 있다면 Image로 교체 가능 */}
            <Text style={{ color: '#fff', fontSize: 12 }}>{item.nickname?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.postTitle} numberOfLines={1}>
            {item.stuffName} - {item.brandName}
          </Text>
        </View>
        <Text style={styles.content} numberOfLines={3}>{item.content}</Text>
      </View>

      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { height: WINDOW_HEIGHT, width: '100%' },
  backgroundContainer: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { color: '#ccc', fontSize: 16 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8 },
  backButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  rightOverlay: { position: 'absolute', right: 15, bottom: 100, alignItems: 'center' },
  iconGroup: { alignItems: 'center', marginBottom: 20 },
  icon: { fontSize: 32, marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 3 },
  iconCount: { color: '#fff', fontSize: 13, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  bottomOverlay: { position: 'absolute', left: 20, bottom: 50, right: 80 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  userCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FF8888', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#fff' },
  postTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  content: { color: '#eee', fontSize: 15, lineHeight: 20, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
});