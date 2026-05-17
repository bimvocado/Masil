import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { styles } from '../../../components/styles/bookmark-detail';

interface SavedPostMock {
  postId: number;
  title: string;
  handle: string;
  createdAt: string;
  isBookmarked: boolean; // 스크랩 상태 트리거
}

export default function CategoryDetailScreen() {
  const { name } = useLocalSearchParams(); // 상단바 타이틀로 쓸 카테고리명
  const [searchQuery, setSearchQuery] = useState('');

  const [posts, setPosts] = useState<SavedPostMock[]>(
    Array.from({ length: 3 }, (_, i) => ({
      postId: i + 1,
      title: '간단한 리뷰 코멘트',
      handle: '@블라블라',
      createdAt: '작성일자',
      isBookmarked: true,
    }))
  );

  // 북마크 아이콘 누르면 스크랩 즉시 토글(취소)
  const toggleBookmark = (id: number) => {
    setPosts(posts.map(post => 
      post.postId === id ? { ...post, isBookmarked: !post.isBookmarked } : post
    ));
  };

  return (
    <View style={styles.container}>
      <TopBar title={name as string || "보관함 목록"} showBackButton={true} />

      {/* 상단 상품/저장일자 검색바 */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Image source={require('@/assets/icons/search.png')} style={styles.searchIconImage} resizeMode="contain" />
          <TextInput
            style={styles.input}
            placeholder="상품/ 저장일자"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* 게시글 리스트 */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {posts.map((post) => (
          <View key={post.postId} style={styles.postCard}>
            
            {/* 왼쪽에 배치된 북마크 아이콘 */}
            <TouchableOpacity 
              style={styles.bookmarkButton} 
              onPress={() => toggleBookmark(post.postId)}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Image
                source={require('@/assets/icons/bookmark.png')}
                style={[
                  styles.bookmarkIcon,
                  { tintColor: post.isBookmarked ? '#009205' : '#ccc' } // 취소되면 회색으로 비활성화
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* 카드 중앙 정보 텍스트 */}
            <View style={styles.cardLeft}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postHandle}>{post.handle}</Text>
              <Text style={styles.postDate}>{post.createdAt}</Text>
              
              <View style={styles.interactionRow}>
                <View style={styles.iconGroup}>
                  <Image
                      source={require('@/assets/icons/heart.png')}
                      style={{ width: 17, height: 14, tintColor: '#c4c4c4', marginRight: 8 }}
                  />
                  <Text style={styles.countText}>1,234</Text>
                </View>
                <View style={styles.iconGroup}>
                    <Image
                        source={require('@/assets/icons/comment.png')}
                        style={{ width: 18, height: 16, tintColor: '#c4c4c4', marginRight: 8 }}
                    />
                  <Text style={styles.countText}>1,234</Text>
                </View>
              </View>
            </View>

            {/* 카드 우측 썸네일 */}
            <View style={styles.thumbnailPlaceholder} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}