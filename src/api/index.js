import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cl_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cl_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const reviewAPI = {
  create: (data) => api.post("/review", data),
  get: (id) => api.get(`/review/${id}`),
  delete: (id) => api.delete(`/review/${id}`),
};

export const historyAPI = {
  list: (params) => api.get("/history", { params }),
  stats: () => api.get("/history/stats"),
};

export const githubAPI = {
  status: () => api.get("/github/status"),
  authUrl: () => api.get("/github/auth-url"),
  disconnect: () => api.delete("/github/disconnect"),
};

export const prAPI = {
  repos: () => api.get("/pr/repos"),
  pulls: (owner, repo) => api.get(`/pr/repos/${owner}/${repo}/pulls`),
  review: (data) => api.post("/pr/review", data),
  postComments: (reviewId) => api.post("/pr/post-comments", { reviewId }),
};

export default api;
