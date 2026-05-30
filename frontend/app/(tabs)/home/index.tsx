import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, PanResponder, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, DRAWER_WIDTH } from '@/components/styles/home';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'ALL' | 'FOOD' | 'STUFF'>('ALL');

  const isDrawerOpenRef = useRef(false);

  const drawerX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const touchSlop = { top: 10, bottom: 10, left: 10, right: 10 };

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
        <View style={styles.fullScreenPlaceholder} />

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

        {/* 상단 유저 정보 */}
        <View style={[styles.topProfileContainer, { top: insets.top + 64 }]}>
          <View style={styles.miniAvatar} />
          <Text style={styles.miniUsername}>abcd</Text>
          <Text style={styles.starIcon}>⭐</Text>
        </View>

        {/* 우측 세로 인터랙션 버튼 스택 */}
        <View style={styles.rightActionsContainer}>
          <TouchableOpacity style={styles.actionButton} hitSlop={touchSlop}>
              <Image source={require('@/assets/icons/like.png')} style={styles.actionIconImage} tintColor="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.actionCountText}>1,234</Text>

          <TouchableOpacity style={styles.actionButton} hitSlop={touchSlop}>
              <Image source={require('@/assets/icons/dislike.png')} style={styles.actionIconImage} tintColor="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.actionCountText}>1,234</Text>

          <TouchableOpacity style={styles.actionButton} hitSlop={touchSlop}>
            <Image source={require('@/assets/icons/comment.png')} style={styles.actionIconImage} tintColor="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.actionCountText}>1,234</Text>
        </View>

        {/* 좌측 하단 글 정보 텍스트 */}
        <View style={styles.bottomInfoContainer}>
          <View style={styles.brandRow}>
            <View style={styles.brandLogoCircle}><Text style={styles.brandLogoText}>L</Text></View>
            <Text style={styles.brandNameText}>롯데리아 OO버거</Text>
          </View>
          <Text style={styles.reviewCommentText} numberOfLines={2}>간단한 리뷰 코멘트{"\n"}or 댓글?</Text>
          <Text style={styles.tagText} numberOfLines={1}>@콜라 @감튀 @밀크쉐이크</Text>
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
        <Text style={styles.drawerTitle}>보 관 함</Text>
        <View style={styles.drawerItem}>
          <Text style={styles.drawerItemName}>냠 냠</Text>
          <Text style={styles.drawerItemCount}>3</Text>
        </View>
        <View style={styles.drawerItem}>
          <Text style={styles.drawerItemName}>카테고리</Text>
          <Text style={styles.drawerItemCount}>개수</Text>
        </View>
        <View style={styles.drawerItem}>
          <Text style={styles.drawerItemName}>카테고리</Text>
          <Text style={styles.drawerItemCount}>개수</Text>
        </View>
      </Animated.View>
    </View>
  );
}