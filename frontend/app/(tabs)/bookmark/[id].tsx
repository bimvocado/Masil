import React, { useState, useEffect } from 'react';
import { Platform ,View, Text, FlatList,  ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@/components/styles/bookmark-detail';
import { formatDate } from '@/utils/date';
import { InteractionButton } from '@/constants/interaction-button';
import { Post } from '@/types/post';
import { TopBar } from '@/components/layout/top-bar';
import { scrapService } from '@/api/scrap-service';
import { useAuthStore } from '@/store/use-auth-store';
import { CommonModal } from '@/components/ui/common-modal';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';

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
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [imageThemes, setImageThemes] = useState<Record<number, 'dark'|'light'>>({});

  useEffect(() => {
    if (!id) return;
    fetchScraps();
  }, [id]);

  const fetchScraps = async () => {
    setIsLoading(true);
    try {
      const res = await scrapService.getScrapsByCategory(Number(id));
      const loaded = res.data ?? [];
      setPosts(loaded);

        if (Platform.OS === 'web' && loaded.length < 20) {
        const themes: Record<number, 'dark'|'light'> = {};
        await Promise.all(
          loaded.map(async (p: any) => {
            try {
              const isLight = await estimateImageIsLight(p.imageUrl);
              themes[p.postId] = isLight ? 'light' : 'dark';
            } catch { themes[p.postId] = 'dark'; }
          })
        );
        setImageThemes(themes);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const estimateImageIsLight = (uri?: string | null) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      if (!uri) return resolve(false);
      try {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = uri.startsWith('http') ? uri : `${BASE_URL}${uri}`;
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const w = 20, h = 20;
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, w, h);
            const data = ctx?.getImageData(0, 0, w, h).data;
            if (!data) return resolve(false);
            let total = 0;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i], g = data[i+1], b = data[i+2];
              const lum = 0.299*r + 0.587*g + 0.114*b;
              total += lum;
            }
            const avg = total / (data.length / 4);
            resolve(avg > 140);
          } catch (e) { resolve(false); }
        };
        img.onerror = () => resolve(false);
      } catch (e) { resolve(false); }
    });
  };

  const handleDeleteScrap = async (postId: number) => {
    if (!user) return;
    try {
      await scrapService.deleteScrap(postId, { userId: user.userId });
      setPosts(prev => prev.filter(p => p.postId !== postId));
    } catch {}
  };

  const renderPostInfo = (item: any, customStyle: any, shadowStyle: any) => (
    <>
      <Text style={[styles.postTitle, customStyle, shadowStyle]} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={[styles.postDate, customStyle, shadowStyle]} numberOfLines={1}>
        {item.brandName || '-'} • {item.stuffName || '-'}
      </Text>
      <Text style={[styles.postDate, customStyle, shadowStyle]}>
        {formatDate(item.createdAt)}
      </Text>
    </>
  );

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
          renderItem={({ item }) => {
            const theme = imageThemes[item.postId] ?? 'dark';
            
            const imgTextColor = theme === 'light' ? { color: '#000' } : { color: '#fff' };
            const imgTextShadow = theme === 'light'
              ? { textShadowColor: 'rgba(255,255,255,0.85)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 }
              : { textShadowColor: 'rgba(0,0,0,0.85)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 };

            const defaultShadow = { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 };

            return (
              <TouchableOpacity
                style={[styles.postCard, { padding: 0 }]}
                onPress={() => router.push({ pathname: `/user/post-feed/${item.postId}` } as any)}
                activeOpacity={0.8}
              >
                {item.imageUrl ? (
                  /* --- 1. 이미지 배경 케이스 --- */
                  <ImageBackground
                    source={{ uri: getImageUrl(item.imageUrl) }}
                    style={styles.imageBackground}
                    imageStyle={{ borderRadius: 24 }}
                    resizeMode="cover"
                  >
                    {/* 💡 팁: 디자인이 깨지거나 글씨가 안 보일 땐 style.imageOverlay에 
                        backgroundColor: 'rgba(0,0,0,0.25)' 같은 어두운 필터를 아주 살짝 입혀주면 가독성이 극대화됩니다. */}
                    <View style={styles.imageOverlay}>
                      {renderPostInfo(item, imgTextColor, imgTextShadow)}
                      <View style={[styles.interactionRow, { marginTop: 8 }]}> 
                        <InteractionButton
                          type="bookmark"
                          isActive={true}
                          tintColor={imgTextColor.color}
                          withShadow
                          onPress={() => setConfirmDeleteId(item.postId)}
                        />
                      </View>
                    </View>
                  </ImageBackground>
                ) : (
                  /* --- 2. 텍스트 위주 케이스 --- */
                  <View style={{ flexDirection: 'row' }}>
                    <View style={styles.cardLeft}>
                      {renderPostInfo(item, {}, defaultShadow)}
                      <View style={styles.interactionRow}>
                        <InteractionButton
                          type="bookmark"
                          count={item.scrapCount || 0}
                          isActive={true}
                          onPress={() => setConfirmDeleteId(item.postId)}
                        />
                        <InteractionButton
                          type="comment"
                          count={item.commentCount || 0}
                          textPosition="right"
                        />
                      </View>
                    </View>
                    <View style={styles.cardRight}>
                      <View style={styles.thumbnailPlaceholder} />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
              스크랩된 게시물이 없어요.
            </Text>
          }
        />
      )}

      <CommonModal
        visible={confirmDeleteId !== null}
        title="스크랩 삭제"
        message="삭제하면 해당 게시물이 보관함에서 제거됩니다."
        cancelText="취소"
        confirmText="삭제"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={async () => {
          if (confirmDeleteId !== null) {
            await handleDeleteScrap(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
      />
    </View>
  );
}