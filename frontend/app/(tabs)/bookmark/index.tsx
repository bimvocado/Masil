import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { styles } from '../../../components/styles/bookmark';
import { Category } from '@/types/category'; // 👈 인터페이스 임포트

// 1. MOCK 데이터를 실제 값으로 수정
const MOCK_CATEGORIES: Category[] = [
  { categoryId: 1, categoryName: '싫소', postInCategoryCount: 5 },
  { categoryId: 2, categoryName: '좋아요한 글', postInCategoryCount: 6544 },
  { categoryId: 3, categoryName: '먹킷리스트', postInCategoryCount: 12 },
];

export default function BookmarkScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // 2. State에도 Category[] 타입을 적용해서 변수명 싱크 강제
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  // 추가 로직도 변수명에 맞게 수정
  const handleAdd = () => {
    const newName = `새 폴더 ${categories.length + 1}`;
    const newCategory: Category = {
      categoryId: Date.now(), // 숫자로 통일
      categoryName: newName,
      postInCategoryCount: 0
    };
    setCategories([...categories, newCategory]);
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
              key={item.categoryId} // id -> categoryId
              style={styles.categoryCard}
              onPress={() => {
                if (!isEditing) {
                  // URL 파라미터도 통일된 이름으로 전달
                  router.push(`/(tabs)/bookmark/${item.categoryId}?name=${item.categoryName}` as Href);
                }
              }}
            >
              <View style={styles.labelContainer}>
                {/* name -> categoryName */}
                <Text style={styles.categoryName} numberOfLines={1}>{item.categoryName}</Text>
              </View>
              
              {isEditing ? (
                <TouchableOpacity onPress={() => setCategories(categories.filter(c => c.categoryId !== item.categoryId))}>
                  <Text style={styles.deleteText}>삭제</Text>
                </TouchableOpacity>
              ) : (
                // count -> postInCategoryCount
                <Text style={styles.countText}>{item.postInCategoryCount}</Text>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addCategoryButton} onPress={handleAdd}>
            <Text style={styles.addCategoryText}>+ 카테고리 추가</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}