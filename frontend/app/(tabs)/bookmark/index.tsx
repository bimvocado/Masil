import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'; // Alert 추가
import { useRouter, Href } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { styles } from '../../../components/styles/bookmark';

interface CategoryMock {
  id: string;
  name: string;
  count: number | string;
}

export default function BookmarkScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [categories, setCategories] = useState<CategoryMock[]>([
    { id: '1', name: '싫소', count: 5 },
    { id: '2', name: '싫소', count: 6544 },
    { id: '3', name: '좋아요한 글', count: 2 },
    { id: '4', name: '댓글단 글', count: 21 },
    { id: '5', name: '먹킷리스트', count: '개수' },
    { id: '6', name: '꿀템리스트', count: '개수' },
  ]);

  // 효율적인 추가 로직 (한 줄 컷)
  const handleAdd = () => {
    const newName = `새 폴더 ${categories.length + 1}`;
    setCategories([...categories, { id: String(Date.now()), name: newName, count: 0 }]);
};

  return (
    <View style={styles.container}>
      <TopBar
        title="보관함"
        showBackButton={true}
        rightIcon={
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.topBarButtonText}>
              {isEditing ? '완료' : '편집'}
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {categories.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.categoryCard}
              onPress={() => {
                if (!isEditing) {
                  router.push(`/(tabs)/bookmark/${item.id}?name=${item.name}` as Href);
                }
              }}
            >
              <View style={styles.labelContainer}>
                <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
              </View>
              
              {isEditing ? (
                <TouchableOpacity onPress={() => setCategories(categories.filter(c => c.id !== item.id))}>
                  <Text style={styles.deleteText}>삭제</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.countText}>{item.count}</Text>
              )}
            </TouchableOpacity>
          ))}

          {/* + 카테고리 추가 버튼 (handleAdd 연결 완료) */}
          <TouchableOpacity style={styles.addCategoryButton} onPress={handleAdd}>
            <Text style={styles.addCategoryText}>+ 카테고리 추가</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}