import { create } from 'zustand';
import { User } from '@/types/user';
import { getToken, removeToken } from '@/utils/storage';
import { authService } from '@/api/auth-service';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  initialize: async () => {
    const token = await getToken();
    if (token) {
      try {
        const res = await authService.getProfile(); 
        if (res.success) {
          set({ user: res.data, isLoggedIn: true });
        }
      } catch (e) {
        await removeToken();
        set({ user: null, isLoggedIn: false });
      }
    }
  }, 
  logout: async () => {
    try {
      await authService.logout(); 
      set({ user: null, isLoggedIn: false }); 
      console.log("로그아웃 완료: 토큰 및 상태 초기화됨");
    } catch (error) {
      console.error("로그아웃 중 에러:", error);
    }
  },
}));