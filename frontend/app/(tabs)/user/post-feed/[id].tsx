import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Post } from '@/types/post';
import { Comment } from '@/types/comment';
import { Category } from '@/types/category';
import { commentService } from '@/api/comment-service';
import { scrapService } from '@/api/scrap-service';
import { categoryService } from '@/api/category-service';
import { useAuthStore } from '@/store/use-auth-store';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const MOCK_POSTS: Post[] = [
  {
    postId: 1,
    userId: 999,
    stuffId: 101,
    content: '맛있네요ㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㅇㅇㅇㅇㅇ',
    createdAt: '2024.05.19',
    updatedAt: '2024.05.19',
    brandId: 3,
    stuffName: '새우버거',
    likeCount: 123,
    commentCount: 10,
    isScrapped: false,
    scrapCount: 3,
  },
];

export default function UserPostFeedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const postId = Number(id);

  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const [isScrapped, setIsScrapped] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const initialIndex = MOCK_POSTS.findIndex(p => p.postId.toString() === id);

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
    if (!user) return;
    if (isScrapped) {
      try {
        await scrapService.deleteScrap(postId, { userId: user.userId });
        setIsScrapped(false);
      } catch {}
      return;
    }
    try {
      const res = await categoryService.getCategories(user.userId);
      setCategories(res.data ?? []);
      setShowCategoryPicker(true);
    } catch {}
  };

  const handleSelectCategory = async (categoryId: number) => {
    if (!user) return;
    setShowCategoryPicker(false);
    try {
      await scrapService.createScrap(postId, { userId: user.userId, categoryId });
      setIsScrapped(true);
    } catch {}
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.page}>
      <View style={styles.backgroundContainer}>
        <Text style={styles.emptyText}>내가 올린 사진 영역</Text>
      </View>

      <View style={styles.rightOverlay}>
        <View style={styles.iconGroup}>
          <Text style={styles.icon}>👍</Text>
          <Text style={styles.iconCount}>{item.likeCount}</Text>
        </View>
        <View style={styles.iconGroup}>
          <Text style={styles.icon}>👎</Text>
          <Text style={styles.iconCount}>{item.likeCount}</Text>
        </View>
        <TouchableOpacity style={styles.iconGroup} onPress={handleOpenComments}>
          <Text style={styles.icon}>💬</Text>
          <Text style={styles.iconCount}>{item.commentCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconGroup} onPress={handleScrapPress}>
          <Text style={styles.icon}>{isScrapped ? '🔖' : '📌'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomOverlay}>
        <View style={styles.userRow}>
          <View style={styles.userCircle}>
            <Text style={{ color: '#fff', fontSize: 12 }}>L</Text>
          </View>
          <Text style={styles.postTitle}>{item.stuffName}</Text>
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
        data={MOCK_POSTS}
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
