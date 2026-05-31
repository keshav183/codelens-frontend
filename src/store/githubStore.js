import { create } from "zustand";
import api from "../api/index.js";

const useGithubStore = create((set, get) => ({
  connected: false,
  username: null,
  avatar: null,
  repos: [],
  prs: [],
  statusLoading: false,
  reposLoading: false,
  prsLoading: false,
  reviewing: false,
  prReview: null,
  postingToGithub: false,

  fetchStatus: async () => {
    set({ statusLoading: true });
    try {
      const res = await api.get("/github/status");
      set({
        connected: res.data.connected,
        username: res.data.username,
        avatar: res.data.avatar,
        statusLoading: false,
      });
    } catch {
      set({ statusLoading: false });
    }
  },

  getAuthUrl: async () => {
    const res = await api.get("/github/auth-url");
    return res.data.url;
  },

  disconnect: async () => {
    await api.delete("/github/disconnect");
    set({ connected: false, username: null, avatar: null, repos: [], prs: [] });
  },

  fetchRepos: async () => {
    set({ reposLoading: true, repos: [] });
    try {
      const res = await api.get("/pr/repos");
      set({ repos: res.data.repos, reposLoading: false });
      return { success: true };
    } catch (err) {
      set({ reposLoading: false });
      return { success: false, message: err.response?.data?.message || "Failed to fetch repos" };
    }
  },

  fetchPRs: async (owner, repo) => {
    set({ prsLoading: true, prs: [] });
    try {
      const res = await api.get(`/pr/repos/${owner}/${repo}/pulls`);
      set({ prs: res.data.prs, prsLoading: false });
      return { success: true };
    } catch (err) {
      set({ prsLoading: false });
      return { success: false, message: err.response?.data?.message || "Failed to fetch PRs" };
    }
  },

  reviewPR: async (owner, repo, prNumber) => {
    set({ reviewing: true, prReview: null });
    try {
      const res = await api.post("/pr/review", { owner, repo, prNumber });
      set({ prReview: res.data.review, reviewing: false });
      return { success: true, review: res.data.review };
    } catch (err) {
      set({ reviewing: false });
      return { success: false, message: err.response?.data?.message || "PR review failed" };
    }
  },

  postToGithub: async (reviewId) => {
    set({ postingToGithub: true });
    try {
      const res = await api.post("/pr/post-comments", { reviewId });
      // Mark current review as posted
      set((state) => ({
        prReview: state.prReview ? { ...state.prReview, github: { ...state.prReview.github, postedToGithub: true } } : null,
        postingToGithub: false,
      }));
      return { success: true, message: res.data.message };
    } catch (err) {
      set({ postingToGithub: false });
      return { success: false, message: err.response?.data?.message || "Failed to post to GitHub" };
    }
  },

  clearPRReview: () => set({ prReview: null, prs: [] }),
}));

export default useGithubStore;
