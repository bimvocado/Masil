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
        setAllPosts(userPosts || []);
      } catch (error) {
        console.error('로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [user?.userId]);

  if (loading) return <ActivityIndicator style={{flex:1, backgroundColor:'#000'}} size="large" />;

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