import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@/components/styles/bookmark-detail';
import { InteractionButton } from '@/constants/interaction-button';
import { Post } from '@/types/post';
import { TopBar } from '@/components/layout/top-bar';
import { scrapService } from '@/api/scrap-service';
import { useAuthStore } from '@/store/use-auth-store';

const BASE_URL = 'http://localhost:3000';

const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

export default function BookmarkDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { user } = useAuthStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchScraps();
  }, [id]);

  const fetchScraps = async () => {
    setIsLoading(true);
    try {
      const res = await scrapService.getScrapsByCategory(Number(id));
      setPosts(res.data ?? []);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScrap = async (postId: number) => {
    if (!user) return;
    try {
      await scrapService.deleteScrap(postId, { userId: user.userId });
      setPosts(prev => prev.filter(p => p.postId !== postId));
    } catch {}
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar title={name || '보관함 상세'} onBackPress={() => router.back()} />

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#888" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.postId.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <View style={styles.cardLeft}>
                <Text style={styles.postTitle} numberOfLines={2}>
                  {item.content}
                </Text>
                <Text style={styles.postHandle} numberOfLines={1}>
                  {item.brandName || '-'} • {item.stuffName || '-'}
                </Text>
                <Text style={styles.postDate}>{item.createdAt}</Text>
                <View style={styles.interactionRow}>
                  <View style={styles.iconGroup}>
                    <InteractionButton
                      type="heart"
                      count={item.scrapCount || 0}
                      isActive={true}
                      onPress={() => handleDeleteScrap(item.postId)}
                    />
                  </View>
                  <View style={styles.iconGroup}>
                    <InteractionButton
                      type="comment"
                      count={item.commentCount || 0}
                      textPosition="right"
                    />
                  </View>
                </View>
              </View>
              <View style={styles.cardRight}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: getImageUrl(item.imageUrl) }}
                    style={styles.thumbnailPlaceholder}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.thumbnailPlaceholder} />
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
              스크랩된 게시물이 없어요.
            </Text>
          }
        />
      )}
    </View>
  );
}
