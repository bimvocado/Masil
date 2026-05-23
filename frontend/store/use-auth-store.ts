import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  // 액션들
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  
  // 유저 정보를 창고에 저장하는 함수
  setUser: (user) => set({ 
    user, 
    isLoggedIn: !!user 
  }),

  // 창고를 비우는 함수 (로그아웃)
  logout: () => set({ 
    user: null, 
    isLoggedIn: false 
  }),
}));