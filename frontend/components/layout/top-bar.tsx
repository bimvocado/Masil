import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


interface TopBarProps {
  title?: string;                // 가운데 들어갈 제목 (예: '내 정보', '롯데리아')
  showBackButton?: boolean;      // 뒤로가기 버튼 표시 여부 (기본값: true)
  rightIcon?: React.ReactNode;   // 우측에 들어갈 커스텀 아이콘 (예: 설정 톱니바퀴)
  onBackPress?: () => void;      // 뒤로가기 버튼을 눌렀을 때 실행할 커스텀 함수 (없으면 기본 뒤로가기 동작 -> 아직 다 홈으로 돌아갑니다!)
}

export function TopBar({ 
  title, 
  showBackButton = true, 
  rightIcon, 
  onBackPress 
}: TopBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();


  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };


  const touchSlop = { top: 10, bottom: 10, left: 10, right: 10 };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        

        <View style={styles.sideContainer}>
          {showBackButton && (
            <TouchableOpacity onPress={handleBackPress} hitSlop={touchSlop}>
              <Text style={styles.backButtonText}>{'<'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerContainer}>
          {title && (
            <Text style={styles.titleText}>{title}</Text>
          )}
        </View>

        <View style={styles.sideContainer}>
          {rightIcon && (
            <View>{rightIcon}</View>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sideContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },
});