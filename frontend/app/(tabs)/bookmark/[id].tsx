import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@/components/styles/bookmark-detail';
import { InteractionButton } from '@/constants/interaction-button';

import { TopBar } from '@/components/layout/top-bar';

interface PostMock {
  postId: string;
  title: string;
  nickname: string;
  date: string;
  isBookmarked: boolean;
  heartCount: number;
  commentCount: number;
  isHearted: boolean;
}

const MOCK_POSTS: PostMock[] = [
  { postId: '1', title: '롯데리아 오징어버거 후기', nickname: '@burger_lover', date: '2023.10.27', isBookmarked: true, heartCount: 12, commentCount: 5, isHearted: true },
  { postId: '2', title: '내힘들다', nickname: '@stopthis', date: '2023.10.26', isBookmarked: true, heartCount: 45, commentCount: 22, isHearted: true },
];

export default function BookmarkDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  
  // 'id' 변수 미사용 에러 방지용
  console.log('현재 카테고리 ID:', id);
  
  const [posts, setPosts] = useState(MOCK_POSTS);

  // 북마크 토글 함수
  const toggleBookmark = (postId: string) => {
    setPosts(posts.map(p => p.postId === postId ? { ...p, isBookmarked: !p.isBookmarked } : p));
  };

  // 하트 토글 함수
  const toggleHeart = (postId: string) => {
    setPosts(posts.map(p => p.postId === postId ? { ...p, isHearted: !p.isHearted, heartCount: p.isHearted ? p.heartCount - 1 : p.heartCount + 1 } : p));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      <TopBar 
        title={name || '보관함 상세'} 
        onBackPress={() => router.back()} 
      />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            
            <View style={styles.bookmarkButton}>
              <InteractionButton 
                type="bookmark"
                isActive={item.isBookmarked}
                onPress={() => toggleBookmark(item.postId)}
              />
            </View>

            <View style={styles.cardLeft}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postHandle}>{item.nickname}</Text>
              <Text style={styles.postDate}>{item.date}</Text>
              
              <View style={styles.interactionRow}>
                <View style={styles.iconGroup}>
                  <InteractionButton 
                    type="heart" 
                    count={item.heartCount} 
                    textPosition="right" 
                    isActive={item.isHearted}
                    onPress={() => toggleHeart(item.postId)}
                  />
                </View>
                <View style={styles.iconGroup}>
                  <InteractionButton 
                    type="comment" 
                    count={item.commentCount} 
                    textPosition="right" 
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.thumbnailPlaceholder} />

          </View>
        )}
      />
    </View>
  );
}