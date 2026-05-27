import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, StyleSheet,
} from 'react-native';
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

  // 이름 수정 중인 카테고리 ID와 입력값
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchCategories();
  }, [user]);

  // 편집 모드 종료 시 진행 중인 이름 수정도 취소
  const handleToggleEdit = () => {
    if (isEditing) {
      setEditingId(null);
      setEditingName('');
    }
    setIsEditing(prev => !prev);
  };

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

  // 이름 수정 시작
  const handleStartRename = (item: Category) => {
    setEditingId(item.categoryId);
    setEditingName(item.categoryName);
  };

  // 이름 수정 확정 → API 호출
  const handleConfirmRename = async (categoryId: number) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    try {
      await categoryService.updateCategory(categoryId, { categoryName: trimmed });
      setCategories(prev =>
        prev.map(c => c.categoryId === categoryId ? { ...c, categoryName: trimmed } : c)
      );
    } catch {
    } finally {
      setEditingId(null);
      setEditingName('');
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="보관함"
        showBackButton={true}
        rightIcon={
          <TouchableOpacity onPress={handleToggleEdit}>
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
                activeOpacity={isEditing ? 1 : 0.7}
                onPress={() => {
                  if (!isEditing) {
                    router.push(`/(tabs)/bookmark/${item.categoryId}?name=${item.categoryName}` as Href);
                  }
                }}
              >
                <View style={styles.labelContainer}>
                  {/* 편집 모드 + 이 카테고리가 수정 중이면 TextInput 표시 */}
                  {isEditing && editingId === item.categoryId ? (
                    <TextInput
                      style={localStyles.renameInput}
                      value={editingName}
                      onChangeText={setEditingName}
                      onSubmitEditing={() => handleConfirmRename(item.categoryId)}
                      autoFocus
                      returnKeyType="done"
                      maxLength={20}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => isEditing && handleStartRename(item)}
                      disabled={!isEditing}
                    >
                      <Text style={[styles.categoryName, isEditing && localStyles.editableName]} numberOfLines={1}>
                        {item.categoryName}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {isEditing ? (
                  editingId === item.categoryId ? (
                    // 수정 중: 확인 버튼
                    <TouchableOpacity onPress={() => handleConfirmRename(item.categoryId)}>
                      <Text style={localStyles.confirmText}>확인</Text>
                    </TouchableOpacity>
                  ) : (
                    // 수정 중 아닌 것: 삭제 버튼
                    <TouchableOpacity onPress={() => handleDelete(item.categoryId)}>
                      <Text style={styles.deleteText}>삭제</Text>
                    </TouchableOpacity>
                  )
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

const localStyles = StyleSheet.create({
  renameInput: {
    fontSize: 14,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    paddingVertical: 2,
    minWidth: 80,
    color: '#333',
  },
  editableName: {
    textDecorationLine: 'underline',
    color: '#555',
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
