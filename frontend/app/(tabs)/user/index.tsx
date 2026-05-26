import { View, Text, Image, TouchableOpacity, ScrollView, TextInput 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout/top-bar';
import { styles } from '@/components/styles/user';
import { useRouter } from 'expo-router'; 
import { Post } from '@/types/post';
import { User } from '@/types/user';

import { InteractionButton } from '@/constants/interaction-button';

import React, { useEffect, useState } from 'react'; 
import { authService } from '@/api/auth-service'; 



const MOCK_POSTS: Post[] = [
  { 
    postId: 1,
    userId: 3,
    stuffId: 101,
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

export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter(); 

  const [user, setUser] = useState<any>(null); 
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // 일단 테스트로 1번 유저 가져오기 (나중엔 로그인한 ID 넣기)
        const response = await authService.getProfile(1); 
        console.log("프론트가 받은 응답:", response);
        if (response.success) {
          setUser(response.data); // 백엔드에서 온 데이터로 교체!
          console.log("실제 데이터 안의 닉네임:", response.data.nickname);
        }
      } catch (error) {
        console.error("내 정보 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, []);


  const toggleHeart = (postId: number) => {
    setPosts(posts.map(p => 
      p.postId === postId 
        ? { ...p, isScrapped: !p.isScrapped, likeCount: p.isScrapped ? (p.likeCount || 0) - 1 : (p.likeCount || 0) + 1 } 
        : p
    ));
  };


  const filteredPosts = posts.filter((post) => 
    post.content.includes(searchQuery) || post.createdAt.includes(searchQuery)
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
              {user?.profileImageUrl ? (
                <Image source={{ uri: user.profileImageUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
            </View>

            <View style={styles.profileTextContainer}>
              <Text style={styles.nicknameText}>{user?.nickname}</Text>
              <Text style={styles.bioText}>{user?.bio}</Text>
              
              <TouchableOpacity style={styles.profileEditButton} onPress={() => router.push('/(tabs)/user/edit')}>
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
          {filteredPosts.map((post) => (
            <TouchableOpacity 
            key={post.postId} 
            style={styles.postCard}
            // 🔥 내 게시물 전용 릴스 뷰로 이동
            onPress={() => router.push({
              pathname: `/user/post-feed/${post.postId}`, 
            } as any)}
          >  
              {/* 텍스트 및 인터랙션 정보 */}
              <View style={styles.cardLeft}>
              <Text style={styles.postTitle} numberOfLines={1}>
        {post.content.length > 20 
          ? `${post.content.substring(0, 20)}...` 
          : post.content}
      </Text>
      
      <Text style={styles.postDate}>{post.createdAt}</Text>  
                <View style={styles.interactionRow}>
                  <View style={styles.iconGroup}>
                    <InteractionButton 
                      type="heart"
                      count={post.likeCount.toLocaleString()}
                      textPosition="right"
                      isActive={post.isScrapped}
                      onPress={() => toggleHeart(post.postId)}
                    />
                  </View>
                  
                  <View style={styles.iconGroup}>
                    <InteractionButton 
                      type="comment"
                      count={post.commentCount.toLocaleString()}
                      textPosition="right"
                    />
                  </View>
                </View>
              </View>

              {/* 게시글 이미지 영역 */}
              <View style={styles.cardRight}>
                <View style={styles.thumbnailPlaceholder} />
              </View>

            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}