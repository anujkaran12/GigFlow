import { LogOut, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { logoutUser } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Button } from "./Button";

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useTheme();
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
<div className="bg-(--color-bg) text-(--color-text)">
  <header className="border-b border-(--color-border) bg-(--color-surface)">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      
      {/* Left - Brand */}
      <div>
        <Link
          to="/dashboard"
          className="text-xl font-bold text-cyan-700 dark:text-cyan-300"
        >
          GigFlow CRM
        </Link>
        {user?.name && (
          <p className="text-xs text-(--color-text-muted)">
            {user.name} | {user.role === "admin" ? "Admin" : "Sales User"}
          </p>
        )}
      </div>

      {/* Right - Actions */}
      <nav className="flex items-center gap-2">
        <Button
          variant="secondary"
          icon={theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          onClick={toggleTheme}
        >
          <span className="hidden sm:inline">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </Button>
        {user?.id && (
          <Button
            variant="ghost"
            icon={<LogOut size={16} />}
            onClick={() => void handleLogout()}
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}
      </nav>

    </div>
  </header>
</div>
  );
}
