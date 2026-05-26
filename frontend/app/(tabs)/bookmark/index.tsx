import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { TopBar } from '@/components/layout/top-bar';
import { styles } from '../../../components/styles/bookmark';
import { Category } from '@/types/category';
import { categoryService } from '@/api/category-service';
import { useAuthStore } from '@/store/use-auth-store';

export default function BookmarkScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await categoryService.getCategories(user.userId);
      setCategories(res.data ?? []);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!user) return;
    const newName = `새 폴더 ${categories.length + 1}`;
    try {
      const res = await categoryService.createCategory(user.userId, { categoryName: newName });
      setCategories(prev => [...prev, res.data]);
    } catch {}
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(c => c.categoryId !== categoryId));
    } catch {}
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

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#888" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.gridContainer}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.categoryId}
                style={styles.categoryCard}
                onPress={() => {
                  if (!isEditing) {
                    router.push(`/(tabs)/bookmark/${item.categoryId}?name=${item.categoryName}` as Href);
                  }
                }}
              >
                <View style={styles.labelContainer}>
                  <Text style={styles.categoryName} numberOfLines={1}>{item.categoryName}</Text>
                </View>

                {isEditing ? (
                  <TouchableOpacity onPress={() => handleDelete(item.categoryId)}>
                    <Text style={styles.deleteText}>삭제</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.countText}>{item.postInCategoryCount}</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.addCategoryButton} onPress={handleAdd}>
              <Text style={styles.addCategoryText}>+ 카테고리 추가</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
