import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/use-auth-store';
import { useState } from 'react';

export const useLogout = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  
  // 💡 1. 모달의 노출 상태를 관리합니다.
  const [modalVisible, setModalVisible] = useState(false); 

  // 💡 2. 모달의 '확인' 버튼을 눌렀을 때 실행될 진짜 로그아웃 로직
  const confirmLogout = async () => {
    try {
      setModalVisible(false); // 일단 모달 닫기
      await logout(); 
      router.replace('/');    // 메인으로 이동
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  // 💡 3. 외부(컴포넌트)에서 호출할 함수들
  const handleLogoutPress = () => setModalVisible(true);  // 모달 켜기
  const closeLogoutModal = () => setModalVisible(false); // 모달 끄기

  return { 
    modalVisible,      // 모달 visible 속성에 전달
    handleLogoutPress, // 버튼 onPress에 전달
    closeLogoutModal,  // 모달 onCancel에 전달
    confirmLogout      // 모달 onConfirm에 전달
  };
};