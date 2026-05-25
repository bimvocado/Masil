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

  const [isIdChecked, setIsIdChecked] = useState(false); // 아이디 중복 체크 통과 여부
  
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    email: '',
    nickname: '',
    birthDate: '', // 0000-00-00 형식
  });


  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'loginId') setIsIdChecked(false);
  };

  const handleCheckId = async () => {
    if (!formData.loginId) {
      alert('아이디를 입력해주세요.'); // Alert.alert 대신 일반 alert 사용 테스트
      return;
    }  try {
      const result = await authService.checkDuplicate('loginId', formData.loginId);
      console.log('서버에서 온 진짜 결과물:', result);
      
      if (result.isDuplicate) {
        alert('이미 사용 중인 아이디입니다. ❌');
        setIsIdChecked(false);
      } else {
        alert('사용 가능한 아이디입니다! ✅');
        setIsIdChecked(true); // 
      }
    } catch (error) {
      alert('중복 확인 중 에러가 발생했습니다.');
      console.error(error);
    }
  };


  const handleSubmit = async () => {
    try {
      if (isLoginView) {
        // --- [로그인 로직] ---
        console.log('로그인 시도 중...', formData.loginId);
        if (!formData.loginId || !formData.password) {
          return Alert.alert('알림', '아이디와 비번을 입력해주세요.');
        }
        
        // 1. 서버에 로그인 요청
        const result = await authService.login(formData.loginId, formData.password);
        
        // 2. 서버 응답 구조 확인 (result.success가 true인 경우)
        if (result.success) {
          const userData = result.data; // 실제 유저 정보는 data 안에 있음
          
          console.log('로그인 성공 유저 정보:', userData);
          
          setUser(userData); // Zustand 창고에 저장
          Alert.alert('환영합니다!', `${userData.nickname}님, 마실에 오신 걸 환영해요!`);
          
          // 3. 페이지 이동
          router.replace('/(tabs)/home'); 
        } else {
          Alert.alert('로그인 실패', result.message || '정보를 확인해주세요.');
        }

      } else {
        // --- [회원가입 로직] ---
        console.log('회원가입 요청 데이터:', formData); 
        if (!isIdChecked) return Alert.alert('알림', '아이디 중복 확인을 해주세요.');

        const newUserResponse = await authService.register({
          loginId: formData.loginId,
          password: formData.password,
          email: formData.email,
          nickname: formData.nickname,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : new Date(),
          isKorean: false
        });
        
        Alert.alert('가입 완료', '성공적으로 가입되었습니다. 로그인해주세요!');
        setIsLoginView(true); // 로그인 화면으로 전환
      }
    } catch (error: any) {
      console.error('Submit 에러 상세:', error);
      // 에러 메시지가 있다면 보여주고, 없으면 기본 메시지
      const errorMsg = error.response?.data?.message || '처리에 실패했습니다.';
      Alert.alert('오류', errorMsg);
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
          {/* --- 아이디 입력부 (중복 확인 포함) --- */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <TextInput 
              style={[styles.input, { flex: 1, marginBottom: 0 }]} 
              placeholder={isLoginView ? "아이디" : "사용할 아이디"} 
              placeholderTextColor="#8DBA7D"
              value={formData.loginId}
              onChangeText={(v) => handleChange('loginId', v)}
            />
            {/* 회원가입 모드일 때만 중복확인 버튼 표시 */}
            {!isLoginView && (
              <TouchableOpacity 
                style={{ 
                  backgroundColor: isIdChecked ? '#E0E0E0' : '#8DBA7D', 
                  paddingHorizontal: 15, 
                  height: 50, // 기존 input 높이에 맞춤
                  justifyContent: 'center',
                  borderRadius: 10, 
                  marginLeft: 10 
                }}
                onPress={handleCheckId}
                disabled={isIdChecked}
              >
                <Text style={{ color: isIdChecked ? '#888' : '#fff', fontWeight: 'bold' }}>
                  {isIdChecked ? '확인됨' : '중복확인'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
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

        {/* 메인 실행 버튼: 회원가입 시 중복확인 안되면 반투명 처리 */}
        <TouchableOpacity 
          style={[
            styles.button, 
            { backgroundColor: '#8DBA7D' },
            (!isLoginView && !isIdChecked) && { opacity: 0.4 } 
          ]} 
          onPress={handleSubmit}
          disabled={!isLoginView && !isIdChecked} // 중복확인 전까지 가입 버튼 클릭 방지
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>
            {isLoginView ? '로그인하기' : '가입 완료하기'}
          </Text>
        </TouchableOpacity>

        {/* 뷰 전환 버튼 */}
        <TouchableOpacity 
          style={[styles.button, styles.whiteButton, { marginTop: 10 }]}
          onPress={() => {
            setIsLoginView(!isLoginView);
            setIsIdChecked(false); // 뷰 전환 시 체크 상태 초기화
          }}
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