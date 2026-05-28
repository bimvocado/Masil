import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Post } from '@/types/post';
import { Comment } from '@/types/comment';
import { Category } from '@/types/category';
import { commentService } from '@/api/comment-service';
import { scrapService } from '@/api/scrap-service';
import { categoryService } from '@/api/category-service';
import { useAuthStore } from '@/store/use-auth-store';
import { postService } from '@/services/post-service';
import apiClient from '@/api/client';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export default function UserPostFeedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const postId = Number(id);

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const [interactions, setInteractions] = useState<{ [key: number]: { liked: boolean; disliked: boolean } }>({});
  const [isScrapped, setIsScrapped] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        if (!user?.userId) return;
        
        // 사용자의 모든 게시글 로드
        const userPosts = await postService.getUserPosts(user.userId);
        setAllPosts(userPosts || []);
        
        setLoading(false);
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        setLoading(false);
      }
    };
    
    loadPosts();
  }, [user?.userId]);

  useEffect(() => {
    if (!user || !postId) return;
    scrapService.getScrapStatus(postId, user.userId)
      .then(res => setIsScrapped(res.data?.isScrapped ?? false))
      .catch(() => {});
  }, [postId, user]);

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const res = await commentService.getComments(postId);
      setComments(res.data ?? []);
    } catch {
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleOpenComments = () => {
    setShowComments(true);
    loadComments();
  };

  const handleSubmitComment = async () => {
    if (!newCommentText.trim() || !user) return;
    try {
      await commentService.createComment(postId, { text: newCommentText.trim(), userId: user.userId });
      setNewCommentText('');
      loadComments();
    } catch {}
  };

  const handleScrapPress = async () => {
    if (!user?.userId) return;
    if (isScrapped) {
      try {
        await scrapService.deleteScrap(postId, { userId: user.userId });
        setIsScrapped(false);
      } catch {}
      return;
    }
    try {
      const categories = await categoryService.getCategories(user.userId);
      setCategories(categories ?? []);
      setShowCategoryPicker(true);
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  };

  const handleSelectCategory = async (categoryId: number) => {
    if (!user) return;
    setShowCategoryPicker(false);
    try {
      await scrapService.createScrap(postId, { userId: user.userId, categoryId });
      setIsScrapped(true);
    } catch {}
  };

  const toggleReaction = async (post: Post, reactionType: 'LIKE' | 'DISLIKE') => {
    if (!user) return;
    console.log('[UserPostFeed] toggleReaction', { postId: post.postId, stuffId: post.stuffId, reactionType });

    try {
      const response = await apiClient.post(`/api/interactions/${post.stuffId}/interactions`, { reactionType });
      console.log('[UserPostFeed] interaction response', response.data);

      const action = response.data?.data?.action;
      const stats = response.data?.data?.stats;
      const newLikeCount = stats?.like?.total ?? post.likeCount;
      const newDislikeCount = stats?.dislike?.total ?? post.dislikeCount;

      const nextInteractionState = action === 'DELETED'
        ? { liked: false, disliked: false }
        : {
            liked: reactionType === 'LIKE',
            disliked: reactionType === 'DISLIKE',
          };

      setInteractions(prev => ({
        ...prev,
        [post.postId]: nextInteractionState,
      }));

      setAllPosts(prev => prev.map(p => {
        if (p.postId !== post.postId) return p;
        return {
          ...p,
          likeCount: newLikeCount,
          dislikeCount: newDislikeCount,
        };
      }));
    } catch (error: any) {
      console.error('[UserPostFeed] interaction failed', error);
      if (error.response) {
        console.error('[UserPostFeed] interaction error response', error.response.status, error.response.data);
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  const initialIndex = Math.max(0, allPosts.findIndex(p => p.postId === postId));

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.page}>
      <View style={styles.backgroundContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ flex: 1, width: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.emptyText}>이미지 없음</Text>
        )}
      </View>

      <View style={styles.rightOverlay}>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => toggleReaction(item, 'LIKE')} style={{ alignItems: 'center' }}>
            <Text style={[styles.icon, { color: interactions[item.postId]?.liked ? '#FF6B6B' : '#fff' }]}>👍</Text>
            <Text style={styles.iconCount}>{item.likeCount || 0}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => toggleReaction(item, 'DISLIKE')} style={{ alignItems: 'center' }}>
            <Text style={[styles.icon, { color: interactions[item.postId]?.disliked ? '#6B9BD1' : '#fff' }]}>👎</Text>
            <Text style={styles.iconCount}>{item.dislikeCount || 0}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.iconGroup} onPress={handleOpenComments}>
          <Text style={styles.icon}>💬</Text>
          <Text style={styles.iconCount}>{item.commentCount || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconGroup} onPress={handleScrapPress}>
          <Text style={styles.icon}>{isScrapped ? '🔖' : '📌'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomOverlay}>
        <View style={styles.userRow}>
          <View style={styles.userCircle}>
            <Text style={{ color: '#fff', fontSize: 12 }}>
              {item.nickname?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.postTitle}>{item.stuffName} - {item.brandName}</Text>
        </View>
        <Text style={styles.content}>{item.content}</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        data={allPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
        getItemLayout={(_, index) => ({
          length: WINDOW_HEIGHT,
          offset: WINDOW_HEIGHT * index,
          index,
        })}
      />

      {/* 댓글 패널 */}
      <Modal
        visible={showComments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowComments(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowComments(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.panel}
        >
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>댓글</Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Text style={styles.panelClose}>✕</Text>
            </TouchableOpacity>
          </View>

          {isLoadingComments ? (
            <ActivityIndicator style={{ marginTop: 20 }} color="#888" />
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(c) => c.commentId.toString()}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentText}>{(item as any).text}</Text>
                  <Text style={styles.commentMeta}>{item.createdAt}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText2}>아직 댓글이 없어요.</Text>
              }
            />
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="댓글을 입력하세요..."
              placeholderTextColor="#999"
              value={newCommentText}
              onChangeText={setNewCommentText}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitComment}>
              <Text style={styles.submitText}>등록</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 카테고리 선택 모달 */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowCategoryPicker(false)}
        />
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>저장할 카테고리 선택</Text>
            <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
              <Text style={styles.panelClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.categoryId}
                style={styles.categoryItem}
                onPress={() => handleSelectCategory(cat.categoryId)}
              >
                <Text style={styles.categoryItemText}>{cat.categoryName}</Text>
              </TouchableOpacity>
            ))}
            {categories.length === 0 && (
              <Text style={styles.emptyText2}>카테고리가 없어요. 먼저 보관함에서 만들어주세요.</Text>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { height: WINDOW_HEIGHT, width: '100%' },
  backgroundContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#888', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#ccc', fontSize: 16 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  backButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  rightOverlay: { position: 'absolute', right: 15, bottom: 80, alignItems: 'center' },
  iconGroup: { alignItems: 'center', marginBottom: 15 },
  icon: { fontSize: 28, marginBottom: 4 },
  iconCount: { color: '#fff', fontSize: 12, fontWeight: '600' },
  bottomOverlay: { position: 'absolute', left: 20, bottom: 40, right: 100 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  userCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FF8888', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  postTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { color: '#fff', fontSize: 14, marginBottom: 5 },
  modalBackdrop: { flex: 0.4, backgroundColor: 'rgba(0,0,0,0.5)' },
  panel: { flex: 0.6, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  panelTitle: { fontSize: 16, fontWeight: 'bold' },
  panelClose: { fontSize: 18, color: '#888' },
  commentItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  commentText: { fontSize: 14, color: '#333' },
  commentMeta: { fontSize: 11, color: '#999', marginTop: 4 },
  emptyText2: { textAlign: 'center', color: '#999', marginTop: 30, fontSize: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12 },
  input: { flex: 1, fontSize: 14, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#f5f5f5', borderRadius: 20, marginRight: 8 },
  submitButton: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#FF8888', borderRadius: 20 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  categoryItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  categoryItemText: { fontSize: 15, color: '#333' },
});
