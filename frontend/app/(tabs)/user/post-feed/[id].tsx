import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Post } from '@/types/post';
const { height: WINDOW_HEIGHT } = Dimensions.get('window');

//테스트용
const MOCK_POSTS: Post[] = [
  { 
    postId: 1, 
    userId: 999,          
    stuffId: 101,         
    title: '새우버거 리뷰',  
    content: '맛있네요ㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㅇㅇㅇㅇㅇ', 
    createdAt: '2024.05.19', 
    updatedAt: '2024.05.19', 
    
    
    brandId: 3, 
    stuffName: '새우버거', 
    likeCount: 123, 
    commentCount: 10, 
    isScrapped: false,
    scrapCount: 3
  }
];
export default function UserPostFeedScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // 내가 클릭한 게시물의 순서(Index) 찾기
  const initialIndex = MOCK_POSTS.findIndex(p => p.postId.toString() === id);

  const renderItem = ({ item }: any) => (
    <View style={styles.page}>
      {/* 1. 배경: 내가 올린 사진 영역 (공란) */}
      <View style={styles.backgroundContainer}>
         <Text style={styles.emptyText}>내가 올린 사진 영역</Text>
      </View>

      {/* 2. 우측: 인터랙션 버튼들 (시안 위치) */}
      <View style={styles.rightOverlay}>
        <View style={styles.iconGroup}><Text style={styles.icon}>👍</Text><Text style={styles.iconCount}>{item.likeCount}</Text></View>
        <View style={styles.iconGroup}><Text style={styles.icon}>👎</Text><Text style={styles.iconCount}>{item.likeCount}</Text></View>
        <View style={styles.iconGroup}><Text style={styles.icon}>💬</Text><Text style={styles.iconCount}>{item.likeCount}</Text></View>
      </View>

      {/* 3. 하단: 정보 영역 (시안 위치) */}
      <View style={styles.bottomOverlay}>
        <View style={styles.userRow}>
          <View style={styles.userCircle}><Text style={{color:'#fff', fontSize:12}}>L</Text></View>
          <Text style={styles.postTitle}>{item.title}</Text>
        </View>
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.tags}>{item.tags?.join(' ')}</Text>
      </View>

      {/* 상단 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        data={MOCK_POSTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.postId.toString()}
        pagingEnabled 
        showsVerticalScrollIndicator={false}
        initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
        getItemLayout={(_, index) => ({
          length: WINDOW_HEIGHT,
          offset: WINDOW_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { height: WINDOW_HEIGHT, width: '100%' },
  backgroundContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#888', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#ccc', fontSize: 16 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  backButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  rightOverlay: { position: 'absolute', right: 15, bottom: 80, alignItems: 'center' },
  iconGroup: { alignItems: 'center', marginBottom: 15 },
  icon: { fontSize: 28, marginBottom: 4 },
  iconCount: { color: '#fff', fontSize: 12, fontWeight: '600' },
  bottomOverlay: { position: 'absolute', left: 20, bottom: 40, right: 100 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  userCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FF8888', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  postTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { color: '#fff', fontSize: 14, marginBottom: 5 },
  tags: { color: '#fff', fontSize: 14, fontWeight: '300' },
});