import { LogOut, Moon, Sun } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { logoutUser } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { Button } from './Button'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text)">
      <header className="border-b border-(--color-border) bg-(--color-surface)">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <Link to="/dashboard" className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
              GigFlow CRM
            </Link>
            <p className="text-sm text-(--color-text-muted)">
              {user?.name} | {user?.role === 'admin' ? 'Admin' : 'Sales User'}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-700 dark:bg-(--color-surface-muted) dark:text-cyan-200'
                    : 'text-(--color-text-soft) hover:bg-(--color-surface-muted)'
                }`
              }
            >
              Dashboard
            </NavLink>
            <Button
              variant="secondary"
              icon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <Button
              variant="ghost"
              icon={<LogOut size={16} />}
              onClick={() => void handleLogout()}
            >
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
