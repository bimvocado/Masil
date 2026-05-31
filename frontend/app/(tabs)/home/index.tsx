import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, PanResponder, Animated, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, DRAWER_WIDTH } from '@/components/styles/home';
import { PostVerticalFeed } from '@/components/post/post-vertical-feed';
import { postService } from '@/services/post-service';
import { useAuthStore } from '@/store/use-auth-store';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'ALL' | 'FOOD' | 'STUFF'>('ALL');
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const isDrawerOpenRef = useRef(false);

  const drawerX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const touchSlop = { top: 10, bottom: 10, left: 10, right: 10 };

  const shufflePosts = (items: any[]) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await postService.getPosts();
      setPosts(shufflePosts(allPosts));
    } catch (error) {
      console.error('홈 게시글 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openDrawer = () => {
    Animated.timing(drawerX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setIsDrawerOpen(true);
      isDrawerOpenRef.current = true;
    });
  };

  const closeDrawer = () => {
    Animated.timing(drawerX, {
      toValue: -DRAWER_WIDTH,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setIsDrawerOpen(false);
      isDrawerOpenRef.current = false;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (isDrawerOpenRef.current) {
          return gestureState.dx < -10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        } else {
          const isFromLeftEdge = gestureState.x0 < 60;
          return isFromLeftEdge && gestureState.dx > 5 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const startX = isDrawerOpenRef.current ? 0 : -DRAWER_WIDTH;
        let newX = startX + gestureState.dx;

        if (newX > 0) newX = 0;
        if (newX < -DRAWER_WIDTH) newX = -DRAWER_WIDTH;

        drawerX.setValue(newX);
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (isDrawerOpenRef.current) {
          if (gestureState.dx < -50 || gestureState.vx < -0.2) {
            closeDrawer();
          } else {
            openDrawer();
          }
        } else {
          if (gestureState.dx > 50 || gestureState.vx > 0.2) {
            openDrawer();
          } else {
            closeDrawer();
          }
        }
      },
    })
  ).current;

  const overlayOpacity = drawerX.interpolate({
    inputRange: [-DRAWER_WIDTH, 0],
    outputRange: [0, 0.5],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      
      {/* 피드 본체 레이아웃 */}
      <View style={styles.reelsPostContainer}>
        {isLoading ? (
          <View style={styles.fullScreenPlaceholder}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : posts.length > 0 ? (
          <PostVerticalFeed posts={posts} user={user} onPostUpdate={setPosts} />
        ) : (
          <View style={styles.fullScreenPlaceholder}>
            <Text style={{ color: '#fff', fontSize: 16 }}>게시글이 없습니다.</Text>
          </View>
        )}

        {/* 최상단 카테고리 전환 탭 바 */}
        <View style={[styles.topTabContainer, { top: insets.top + 12 }]}>
          <TouchableOpacity style={styles.topTabButton} onPress={() => setCurrentTab('ALL')}>
            <Text style={[styles.topTabText, currentTab === 'ALL' && styles.activeTopTabText]}>전체</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topTabButton} onPress={() => setCurrentTab('FOOD')}>
            <Text style={[styles.topTabText, currentTab === 'FOOD' && styles.activeTopTabText]}>음식</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topTabButton} onPress={() => setCurrentTab('STUFF')}>
            <Text style={[styles.topTabText, currentTab === 'STUFF' && styles.activeTopTabText]}>물건</Text>
          </TouchableOpacity>
        </View>

        

      </View>
      
      {/* 뒷배경 */}
      <Animated.View 
        pointerEvents={isDrawerOpen ? 'auto' : 'none'}
        style={[styles.drawerOverlay, { opacity: overlayOpacity }]}
      >
        <TouchableOpacity style={styles.drawerCloseArea} onPress={closeDrawer} activeOpacity={1} />
      </Animated.View>

      {/* 보관함 본체 */}
      <Animated.View 
        pointerEvents={isDrawerOpen ? 'auto' : 'none'}
        style={[styles.drawerContainer, { left: drawerX }]} 
      >
    

      </Animated.View>
    </View>
  );
}