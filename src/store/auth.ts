import { User } from "@/types";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isAgent: () => boolean;
  isClient: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null }),
  isAdmin: () => get().user?.role === "admin",
  isAgent: () => get().user?.role === "agent",
  isClient: () => get().user?.role === "client",
}));
