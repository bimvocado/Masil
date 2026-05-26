import { create } from 'zustand';
import { User } from '@/types/user';
import { removeToken } from '@/utils/storage';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  logout: async () => {
    await removeToken(); 
    set({ user: null, isLoggedIn: false }); 
  },
}));