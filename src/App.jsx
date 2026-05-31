import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import ReviewDetailPage from "./pages/ReviewDetailPage.jsx";
import PRReviewPage from "./pages/PRReviewPage.jsx";

const App = () => {
  const { initialize, token, initialized } = useAuthStore();
  useEffect(() => { initialize(); }, []);

  if (!initialized) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-g800 border-t-g500 rounded-full animate-spin" />
    </div>
  );

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: "#141414", color: "#e8e8e8", border: "1px solid #1c1c1c", fontFamily: "'Inter',sans-serif", fontSize: "12px" },
        success: { iconTheme: { primary: "#22c55e", secondary: "#0f0f0f" } },
        error: { iconTheme: { primary: "#f87171", secondary: "#0f0f0f" } },
      }} />
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/review" /> : <AuthPage mode="login" />} />
        <Route path="/register" element={token ? <Navigate to="/review" /> : <AuthPage mode="register" />} />
        <Route path="/review" element={<ProtectedRoute><Navbar /><ReviewPage /></ProtectedRoute>} />
        <Route path="/review/:id" element={<ProtectedRoute><Navbar /><ReviewDetailPage /></ProtectedRoute>} />
        <Route path="/pr" element={<ProtectedRoute><Navbar /><PRReviewPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Navbar /><HistoryPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={token ? "/review" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
