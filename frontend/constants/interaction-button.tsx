import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

interface InteractionButtonProps {
  type: 'like' | 'dislike' | 'comment' | 'bookmark' | 'heart'; // 버튼 종류만
  count: number | string;
  isActive?: boolean;
  onPress?: () => void;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
}

// type별 이미지 경로
const IMAGE_SOURCES = {
  like: require('@/assets/icons/like.png'),
  dislike: require('@/assets/icons/dislike.png'),
  comment: require('@/assets/icons/comment.png'),
  bookmark: require('@/assets/icons/bookmark.png'),
  heart: require('@/assets/icons/heart.png'),
};

export function InteractionButton({
  type,
  count,
  isActive = false,
  onPress,
  hitSlop,
}: InteractionButtonProps) {
  
  const imageSource = IMAGE_SOURCES[type];

  // 활성화 상태에 따른 색상 (백엔드 토글용)
  const iconTintColor = isActive 
    ? (type === 'like' ? '#FF9500' : type === 'dislike' ? '#FF9500' : type === 'heart' ? '#FF3B30' : '#009205') 
    : '#dcdcdc';

  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} hitSlop={hitSlop}>
      <View style={[styles.actionIconCircle, isActive && styles.activeCircle]}>
        <Image 
          source={imageSource}
          style={styles.actionIconImage} 
          tintColor={iconTintColor}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.actionCountText}>{count}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: { alignItems: 'center', marginVertical: 12 },
  actionIconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  activeCircle: { backgroundColor: 'rgba(255,255,255,0.2)' },
  actionIconImage: { width: 24, height: 24 },
  actionCountText: { fontSize: 12, fontWeight: '600', color: '#ffffff' },
});