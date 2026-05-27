import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout/top-bar';
import { styles } from '@/components/styles/user';
import { useRouter } from 'expo-router'; 
import { Post } from '@/types/post';
import { User } from '@/types/user';
import { useAuthStore } from '@/store/use-auth-store';
import { InteractionButton } from '@/constants/interaction-button';
import { postService } from '@/services/post-service';
import { authService } from '@/api/auth-service'; 

import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';



export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { user, setUser } = useAuthStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 탭 전환 후 돌아올 때도 최신 게시글을 불러오기 위해 useFocusEffect 사용
  useFocusEffect(
    useCallback(() => {
      const fetchMyData = async () => {
        try {
          if (!user?.userId) {
            setLoading(false);
            return;
          }

          setLoading(true);

          const response = await authService.getProfile(user.userId);
          if (response.success) {
            setUser(response.data);
          }

          // 사용자 게시글 로드
          const userPosts = await postService.getUserPosts(user.userId);
          setPosts(userPosts || []);
        } catch (error) {
          console.error("게시글 로딩 실패:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMyData();
    }, [user?.userId])
  );
  
  const toggleHeart = (postId: number) => {
    setPosts(posts.map(p => 
      p.postId === postId 
        ? { ...p, isScrapped: !p.isScrapped, scrapCount: p.isScrapped ? (p.scrapCount || 0) - 1 : (p.scrapCount || 0) + 1 } 
        : p
    ));
  };

  const filteredPosts = posts.filter((post) => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.createdAt.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      {/* 상단 바 영역 */}
      <TopBar 
        title="내 정보" 
        showBackButton={true}
        rightIcon={
          <TouchableOpacity onPress={() => router.push('/(tabs)/user/settings')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image
              source={require('@/assets/icons/setting.png')}
              style={{ width: 18, height: 18, tintColor: '#aaa'}}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        bounces={true}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 정보 영역 */}
        <View style={styles.profileContainer}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              {/* ✅ Zustand의 user 정보를 실시간으로 렌더링 */}
              {user?.profileImageUrl ? (
                <Image source={{ uri: user.profileImageUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
            </View>

            <View style={styles.profileTextContainer}>
              <Text style={styles.nicknameText}>{user?.nickname || '닉네임 없음'}</Text>
              <Text style={styles.bioText}>{user?.bio || '아직 소개글이 없습니다.'}</Text>
              
              <TouchableOpacity 
                style={styles.profileEditButton} 
                onPress={() => router.push('/(tabs)/user/edit')}
              >
                <Text style={styles.profileEditButtonText}>프로필 설정</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 올렸던 상품/작성일자 중간 검색창 */}
        <View style={styles.filterContainer}>
          <View style={styles.filterBar}>
            <Image
              source={require('@/assets/icons/search.png')}
              style={{ width: 16, height: 16, tintColor: '#aaa', marginRight: 8 }}
            />
            <TextInput
              style={styles.filterInput}
              placeholder="올렸던 상품 / 작성일자"
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* 게시글 리스트 영역 */}
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#888" style={{ marginTop: 40 }} />
          ) : filteredPosts.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
              올린 게시글이 없습니다.
            </Text>
          ) : (
            filteredPosts.map((post) => (
              <TouchableOpacity 
                key={post.postId} 
                style={styles.postCard}
                onPress={() => router.push({
                  pathname: `/user/post-feed/${post.postId}`, 
                } as any)}
              >  
                <View style={styles.cardLeft}>
                  <Text style={styles.postTitle} numberOfLines={1}>
                    {post.content.length > 10 
                      ? `${post.content.substring(0, 10)}...` 
                      : post.content}
                  </Text>
                  
                  <Text style={styles.postDate}>{post.createdAt}</Text>  
                  <View style={styles.interactionRow}>
                    <View style={styles.iconGroup}>
                      <InteractionButton 
                        type="comment"
                        count={post.commentCount?.toLocaleString() || '0'}
                        textPosition="right"
                      />
                    </View>
                    
                    <View style={styles.iconGroup}>
                      <InteractionButton 
                        type="heart"
                        count={post.scrapCount?.toLocaleString() || '0'}
                        textPosition="right"
                        isActive={post.isScrapped}
                        onPress={() => toggleHeart(post.postId)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  {post.imageUrl ? (
                    <Image
                      source={{ uri: post.imageUrl }}
                      style={styles.thumbnailPlaceholder}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.thumbnailPlaceholder} />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}