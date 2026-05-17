import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useToast } from '../context/ToastContext'
import { loginUser } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

interface LoginErrors {
  email?: string
  password?: string
}

interface LocationState {
  from?: {
    pathname?: string
  }
}

const validate = (email: string, password: string): LoginErrors => {
  const errors: LoginErrors = {}
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Valid email is required'
  if (password.length < 6) errors.password = 'Password must be at least 6 characters'
  return errors
}

export function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/dashboard'

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(email, password)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const result = await dispatch(loginUser({ email, password }))
    if (loginUser.fulfilled.match(result)) {
      showToast('Logged in successfully', 'success')
      navigate(from, { replace: true })
      return
    }

    if (loginUser.rejected.match(result)) {
      showToast(result.payload ?? 'Login failed', 'error')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-bg) px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-(--color-border) bg-(--color-surface) p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-(--color-text)">Login</h1>
        <p className="mt-1 text-sm text-(--color-text-muted)">
          Access your GigFlow dashboard.
        </p>
        <div className="mt-6 grid gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            error={errors.email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" icon={<LogIn size={16} />} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
        <p className="mt-5 text-center text-sm text-(--color-text-soft)">
          Need an account?{' '}
          <Link className="font-semibold text-cyan-700 dark:text-cyan-300" to="/register">
            Register
          </Link>
        </p>
      </form>
    </main>
  )
}
