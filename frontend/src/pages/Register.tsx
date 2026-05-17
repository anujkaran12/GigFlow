import { UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useToast } from '../context/ToastContext'
import { registerUser } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

interface RegisterErrors {
  name?: string
  email?: string
  password?: string
}

const validate = (name: string, email: string, password: string): RegisterErrors => {
  const errors: RegisterErrors = {}
  if (!name.trim()) errors.name = 'Name is required'
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Valid email is required'
  if (password.length < 6) errors.password = 'Password must be at least 6 characters'
  return errors
}

export function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<RegisterErrors>({})

  useEffect(() => {
    if (error) showToast(error, 'error')
  }, [error, showToast])

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(name, email, password)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const result = await dispatch(registerUser({ name, email, password }))
    if (registerUser.fulfilled.match(result)) {
      showToast('Registration successful. Please login.', 'success')
      navigate('/login')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-bg) px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-(--color-border) bg-(--color-surface) p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-(--color-text)">Register</h1>
        <p className="mt-1 text-sm text-(--color-text-muted)">
          Create an account for your leads workspace.
        </p>
        <div className="mt-6 grid gap-4">
          <Input
            label="Name"
            name="name"
            value={name}
            error={errors.name}
            onChange={(event) => setName(event.target.value)}
          />
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
          <Button type="submit" icon={<UserPlus size={16} />} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </div>
        <p className="mt-5 text-center text-sm text-(--color-text-soft)">
          Already registered?{' '}
          <Link className="font-semibold text-cyan-700 dark:text-cyan-300" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}
