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

interface UserMock {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  bio: string;
}

interface PostMock {
  postId: number;
  title: string;
  createdAt: string;
  imageUrl: string;
  likeCount: number;
  commentCount: number;
}

const MOCK_USER: UserMock = {
  userId: 1,
  nickname: 'username',
  profileImageUrl: '', // 프사 없을 때 기본
  bio: 'my name is ... yes hihi',
};

const MOCK_POSTS: PostMock[] = [
  {
    postId: 1,
    title: '버거라라라라라라라라라라라라라라라라라라라',
    createdAt: '2024.04.05',
    imageUrl: '',
    likeCount: 1234,
    commentCount: 1234,
  },
  {
    postId: 2,
    title: '게시물초반',
    createdAt: '작성일',
    imageUrl: '',
    likeCount: 1234,
    commentCount: 1234,
  },
  {
    postId: 3,
    title: '게시물초반',
    createdAt: '작성일',
    imageUrl: '',
    likeCount: 1234,
    commentCount: 1234,
  },
  {
    postId: 4,
    title: '게시물초반',
    createdAt: '작성일',
    imageUrl: '',
    likeCount: 1234,
    commentCount: 1234,
  }, 
  {
    postId: 5,
    title: '게시물초반',
    createdAt: '작성일',
    imageUrl: '',
    likeCount: 1234,
    commentCount: 1234,
  },
  {
    postId: 6,
    title: '게시물초반',
    createdAt: '작성일',
    imageUrl: '',
    likeCount: 1234,
    commentCount: 1234,
  },
];

export default function UserScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

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
      >
        {/* 프로필 정보 영역 */}
        <View style={styles.profileContainer}>
          <View style={styles.profileRow}>
            {/* 프로필 이미지 동그라미 */}
            <View style={styles.avatarCircle}>
              {MOCK_USER.profileImageUrl ? (
                <Image source={{ uri: MOCK_USER.profileImageUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder} /> // 이미지 없을 때
              )}
            </View>

            {/* 유저 네임 및 한 줄 소개 */}
            <View style={styles.profileTextContainer}>
              <Text style={styles.nicknameText}>{MOCK_USER.nickname}</Text>
              <Text style={styles.bioText}>{MOCK_USER.bio}</Text>
              
              {/* 프로필 설정 버튼 */}
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

        {/* 게시글 리스트 */}
        <View style={styles.listContainer}>
          {MOCK_POSTS.map((post) => (
            <TouchableOpacity key={post.postId} style={styles.postCard}>
              
              {/* 텍스트 및 인터랙션 정보 */}
              <View style={styles.cardLeft}>
                <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                <Text style={styles.postDate}>{post.createdAt}</Text>
                
                {/* 스크랩 & 댓글 아이콘 개수 라인 */}
                <View style={styles.interactionRow}>
                  <View style={styles.iconGroup}>
                    <Image
                      source={require('@/assets/icons/heart.png')}
                      style={{ width: 17, height: 14, tintColor: '#c4c4c4', marginRight: 8 }}
                    />
                    <Text style={styles.countText}>{post.likeCount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.iconGroup}>
                    <Image
                    source={require('@/assets/icons/comment.png')}
                      style={{ width: 18, height: 16, tintColor: '#c4c4c4', marginRight: 8 }}
                    />
                    <Text style={styles.countText}>{post.commentCount.toLocaleString()}</Text>
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
