import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { styles } from '@/components/styles/plus';
import { Colors } from '@/constants/colors';
import { postService } from '@/services/post-service';
import { stuffService, StuffSuggestion } from '@/services/stuff-service';
import { TopBar } from '@/components/layout/top-bar';

export default function PlusScreen() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [brandName, setBrandName] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [stuffId, setStuffId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<StuffSuggestion[]>([]);

  const handleBackPress = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.push('/(tabs)/home' as Href);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('알림', '이미지 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleStuffNameChange = async (value: string) => {
    setBrandName(value);
    setStuffId(null);

    const keyword = value.replace('@', '').trim();

    if (!keyword) {
      setSuggestions([]);
      return;
    }

    try {
      const result = await stuffService.searchStuffs(keyword);
      setSuggestions(result);
    } catch (error) {
      console.error('상품 자동완성 검색 실패:', error);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (item: StuffSuggestion) => {
    setBrandName(`@${item.stuffName}`);
    setStuffId(item.stuffId);
    setSuggestions([]);
  };

  const handleNext = async () => {
    try {
      const cleanName = brandName.replace('@', '').trim();

      if (!cleanName) {
        Alert.alert('알림', '상품명을 입력해주세요.');
        return;
      }

      const result = await stuffService.findOrCreateStuff(cleanName);

      setStuffId(result.stuffId);
      setBrandName(`@${result.stuffName}`);
      setSuggestions([]);
      setStep(2);
    } catch (error: any) {
      console.error('상품 확인 실패:', error);
      Alert.alert('오류', error.response?.data?.message || '상품 확인에 실패했습니다.');
    }
  };

  const handleUpload = async () => {
    try {
      if (!stuffId) {
        Alert.alert('알림', '상품을 먼저 선택해주세요.');
        return;
      }

      if (!content.trim()) {
        Alert.alert('알림', '소개글을 작성해주세요.');
        return;
      }

      const result = await postService.createPost({
        content,
        imageUrl: imageUri ?? undefined,
        stuffId,
      });

      console.log('게시글 등록 성공:', result);
      Alert.alert('성공', '게시글이 등록되었습니다.');

      router.push('/(tabs)/home' as Href);
    } catch (error: any) {
      console.error('게시글 등록 실패:', error);
      Alert.alert('오류', error.response?.data?.message || '게시글 등록에 실패했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TopBar title="게시물 업로드" onBackPress={handleBackPress} />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
        >
          {step === 1 ? (
            <>
              <TouchableOpacity style={styles.imageUploadCard} onPress={handlePickImage}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.imageIconPlaceHolder}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('@/assets/icons/search.png')}
                    style={styles.imageIconPlaceHolder}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>

              <View style={styles.userInfoCard}>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.nameInputWrapper}>
                  <TextInput
                    placeholder="@이름 작성"
                    placeholderTextColor={Colors.gray.light}
                    style={styles.nameInput}
                    value={brandName}
                    onChangeText={handleStuffNameChange}
                  />
                </View>
              </View>

              {suggestions.length > 0 && (
                <View style={{ backgroundColor: '#fff', borderRadius: 12, marginTop: 8, padding: 8 }}>
                  {suggestions.map((item) => (
                    <TouchableOpacity
                      key={item.stuffId}
                      onPress={() => handleSelectSuggestion(item)}
                      style={{ paddingVertical: 10 }}
                    >
                      <Text>{`@${item.stuffName}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
                <Text style={styles.submitButtonText}>다음</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.userInfoCard}>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.nameInputWrapper}>
                  <TextInput
                    placeholder="@이름 작성"
                    placeholderTextColor={Colors.gray.light}
                    style={styles.nameInput}
                    value={brandName}
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.contentUploadCard}>
                <View style={styles.contentInputBox}>
                  <TextInput
                    placeholder="소개글을 작성해주세요"
                    placeholderTextColor="#999"
                    style={styles.contentInput}
                    multiline
                    value={content}
                    onChangeText={setContent}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleUpload}>
                <Text style={styles.submitButtonText}>업로드</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}