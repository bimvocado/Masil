import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from './colors'

// 기본 View의 속성을 그대로 물려받으면서 커스텀 스타일을 추가할 수 있게 타입 지정
interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 32,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
});