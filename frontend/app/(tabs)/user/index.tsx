import { 
  View, Text, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator 
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
import { formatDate } from '@/utils/date';

import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { user, setUser } = useAuthStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    const safePath = url.startsWith('/') ? url : `/${url}`;
    return `${BASE_URL}${safePath}`;
  };

  // 탭 전환 후 돌아올 때도 최신 데이터를 불러오기 위해 useFocusEffect 사용
  useFocusEffect(
    useCallback(() => {
      const fetchMyData = async () => {
       
        try {
          setLoading(true);
          let targetUserId = user?.userId;
          
          if (!targetUserId) {
            console.log("🔄 유저 정보 복구 시도...");
            const profileRes = await authService.getProfile(); 
            
            if (profileRes.success && profileRes.data) {
              targetUserId = profileRes.data.userId;
              setUser(profileRes.data); 
            } else {
              setLoading(false);
              return;
            }
          }
          const profileRes = await authService.getProfile(targetUserId);
          if (profileRes.success && profileRes.data) {
            setUser({ ...profileRes.data });
            const userPosts = await postService.getUserPosts(targetUserId!, targetUserId);
            setPosts(userPosts || []);
          }
        } catch (error: any) {
          console.error("데이터 로딩 중 에러:", error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMyData();
    }, [user?.userId]) 
  );
  
  
  

const filteredPosts = posts.filter((post) => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.createdAt.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <TopBar 
        title="내 정보" 
        showBackButton={true}
        rightIcon={
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/user/settings')} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
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
  {user?.profileImageUrl ? (
    <Image 
      key={user.profileImageUrl}

      source={{ uri: getImageUrl(user.profileImageUrl) }} 
      style={styles.avatarImage}
    />
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

        {/* 검색창 영역 */}
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
                  
                 <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
                  <View style={styles.interactionRow}>
                    <View style={styles.iconGroup}>
                      <Image
                        source={require('@/assets/icons/comment.png')}
                        style={{ width: 22, height: 22, tintColor: '#dcdcdc' }}
                        resizeMode="contain"
                      />
                      <Text style={{ marginLeft: 4, color: '#666666', fontSize: 13, fontWeight: '600' }}>
                        {post.commentCount?.toLocaleString() || '0'}
                      </Text>
                    </View>
                    
                    <View style={styles.iconGroup}>
                      <Image
                        source={post.isScrapped ? require('@/assets/icons/filledbookmark.png') : require('@/assets/icons/bookmark.png')}
                        style={{ width: 22, height: 22, tintColor: post.isScrapped ? '#009205' : '#dcdcdc' }}
                        resizeMode="contain"
                      />
                      <Text style={{ marginLeft: 4, color: '#666666', fontSize: 13, fontWeight: '600' }}>
                        {post.scrapCount?.toLocaleString() || '0'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  {post.imageUrl ? (
                    <Image
                      source={{ uri: getImageUrl(post.imageUrl) }} // 👈 게시글 사진에도 서버 주소 적용
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