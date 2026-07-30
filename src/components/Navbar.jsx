import { Link, useNavigate, useLocation } from "react-router-dom";
import { Code2, History, LogOut, Zap, GitPullRequest } from "lucide-react";
import useAuthStore from "../store/authStore.js";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-surface">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/review" className="flex items-center gap-2">
          <Zap size={15} className="text-soft" />
          <span className="font-semibold text-text text-sm">
            CodeLens <span className="font-normal text-dim">AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {[
            { to: "/review", icon: Code2, label: "Review" },
           //{ to: "/pr", icon: GitPullRequest, label: "PR Review" },
            { to: "/history", icon: History, label: "History" },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
                isActive(to)
                  ? "text-text bg-panel font-medium"
                  : "text-dim hover:text-soft hover:bg-panel"
              }`}
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="text-xs text-dim font-mono bg-panel border border-line px-2.5 py-1 rounded-md">
            {user?.username}
          </span>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="p-1.5 rounded-md text-muted hover:text-soft hover:bg-panel transition-colors"
          >
            Log-out 
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
