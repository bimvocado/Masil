import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View,ImageBackground, } from 'react-native';
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
        const userPosts = await postService.getUserPosts(user.userId, user.userId);

        console.log('마이페이지 게시글 목록:', userPosts);

        const normalizedPosts = (userPosts || []).map((post: any) => ({
          ...post,
          imageUrl: post.imageUrl ?? post.image_url ?? null,
        }));

        setAllPosts(normalizedPosts);
      } catch (error) {
        console.error('로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [user?.userId]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  const initialIndex = Math.max(0, allPosts.findIndex(p => p.postId === Number(id)));

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
