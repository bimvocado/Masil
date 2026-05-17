import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { styles } from '@/components/styles/plus';
import { Colors } from '@/constants/colors';

import { TopBar } from '@/components/layout/top-bar'; 

export default function PlusScreen() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  
  const [brandName, setBrandName] = useState('');
  const [content, setContent] = useState('');

  // 뒤로가기를 눌렀을 때 작동할 로직
  const handleBackPress = () => {
    if (step === 2) {
      setStep(1); // 2단계면 1단계로 되돌아가기
    } else {
      router.push('/(tabs)/home' as Href); // 1단계면 탭을 홈으로
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >

      <TopBar 
          title="게시물 업로드" 
          onBackPress={handleBackPress} 
      />
      
      <View style={styles.container}>
        


        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}>
          
          {step === 1 ? (
            <>
              <TouchableOpacity style={styles.imageUploadCard}>
                <Image 
                  source={require('@/assets/icons/search.png')} // 이거 일단 검색 아이콘으로 해놨는데 나중에 이미지 업로드 아이콘으로 바꿔주세요 ㅋㅋㅋ
                  style={styles.imageIconPlaceHolder} 
                  resizeMode="contain" 
                />
              </TouchableOpacity>

              <View style={styles.userInfoCard}>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.nameInputWrapper}>
                  <TextInput 
                    placeholder="@이름 작성" 
                    placeholderTextColor={Colors.gray.light}
                    style={styles.nameInput} 
                    value={brandName}
                    onChangeText={setBrandName}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={() => setStep(2)}>
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
                    onChangeText={setBrandName}
                  />
                </View>
              </View>

              <View style={styles.contentUploadCard}>
                <View style={styles.contentInputBox}>
                  <TextInput 
                    placeholder="소개글을 작성해주세요" 
                    placeholderTextColor="#999"
                    style={styles.contentInput} 
                    multiline={true}
                    value={content}
                    onChangeText={setContent}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={() => console.log('업로드할 데이터:', { brandName, content })}
              >
                <Text style={styles.submitButtonText}>업로드</Text>
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}