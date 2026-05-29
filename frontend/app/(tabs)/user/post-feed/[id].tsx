import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Post } from '@/types/post';
import { useAuthStore } from '@/store/use-auth-store';
import { postService } from '@/services/post-service';
import { PostVerticalFeed } from '@/components/post/post-vertical-feed';

export default function UserPostFeedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        if (!user?.userId) return;
        const userPosts = await postService.getUserPosts(user.userId);

        console.log('마이페이지 게시글 목록:', userPosts);

        const normalizedPosts = (userPosts || []).map((post: any) => ({
          ...post,
          imageUrl: post.imageUrl ?? post.image_url ?? null,
        }));

        setAllPosts(normalizedPosts);
        
        setLoading(false);
      } catch (error) {
        console.error('로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [user?.userId]);

  if (loading) return <ActivityIndicator style={{flex:1, backgroundColor:'#000'}} size="large" />;

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
            source={{ uri: getImageUrl(item.imageUrl) }}
            style={{ flex: 1, width: '100%', height: '100%' }}
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
  const initialIndex = allPosts.findIndex(p => p.postId === Number(id));

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <PostVerticalFeed 
        posts={allPosts} 
        user={user} 
        initialIndex={initialIndex}
        onBack={() => router.back()}
        onPostUpdate={(updated) => setAllPosts(updated)}
      />
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
}
