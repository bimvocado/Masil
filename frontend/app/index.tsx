import { View,Text,TextInput,TouchableOpacity,ScrollView, KeyboardAvoidingView,Platform, ImageBackground,} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useState, useRef } from 'react';
import { authStyles as styles } from '@/components/styles/auth';
import { SoftWaveBackground } from '@/components/ui/soft-wave-background';
import { useAuthStore } from '@/store/use-auth-store';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { authService } from '@/api/auth-service';

export default function EntryScreen() {
  const router = useRouter();
  const { setUser, isLoggedIn } = useAuthStore();
  const [isLoginView, setIsLoginView] = useState(true);
  const [isIdChecked, setIsIdChecked] = useState(false);

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    email: '',
    nickname: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState({
    loginId: '',
    password: '',
    email: '',
    nickname: '',
    birthDate: '',
    general: '',
  });
  const [validatedLoginId, setValidatedLoginId] = useState('');
  const [idCheckMessage, setIdCheckMessage] = useState('');
  const [idCheckSuccess, setIdCheckSuccess] = useState(false);
  const loginIdRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const nicknameRef = useRef<TextInput | null>(null);
  const birthDateRef = useRef<TextInput | null>(null);

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  const clearValidationState = () => {
    setErrors({
      loginId: '',
      password: '',
      email: '',
      nickname: '',
      birthDate: '',
      general: '',
    });
    setIdCheckMessage('');
    setIdCheckSuccess(false);
    setIsIdChecked(false);
    setValidatedLoginId('');
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    if (name === 'loginId') {
      setIsIdChecked(false);
      setValidatedLoginId('');
      setIdCheckMessage('');
      setIdCheckSuccess(false);
    }
  };

  const handleCheckId = async () => {
    setErrors(prev => ({ ...prev, general: '' }));
    setIdCheckMessage('');
    setIdCheckSuccess(false);
    if (!formData.loginId) {
      setErrors(prev => ({ ...prev, loginId: '아이디를 입력해주세요.' }));
      loginIdRef.current?.focus();
      return;
    }
    try {
      const result = await authService.checkDuplicate('loginId', formData.loginId);
      const isDuplicate = result?.isDuplicate ?? true;
      if (isDuplicate) {
        setErrors(prev => ({ ...prev, loginId: '이미 사용 중인 아이디입니다.' }));
        setIsIdChecked(false);
        setValidatedLoginId('');
        loginIdRef.current?.focus();
      } else {
        setErrors(prev => ({ ...prev, loginId: '' }));
        setIsIdChecked(true);
        setValidatedLoginId(formData.loginId);
        setIdCheckMessage('사용 가능한 아이디입니다!');
        setIdCheckSuccess(true);
      }
    } catch (error) {
      console.error('중복 확인 에러:', error);
      setErrors(prev => ({ ...prev, loginId: '중복 확인 중 에러가 발생했습니다.' }));
      setIsIdChecked(false);
      setValidatedLoginId('');
    }
  };

  const handleSubmit = async () => {
    const nextErrors = {
      loginId: '',
      password: '',
      email: '',
      nickname: '',
      birthDate: '',
      general: '',
    };
    let firstFocusHandled = false;

    if (isLoginView) {
      if (!formData.loginId) {
        nextErrors.loginId = '아이디를 입력해주세요.';
        if (!firstFocusHandled) {
          loginIdRef.current?.focus();
          firstFocusHandled = true;
        }
      }
      if (!formData.password) {
        nextErrors.password = '비밀번호를 입력해주세요.';
        if (!firstFocusHandled) {
          passwordRef.current?.focus();
          firstFocusHandled = true;
        }
      }
      if (nextErrors.loginId || nextErrors.password) {
        setErrors(nextErrors);
        return;
      }

      const result = await authService.login(formData.loginId, formData.password);
      if (result.success) {
        const userData = result.data?.user;
        setUser(userData);
        router.replace('/(tabs)/home');
      } else {
        setErrors({ ...nextErrors, general: result.message || '정보를 확인해주세요.' });
      }
    } else {
      if (!formData.loginId) {
        nextErrors.loginId = '아이디를 입력해주세요.';
        loginIdRef.current?.focus();
        firstFocusHandled = true;
      } else if (!isIdChecked || validatedLoginId !== formData.loginId) {
        nextErrors.loginId = '아이디 중복 확인을 해주세요.';
        if (!firstFocusHandled) {
          loginIdRef.current?.focus();
          firstFocusHandled = true;
        }
      }
      if (!formData.email) {
        nextErrors.email = '이메일을 입력해주세요.';
        if (!firstFocusHandled) {
          emailRef.current?.focus();
          firstFocusHandled = true;
        }
      }
      if (!formData.password) {
        nextErrors.password = '비밀번호를 입력해주세요.';
        if (!firstFocusHandled) {
          passwordRef.current?.focus();
          firstFocusHandled = true;
        }
      }
      if (!formData.nickname) {
        nextErrors.nickname = '이름을 입력해주세요.';
        if (!firstFocusHandled) {
          nicknameRef.current?.focus();
          firstFocusHandled = true;
        }
      }
      if (!formData.birthDate) {
        nextErrors.birthDate = '생년월일을 입력해주세요.';
        if (!firstFocusHandled) {
          birthDateRef.current?.focus();
          firstFocusHandled = true;
        }
      } else {
        const formattedDate = new Date(formData.birthDate);
        if (isNaN(formattedDate.getTime())) {
          nextErrors.birthDate = '생년월일 형식이 잘못되었습니다 (YYYY-MM-DD)';
          if (!firstFocusHandled) {
            birthDateRef.current?.focus();
            firstFocusHandled = true;
          }
        }
      }
      if (nextErrors.loginId || nextErrors.email || nextErrors.password || nextErrors.nickname || nextErrors.birthDate) {
        setErrors(nextErrors);
        return;
      }

      try {
        await authService.register({
          ...formData,
          birthDate: new Date(formData.birthDate),
          isKorean: false,
        });
        setIsLoginView(true);
        setErrors({
          loginId: '',
          password: '',
          email: '',
          nickname: '',
          birthDate: '',
          general: '',
        });
      } catch (error: any) {
        console.error('서버 에러 상세:', error.response?.data);
        const errorMsg = error.response?.data?.message || '처리에 실패했습니다.';
        setErrors({ ...nextErrors, general: errorMsg });
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/main_bg.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImage}
      >
          <SoftWaveBackground />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.mainContainer}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{isLoginView ? 'Hello!' : 'Welcome!'}</Text>
                <Text style={styles.subtitle}>
                  {isLoginView ? '마실에 오신 것을 환영합니다!' : '마실이 처음이신가요?'}
                </Text>
              </View>
              <View style={styles.inputGroup}>
                <View style={styles.sectionWrapper}>
                  {isLoginView ? (
                    <TextInput
                      ref={loginIdRef}
                      style={[
                        styles.input,
                        errors.loginId ? styles.inputError : null,
                        idCheckSuccess && validatedLoginId === formData.loginId ? styles.inputSuccess : null,
                      ]}
                      value={formData.loginId}
                      onChangeText={(value) => handleChange('loginId', value)}
                      placeholder="ID or Email"
                      placeholderTextColor="#8DBA7D"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  ) : (
                    <View style={styles.idRow}>
                      <TextInput
                        ref={loginIdRef}
                        style={[
                          styles.input,
                          styles.idInput,
                          errors.loginId ? styles.inputError : null,
                          idCheckSuccess && validatedLoginId === formData.loginId ? styles.inputSuccess : null,
                        ]}
                        value={formData.loginId}
                        onChangeText={(value) => handleChange('loginId', value)}
                        placeholder="ID"
                        placeholderTextColor="#8DBA7D"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={[
                          styles.idCheckButton,
                          isIdChecked && validatedLoginId === formData.loginId ? styles.disabledButton : null,
                        ]}
                        onPress={handleCheckId}
                        disabled={isIdChecked && validatedLoginId === formData.loginId}
                      >
                        <Text style={styles.idCheckText}>
                          {isIdChecked && validatedLoginId === formData.loginId ? '확인 완료' : '중복 확인'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {errors.loginId ? <Text style={styles.errorText}>{errors.loginId}</Text> : null}
                  {idCheckSuccess && idCheckMessage ? <Text style={styles.successText}>{idCheckMessage}</Text> : null}
                  {isLoginView ? (
                    <>
                      <TextInput
                        ref={passwordRef}
                        style={[styles.input, errors.password ? styles.inputError : null]}
                        value={formData.password}
                        onChangeText={(value) => handleChange('password', value)}
                        placeholder="Password"
                        placeholderTextColor="#8DBA7D"
                        secureTextEntry
                      />
                      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                    </>
                  ) : (
                    <>
                      <TextInput
                        ref={emailRef}
                        style={[styles.input, errors.email ? styles.inputError : null]}
                        value={formData.email}
                        onChangeText={(value) => handleChange('email', value)}
                        placeholder="Email"
                        placeholderTextColor="#8DBA7D"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                      <TextInput
                        ref={passwordRef}
                        style={[styles.input, errors.password ? styles.inputError : null]}
                        value={formData.password}
                        onChangeText={(value) => handleChange('password', value)}
                        placeholder="Password"
                        placeholderTextColor="#8DBA7D"
                        secureTextEntry
                      />
                      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                      <TextInput
                        ref={nicknameRef}
                        style={[styles.input, errors.nickname ? styles.inputError : null]}
                        value={formData.nickname}
                        onChangeText={(value) => handleChange('nickname', value)}
                        placeholder="Name"
                        placeholderTextColor="#8DBA7D"
                      />
                      {errors.nickname ? <Text style={styles.errorText}>{errors.nickname}</Text> : null}
                      <TextInput
                        ref={birthDateRef}
                        style={[styles.input, errors.birthDate ? styles.inputError : null]}
                        value={formData.birthDate}
                        onChangeText={(value) => handleChange('birthDate', value)}
                        placeholder="Birth Date (YYYY-MM-DD)"
                        placeholderTextColor="#8DBA7D"
                      />
                      {errors.birthDate ? <Text style={styles.errorText}>{errors.birthDate}</Text> : null}
                    </>
                  )}
                  {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}
                  <TouchableOpacity style={styles.loginButtonFrame} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>{isLoginView ? 'Login' : 'Sign Up'}</Text>
                  </TouchableOpacity>
                </View>
                {isLoginView ? (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.emailSignupButton} onPress={() => { clearValidationState(); setIsLoginView(false); }}>
                      <Text style={styles.buttonText}>Sign in with Email</Text>
                    </TouchableOpacity>
                    <GoogleLoginButton />
                  </View>
                ) : (
                  <TouchableOpacity style={styles.linkButton} onPress={() => { clearValidationState(); setIsLoginView(true); }}>
                    <Text style={[styles.buttonText, styles.linkText]}> 로그인으로 돌아가기</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
