//스크롤담당
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Image
} from 'react-native';
import { Post } from '@/types/post';
import { Comment } from '@/types/comment';
import { Category } from '@/types/category';
import { commentService } from '@/api/comment-service';
import { scrapService } from '@/api/scrap-service';
import { categoryService } from '@/api/category-service';
import { PostItem } from '@/components/post/post-item';


const { height: WINDOW_HEIGHT } = Dimensions.get('window');

interface Props {
  posts: Post[];
  user: any;
  onBack?: () => void;
  initialIndex?: number;
  onPostUpdate?: (updatedPosts: Post[]) => void; // 부모 상태 업데이트용
}

export const PostVerticalFeed = ({ posts, user, onBack, initialIndex = 0, onPostUpdate }: Props) => {
  const [currentPostId, setCurrentPostId] = useState<number>(posts[initialIndex]?.postId);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  // 1. 댓글 로직
  const loadComments = async (postId: number) => {
    try {
      const res = await commentService.getComments(postId);
      setComments(res.data ?? []);
    } catch {
      setComments([]);
    }
  };

  const handleOpenComments = (postId: number) => {
    setCurrentPostId(postId);
    setShowComments(true);
    loadComments(postId);
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.commentId);
    setNewCommentText(comment.text); 
  };

  const handleSubmitComment = async () => {
    if (!newCommentText.trim() || !user) return;
    try {
      if (editingCommentId) {
        await commentService.updateComment(editingCommentId, { text: newCommentText.trim() });
        setComments(prev => prev.map(c => 
          c.commentId === editingCommentId ? { ...c, text: newCommentText.trim() } : c
        ));
        setEditingCommentId(null);
      } else {
        const res = await commentService.createComment(currentPostId, { 
          text: newCommentText.trim(), 
          userId: user.userId 
        });
        const newCommentWithUserInfo = {
          ...res.data, 
          User: {
            nickname: user.nickname, 
            profileImageUrl: user.profileImageUrl 
          }
        };
  
        // 2. 화면에 즉시 반영
        setComments(prev => [newCommentWithUserInfo, ...prev]);
        onPostUpdate?.(posts.map(p => 
          p.postId === currentPostId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
        ));
      }
      setNewCommentText('');
    } catch (error) {
      Alert.alert("알림", "처리에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const performDelete = async () => {
      try {
        await commentService.deleteComment(commentId);
        setComments(prev => prev.filter(c => Number(c.commentId) !== Number(commentId)));
      
        onPostUpdate?.(posts.map(p => 
          p.postId === currentPostId ? { ...p, commentCount: Math.max(0, (p.commentCount || 0) - 1) } : p
        ));
      } catch (error) {
        console.error("삭제 실패:", error);
        if (Platform.OS === 'web') {
          alert("삭제에 실패했습니다.");
        } else {
          Alert.alert("오류", "삭제에 실패했습니다.");
        }
      }
    };
  
    if (Platform.OS === 'web') {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        await performDelete();
      }
    } else {
      Alert.alert("삭제", "정말 삭제할까요?", [
        { text: "취소", style: "cancel" },
        { text: "삭제", onPress: performDelete, style: "destructive" }
      ]);
    }
  };

  const handleScrapPress = async (post: Post) => {
    if (!user?.userId) return;
    setCurrentPostId(post.postId);

    if (post.isScrapped) {
      try {
        await scrapService.deleteScrap(post.postId, { userId: user.userId });
        updatePostState(post.postId, { isScrapped: false });
      } catch {
        Alert.alert("알림", "해제 실패");
      }
    } else {
      try {
        const cats = await categoryService.getCategories(user.userId);
        setCategories(cats ?? []);
        setShowCategoryPicker(true);
      } catch {
        Alert.alert("알림", "카테고리 로드 실패");
      }
    }
  };

  const handleSelectCategory = async (categoryId: number) => {
    if (!user) return;
    setShowCategoryPicker(false);
    try {
      await scrapService.createScrap(currentPostId, { userId: user.userId, categoryId });
      updatePostState(currentPostId, { isScrapped: true });
    } catch {
      Alert.alert("알림", "저장 실패");
    }
  };

  const updatePostState = (postId: number, changes: Partial<Post>) => {
    const updated = posts.map(p => {
      if (p.postId === postId) {
        const newIsScrapped = changes.isScrapped !== undefined ? changes.isScrapped : p.isScrapped;
        let newScrapCount = p.scrapCount || 0;
        if (changes.isScrapped === true) newScrapCount++;
        else if (changes.isScrapped === false) newScrapCount = Math.max(0, newScrapCount - 1);
        
        return { ...p, ...changes, scrapCount: newScrapCount };
      }
      return p;
    });
    onPostUpdate?.(updated);
  };
