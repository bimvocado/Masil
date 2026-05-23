import { 
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useState } from 'react';
import { authStyles as styles } from '@/components/styles/auth';
import { authService } from '@/services/auth-service';
import { useAuthStore } from '@/store/use-auth-store';

export default function EntryScreen() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser); // 창고에 저장하는 함수

  const [isLoginView, setIsLoginView] = useState(true);
  
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    email: '',
    nickname: '',
    birthDate: '', // 0000-00-00 형식
  });


  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async () => {
    try {
      if (isLoginView) {
        // --- [로그인 로직] ---
        if (!formData.loginId || !formData.password) return Alert.alert('알림', '아이디와 비번을 입력해주세요.');
        
        const userData = await authService.login(formData.loginId, formData.password);
        setUser(userData); 
        Alert.alert('환영합니다!', `${userData.nickname}님, 마실에 오신 걸 환영해요!`);
        router.replace('/(tabs)/home');

      } else {
        // --- [회원가입 로직] ---
        console.log('3. 백엔드 전송 직전 데이터:', formData); 

        const newUser = await authService.register({
          loginId: formData.loginId,
          password: formData.password,
          email: formData.email,
          nickname: formData.nickname,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : new Date(),
          isKorean: 'KOREAN'
        });
        
        console.log('4. 가입 성공 응답:', newUser); 
        Alert.alert('가입 완료', '성공적으로 가입되었습니다. 로그인해주세요!');
        setIsLoginView(true);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('오류', error.response?.data?.message || '처리에 실패했습니다.');
    }
  };
  const handleLogin = async () => {
    try {
      // loginId, password는 formData에서 꺼내 쓰는 걸로 가정!
      const result: any = await authService.login(formData.loginId, formData.password);
      
      if (result.success) { // 이제 에러 안 남!
        console.log('로그인 유저 정보:', result.data); // 이제 에러 안 남!
        router.push('/home'); 
      }
    } catch (error: any) { // error를 any로 지정하여 에러 해결!
      alert('로그인 실패: ' + (error.response?.data?.message || error.message));
    }
  };
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        
        <Text style={styles.title}>{isLoginView ? 'Hello!' : 'Welcome!'}</Text>
        <Text style={styles.subtitle}>
          {isLoginView ? '마실에 오신 것을 환영합니다!' : '마실이 처음이신가요?'}
        </Text>

        <View style={{ width: '100%', marginBottom: 20 }}>
          {/* 아이디 입력 */}
          <TextInput 
            style={styles.input} 
            placeholder={isLoginView ? "아이디" : "사용할 아이디"} 
            placeholderTextColor="#8DBA7D"
            value={formData.loginId}
            onChangeText={(v) => handleChange('loginId', v)}
          />
          
          {/* 회원가입 시에만 보이는 이메일 입력 */}
          {!isLoginView && (
            <TextInput 
              style={styles.input} 
              placeholder="email" 
              placeholderTextColor="#8DBA7D"
              value={formData.email}
              onChangeText={(v) => handleChange('email', v)}
            />
          )}

          {/* 비밀번호 입력 */}
          <TextInput 
            style={styles.input} 
            placeholder="password" 
            secureTextEntry 
            placeholderTextColor="#8DBA7D"
            value={formData.password}
            onChangeText={(v) => handleChange('password', v)}
          />

          {/* 회원가입 전용 추가 정보 */}
          {!isLoginView && (
            <>
              <TextInput 
                style={styles.input} 
                placeholder="nickname" 
                placeholderTextColor="#8DBA7D" 
                value={formData.nickname}
                onChangeText={(v) => handleChange('nickname', v)}
              />
              <TextInput 
                style={styles.input} 
                placeholder="birthDate(0000-00-00)" 
                placeholderTextColor="#8DBA7D" 
                value={formData.birthDate}
                onChangeText={(v) => handleChange('birthDate', v)}
              />
            </>
          )}
        </View>

        {/* 메인 실행 버튼 */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#8DBA7D' }]} 
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>
            {isLoginView ? '로그인하기' : '가입 완료하기'}
          </Text>
        </TouchableOpacity>

        {/* 뷰 전환 버튼 */}
        <TouchableOpacity 
          style={[styles.button, styles.whiteButton, { marginTop: 10 }]}
          onPress={() => setIsLoginView(!isLoginView)}
        >
          <Text style={styles.buttonText}>
            {isLoginView ? '이메일로 회원가입' : '이미 계정이 있으신가요?'}
          </Text>
        </TouchableOpacity>

        {isLoginView && (
          <TouchableOpacity style={[styles.button, styles.kakaoButton, { marginTop: 10 }]}>
            <Text style={styles.buttonText}>카카오톡으로 시작하기</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}