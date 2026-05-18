import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useState } from 'react';
import { authStyles as styles } from '@/components/styles/auth'; // 별칭 사용


export default function EntryScreen() {
  const router = useRouter();

  // true: 회원가입 화면 생략하고 바로 '홈'으로 이동
  // false: 회원가입 화면(대문) 보여줌
  const skipSignup = false; 

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    nickname: '',
  });
  const [isLoginView, setIsLoginView] = useState(true);
  if (skipSignup) {
    return <Redirect href="/(tabs)/home" />;
  }

  const handleSignup = () => {
    console.log('가입 데이터:', formData);

    router.replace('/(tabs)/home'); 
  };

  return (
    // KeyboardAvoidingView는 키보드가 올라올 때 입력창을 가리지 않게 해줍니다.
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        
        {/* 상단 텍스트 영역 */}
        <Text style={styles.title}>
          {isLoginView ? 'Hello!' : 'Welcome!'}
        </Text>
        <Text style={styles.subtitle}>
          {isLoginView ? '마실에 오신 것을 환영합니다!' : '마실이 처음이신가요?'}
        </Text>

        {/* 입력창 영역 (시안의 알약 모양) */}
        <View style={{ width: '100%', marginBottom: 20 }}>
          <TextInput 
            style={styles.input} 
            placeholder={isLoginView ? "아이디 or email" : "사용할 아이디"} 
            placeholderTextColor="#8DBA7D"
          />
          
          {!isLoginView && (
            <TextInput 
              style={styles.input} 
              placeholder="email" 
              placeholderTextColor="#8DBA7D"
            />
          )}

          <TextInput 
            style={styles.input} 
            placeholder="password" 
            secureTextEntry 
            placeholderTextColor="#8DBA7D"
          />

          {!isLoginView && (
            <>
              <TextInput style={styles.input} placeholder="name" placeholderTextColor="#8DBA7D" />
              <TextInput style={styles.input} placeholder="birthDate(0000-00-00)" placeholderTextColor="#8DBA7D" />
            </>
          )}
        </View>

        {/* 버튼 영역 */}
        <TouchableOpacity 
          style={[styles.button, styles.whiteButton]}
          onPress={() => setIsLoginView(!isLoginView)} // 클릭 시 가입/로그인 뷰 전환 테스트
        >
          <Text style={styles.buttonText}>
            {isLoginView ? '회원가입' : '가입하기'}
          </Text>
        </TouchableOpacity>

        {isLoginView && (
          <TouchableOpacity style={[styles.button, styles.kakaoButton]}>
            <Text style={styles.buttonText}>카카오톡으로 시작하기</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}