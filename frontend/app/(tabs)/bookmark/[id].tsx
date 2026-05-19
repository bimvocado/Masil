import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@/components/styles/bookmark-detail';
import { InteractionButton } from '@/constants/interaction-button';
import { Post } from '@/types/post';
import { TopBar } from '@/components/layout/top-bar';

// 1. DB 명세서 + 보완 필드가 합쳐진 MOCK 데이터
const MOCK_POSTS: Post[] = [
  { 
    postId: 1,
    userId: 3,
    stuffId: 101,
    title: '롯데리아 새우버거 폼 미쳤다',
    content: '오랜만에 먹었는데 패티가 아주 바삭하고 맛있네요. 추천합니다!',
    imageUrl: '',
    createdAt: '2024-05-19', // 
    updatedAt: '2024-05-19',
    
    nickname: '버거왕',      
    stuffName: '새우버거',     
    brandName: '롯데리아',     
    likeCount: 12,    
    commentCount: 5,  
    isScrapped: true,
    scrapCount: 12 // 화면에서 쓸 스크랩 숫자
  },
  { 
    postId: 2,
    userId: 5,
    stuffId: 102,
    title: '이건 좀 별로임',
    content: '기대했는데 생각보다 느끼하네요. 다음엔 안 먹을 듯.',
    imageUrl: '',
    createdAt: '2024-05-18',
    updatedAt: '2024-05-18',
    
    nickname: '솔직리뷰어',      
    stuffName: '치즈버거',     
    brandName: '맥도날드',     
    likeCount: 45,    
    commentCount: 22,  
    isScrapped: false,
    scrapCount: 45
  },
];

export default function BookmarkDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  
  // State 초기화 시 MOCK 데이터를 그대로 넣습니다.
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  // 스크랩(하트) 토글 함수
  const toggleScrap = (postId: number) => {
    setPosts(posts.map(p => 
      p.postId === postId 
        ? { 
            ...p, 
            isScrapped: !p.isScrapped, 
            // scrapCount가 없을 경우를 대비해 0으로 초기화 처리
            scrapCount: p.isScrapped ? (p.scrapCount || 0) - 1 : (p.scrapCount || 0) + 1 
          } 
        : p
    ));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopBar title={name || '보관함 상세'} onBackPress={() => router.back()} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.cardLeft}>
              {/* 본문 요약 표시 */}
              <Text style={styles.postTitle} numberOfLines={1}>
                {item.content}
              </Text>
              
              {/* DB 명세서엔 없지만 보완 필드로 넣은 stuffName 활용 */}
              <Text style={styles.postHandle}>
                {item.brandName} - {item.stuffName}
              </Text>
              
              <View style={styles.interactionRow}>
                <View style={styles.iconGroup}>
                  <InteractionButton 
                    type="heart" 
                    count={item.scrapCount || 0}
                    isActive={item.isScrapped}
                    onPress={() => toggleScrap(item.postId)}
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
              <View style={styles.thumbnailPlaceholder} />
            </View>
          </View>
        )}
      />
    </View>
  );
}