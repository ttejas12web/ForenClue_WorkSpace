import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  loading: true,
  
  setUser: (user) => set({ user }),

  login: (token, user) => {
    localStorage.setItem('auth_token', token);
    set({ user, token, loading: false });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, loading: false });
  },

  initialize: async () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      set({ user: null, token: null, loading: false });
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        set({ user: data.user || data, token, loading: false });
      } else {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, loading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, loading: false });
    }
  }
}));
