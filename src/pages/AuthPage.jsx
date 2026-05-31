import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore.js";

const AuthPage = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const { login, register, loading } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const isLogin = mode === "login";
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isLogin
      ? await login(form.email, form.password)
      : await register(form.username, form.email, form.password);
    if (result.success) { toast.success(isLogin ? "Welcome back!" : "Account created!"); navigate("/review"); }
    else toast.error(result.message);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text mb-1">CodeLens AI</h1>
          <p className="text-sm text-muted">AI-powered code review tool</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-line rounded-xl p-7">
          <h2 className="text-base font-semibold text-text mb-1">
            {isLogin ? "Sign in to your account" : "Create an account"}
          </h2>
          <p className="text-xs text-muted mb-5">
            {isLogin ? "Enter your credentials below" : "Fill in your details to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-soft mb-1.5">Username</label>
                <input type="text" required value={form.username} onChange={set("username")}
                  placeholder="keshav183"
                  className="w-full bg-panel border border-line text-text text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-subtle transition-colors placeholder:text-muted" />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-soft mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={set("email")}
                placeholder="you@example.com"
                className="w-full bg-panel border border-line text-text text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-subtle transition-colors placeholder:text-muted" />
            </div>
            <div>
              <label className="block text-xs font-medium text-soft mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={form.password} onChange={set("password")}
                  placeholder="••••••••"
                  className="w-full bg-panel border border-line text-text text-sm px-3 py-2.5 pr-10 rounded-lg focus:outline-none focus:border-subtle transition-colors placeholder:text-muted font-mono" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-soft transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-text hover:bg-soft text-surface font-medium text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50 mt-1">
              {loading
                ? <><span className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />{isLogin ? "Signing in..." : "Creating..."}</>
                : <>{isLogin ? "Sign in" : "Create account"}<ArrowRight size={14} /></>}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/register" : "/login"}
            className="text-soft hover:text-text font-medium underline underline-offset-2 transition-colors">
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};
export default AuthPage;
