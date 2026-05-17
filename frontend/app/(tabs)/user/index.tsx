import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  TextInput 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout/top-bar';
import { styles } from '@/components/styles/user';

import { InteractionButton } from '@/constants/interaction-button';

interface UserMock {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  bio: string;
}

interface PostMock {
  postId: number;
  title: number | string;
  createdAt: string;
  imageUrl: string;
  likeCount: number;
  commentCount: number;
  isHearted?: boolean;
}

const MOCK_USER: UserMock = {
  userId: 1,
  nickname: 'username',
  profileImageUrl: '', 
  bio: 'my name is ... yes hihi',
};

const MOCK_POSTS: PostMock[] = [
  { postId: 1, title: '버거라라라라라라라라라라라라라라라라라라라', createdAt: '2024.04.05', imageUrl: '', likeCount: 1234, commentCount: 1234, isHearted: false },
  { postId: 2, title: '정신이나가요', createdAt: '2024.04.04', imageUrl: '', likeCount: 567, commentCount: 12, isHearted: true },
  { postId: 3, title: '횜비기부기온', createdAt: '2024.03.25', imageUrl: '', likeCount: 89, commentCount: 4, isHearted: false },
  { postId: 4, title: '다이소?다없소...', createdAt: '2024.03.20', imageUrl: '', likeCount: 999, commentCount: 45, isHearted: false }, 
  { postId: 5, title: '얼굴을피자...', createdAt: '2024.03.15', imageUrl: '', likeCount: 23, commentCount: 2, isHearted: false },
  { postId: 6, title: '눈을감자...', createdAt: '2024.03.01', imageUrl: '', likeCount: 456, commentCount: 88, isHearted: false },
];

export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  

  const [posts, setPosts] = useState(MOCK_POSTS);


  const toggleHeart = (postId: number) => {
    setPosts(posts.map(p => 
      p.postId === postId 
        ? { ...p, isHearted: !p.isHearted, likeCount: p.isHearted ? p.likeCount - 1 : p.likeCount + 1 } 
        : p
    ));
  };


  const filteredPosts = posts.filter(
    (post) => post.title.toString().includes(searchQuery) || post.createdAt.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      {/* 상단 바 영역 */}
      <TopBar 
        title="내 정보" 
        showBackButton={true}
        rightIcon={
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
              {MOCK_USER.profileImageUrl ? (
                <Image source={{ uri: MOCK_USER.profileImageUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
            </View>

            <View style={styles.profileTextContainer}>
              <Text style={styles.nicknameText}>{MOCK_USER.nickname}</Text>
              <Text style={styles.bioText}>{MOCK_USER.bio}</Text>
              
              <TouchableOpacity style={styles.profileEditButton}>
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
            <TouchableOpacity key={post.postId} style={styles.postCard}>
              
              {/* 텍스트 및 인터랙션 정보 */}
              <View style={styles.cardLeft}>
                <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                <Text style={styles.postDate}>{post.createdAt}</Text>
                
                <View style={styles.interactionRow}>
                  <View style={styles.iconGroup}>
                    <InteractionButton 
                      type="heart"
                      count={post.likeCount.toLocaleString()}
                      textPosition="right"
                      isActive={post.isHearted}
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