const styles = StyleSheet.create({profileImage: {width: 34,height: 34,borderRadius: 17,marginRight: 10,backgroundColor: '#eee', },
  modalBackdrop: { flex: 0.4, backgroundColor: 'rgba(0,0,0,0.5)' },
  panel: { flex: 0.6, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  panelTitle: { fontWeight: 'bold', fontSize: 16 },
  commentItem: { marginBottom: 15 },
  profilePlaceholder: {width: 34, height: 34, borderRadius: 17,backgroundColor: '#eee',marginRight: 10,},
  nickname: { fontWeight: 'bold', fontSize: 13, color: '#333' },
  editBtn: { color: '#888', fontSize: 11, marginRight: 10 },
  deleteBtn: { color: '#FF6B6B', fontSize: 11 },
  commentText: { fontSize: 14, color: '#333', marginTop: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#eee', },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, height: 40, fontSize: 14, color: '#333' },
  submitButton: { marginLeft: 10 },
  submitText: { color: '#35a150', fontWeight: 'bold' },
  categoryItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  categoryItemText: { fontSize: 16, color: '#333' }
});

return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostItem 
            item={item}               
            user={user}               
            onOpenComments={handleOpenComments} 
            isScrapped={!!item.isScrapped}      
            isLiked={!!item.isLiked}       
            isDisliked={!!item.isDisliked}
            onScrapPress={() => handleScrapPress(item)} 
            onBack={onBack || (() => {})} 
          />
        )}
        keyExtractor={(item) => item.postId.toString()}
        pagingEnabled
        initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
        getItemLayout={(_, index) => ({ length: WINDOW_HEIGHT, offset: WINDOW_HEIGHT * index, index })}
      />

      {/* 댓글 모달 */}
      <Modal visible={showComments} transparent animationType="slide">
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => { setShowComments(false); setEditingCommentId(null); }} 
        />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>댓글 {comments.length}</Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Text style={{ fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={(c) => c.commentId.toString()}
            renderItem={({ item }) => {
              // 1. 내 댓글인지 체크 (Zustand 유저와 비교)
              const isMyComment = user?.userId === item.userId;
            
              // 2. 이미지 경로 계산
              const getProfileUri = () => {
                // 내 댓글이면 내 Zustand 정보 우선, 아니면 댓글 데이터 정보 사용
                const rawUrl = isMyComment ? user?.profileImageUrl : item.User?.profileImageUrl;
                
                if (!rawUrl) return 'https://ui-avatars.com/api/?name=User&background=random';
                if (rawUrl.startsWith('http')) return rawUrl;
            
                const fileName = rawUrl.split('/').pop();
                return `http://localhost:3000/uploads/${fileName}`;
              };
            
              const profileUri = getProfileUri();
            
              return (
                <View style={styles.commentItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    
                    {/* 프사 영역 */}
                    <Image 
                      source={{ uri: profileUri }} 
                      style={styles.profileImage} 
                    />
                    
                    {/* 닉네임 & 댓글 내용 영역 */}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.nickname}>
                          {isMyComment ? user?.nickname : (item.User?.nickname || `유저 ${item.userId}`)}
                        </Text>
                        
                        {user?.userId === item.userId && (
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => handleStartEdit(item)}>
                              <Text style={styles.editBtn}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteComment(item.commentId)}>
                              <Text style={styles.deleteBtn}>삭제</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <Text style={styles.commentText}>{item.text}</Text>
                    </View>
            
                  </View> 
                </View>
              );
            }}
          />

          <View style={styles.inputRow}>
            <TextInput 
              style={styles.input} 
              value={newCommentText} 
              onChangeText={setNewCommentText} 
              placeholder="댓글 입력..." 
            />
            <TouchableOpacity onPress={handleSubmitComment} style={styles.submitButton}>
              <Text style={styles.submitText}>{editingCommentId ? "수정" : "등록"}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 카테고리 모달 */}
      <Modal visible={showCategoryPicker} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowCategoryPicker(false)} />
        <View style={styles.panel}>
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
          </ScrollView>
        </View>
      </Modal>
    </View>
  ); };

