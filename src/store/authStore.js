import { create } from "zustand";
import { authAPI } from "../api/index.js";

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("cl_token") || null,
  loading: false,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await authAPI.login({ email, password });
      const { token, user } = res.data;
      localStorage.setItem("cl_token", token);
      set({ token, user, loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  },

  register: async (username, email, password) => {
    set({ loading: true });
    try {
      const res = await authAPI.register({ username, email, password });
      const { token, user } = res.data;
      localStorage.setItem("cl_token", token);
      set({ token, user, loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || "Registration failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("cl_token");
    set({ user: null, token: null });
  },

  initialize: async () => {
    const token = localStorage.getItem("cl_token");
    if (!token) {
      set({ initialized: true });
      return;
    }
    try {
      const res = await authAPI.me();
      set({ user: res.data.user, initialized: true });
    } catch {
      localStorage.removeItem("cl_token");
      set({ token: null, initialized: true });
    }
  },
}));

export default useAuthStore;
