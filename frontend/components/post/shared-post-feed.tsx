import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Post } from '@/types/post';
import { useAuthStore } from '@/store/use-auth-store';
import { postService } from '@/services/post-service';
import { PostVerticalFeed } from '@/components/post/post-vertical-feed';

interface Props {
  id: string;
  fetchType: 'single' | 'user';
  onBack: () => void;
}

export const SharedPostFeed = ({ id, fetchType, onBack }: Props) => {
  const { user } = useAuthStore();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (fetchType === 'single') {
          if (!id) return; 
          
          const targetPost = await postService.getPost(Number(id), user?.userId);
          const normalizedPost = {
            ...targetPost,
            imageUrl: targetPost.imageUrl ?? (targetPost as any).image_url ?? null,
          };
          setAllPosts([normalizedPost]);
        } else {
          if (!user?.userId) return;
          
          const userPosts = await postService.getUserPosts(user.userId, user.userId);
          const normalizedPosts = (userPosts || []).map((post: any) => ({
            ...post,
            imageUrl: post.imageUrl ?? post.image_url ?? null,
          }));
          setAllPosts(normalizedPosts);
        }
      } catch (error) {
        console.error('게시글 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, fetchType, user?.userId]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  const initialIndex = fetchType === 'single'
    ? 0
    : Math.max(0, allPosts.findIndex(p => p.postId === Number(id)));

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <PostVerticalFeed
        posts={allPosts}
        user={user}
        initialIndex={initialIndex}
        onBack={onBack}
        onPostUpdate={(updated) => setAllPosts(updated)}
      />
    </View>
  );
};