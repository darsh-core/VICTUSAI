import { create } from "zustand"
import { AppUser } from "../types/auth"

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  user: AppUser | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: AppUser) => void;
  updateUser: (user: AppUser) => void;
  clearAuth: () => void;
}

const getStoredAuth = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const token = localStorage.getItem("token");
      const refresh = localStorage.getItem("refresh_token");
      const userStr = localStorage.getItem("user");
      
      if (token && userStr && userStr !== "undefined" && userStr !== "null") {
        const parsedUser = JSON.parse(userStr);
        if (parsedUser && typeof parsedUser === "object" && parsedUser.id && parsedUser.email) {
          return {
            accessToken: token,
            refreshToken: refresh,
            user: parsedUser,
            isAuthenticated: true
          };
        }
      }
      // If corrupted or empty user object stored, clean it up
      if (token || userStr) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    }
  } catch (e) {
    console.warn("Error reading initial auth storage, resetting:", e);
  }
  
  return {
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false
  };
};

const initialAuth = getStoredAuth();

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialAuth,
  setAuth: (accessToken, refreshToken, user) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (e) {
      console.warn("Could not save auth state to localStorage:", e);
    }
    set({ accessToken, refreshToken, user, isAuthenticated: true });
  },
  updateUser: (user) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (e) {
      console.warn("Could not update user state in localStorage:", e);
    }
    set({ user });
  },
  clearAuth: () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    } catch (e) {
      console.warn("Could not clear auth state from localStorage:", e);
    }
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
  }
}));
