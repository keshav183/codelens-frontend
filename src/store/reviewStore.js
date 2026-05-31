import { create } from "zustand";
import { reviewAPI, historyAPI } from "../api/index.js";

const useReviewStore = create((set, get) => ({
  currentReview: null,
  history: [],
  stats: null,
  loading: false,
  historyLoading: false,
  pagination: null,

  createReview: async (code, language, title) => {
    set({ loading: true, currentReview: null });
    try {
      const res = await reviewAPI.create({ code, language, title });
      set({ currentReview: res.data.review, loading: false });
      return { success: true, review: res.data.review };
    } catch (err) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || "Review failed" };
    }
  },

  fetchReview: async (id) => {
    set({ loading: true });
    try {
      const res = await reviewAPI.get(id);
      set({ currentReview: res.data.review, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  deleteReview: async (id) => {
    try {
      await reviewAPI.delete(id);
      set((state) => ({ history: state.history.filter((r) => r._id !== id) }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Delete failed" };
    }
  },

  fetchHistory: async (page = 1) => {
    set({ historyLoading: true });
    try {
      const res = await historyAPI.list({ page, limit: 10 });
      set({ history: res.data.reviews, pagination: res.data.pagination, historyLoading: false });
    } catch {
      set({ historyLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await historyAPI.stats();
      set({ stats: res.data.stats });
    } catch {}
  },

  clearReview: () => set({ currentReview: null }),
}));

export default useReviewStore;
