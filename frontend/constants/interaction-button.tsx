import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

interface InteractionButtonProps {
  type: 'like' | 'dislike' | 'comment' | 'bookmark' | 'heart';
  count?: number | string;
  isActive?: boolean;
  onPress?: () => void;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
  textPosition?: 'bottom' | 'right';
  tintColor?: string;
  withShadow?: boolean;
}

const IMAGE_SOURCES = {
  like: require('@/assets/icons/like.png'),
  dislike: require('@/assets/icons/dislike.png'),
  comment: require('@/assets/icons/comment.png'),
  bookmark: require('@/assets/icons/bookmark.png'),
  heart: require('@/assets/icons/heart.png'),
};

const FILLED_IMAGE_SOURCES = {
  bookmark: require('@/assets/icons/filledbookmark.png'),
};

export function InteractionButton({
  type,
  count,
  isActive = false,
  onPress,
  hitSlop,
  textPosition = 'bottom',
  tintColor,
  withShadow = false,
}: InteractionButtonProps) {
  
  const imageSource = (isActive && type === 'bookmark' && FILLED_IMAGE_SOURCES.bookmark)
    ? FILLED_IMAGE_SOURCES.bookmark
    : IMAGE_SOURCES[type];

  const defaultTint = type === 'bookmark' && isActive
    ? '#009205'
    : isActive 
    ? (type === 'like' ? '#FF9500' : type === 'dislike' ? '#FF9500' : type === 'heart' ? '#FF3B30' : '#009205') 
    : '#dcdcdc';

  const iconTint = tintColor ?? defaultTint;
  const isRight = textPosition === 'right';
  const iconStyles = [
    styles.actionIconImage,
    withShadow ? {
      shadowColor: iconTint,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 8,
      elevation: 4,
    } : undefined,
  ];

  return (
    <TouchableOpacity 
      style={[styles.actionButton, isRight ? styles.rowLayout : styles.columnLayout]} 
      onPress={onPress} 
      hitSlop={hitSlop}
    >
      <Image 
        source={imageSource}
        style={iconStyles} 
        tintColor={iconTint}
        resizeMode="contain"
      />
      {count !== undefined && count !== '' && (
        <Text style={[
          styles.actionCountText, 
          isRight ? { marginLeft: 4, color: '#666666' } : { marginTop: 4, color: '#ffffff' }
        ]}>
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: { alignItems: 'center', justifyContent: 'center' },
  columnLayout: { flexDirection: 'column' },
  rowLayout: { flexDirection: 'row' },
  actionIconImage: { width: 22, height: 22 },
  actionCountText: { fontSize: 13, fontWeight: '600' },
});