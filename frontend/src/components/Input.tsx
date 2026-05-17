import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = props.type === 'password'
  const inputType = isPassword && showPassword ? 'text' : props.type

  return (
    <div className="block">
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-medium text-(--color-text-soft)"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={`w-full rounded-md border border-(--color-field-border) bg-(--color-field) px-3 py-2 text-(--color-text) outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-950 ${isPassword ? 'pr-11' : ''} ${className}`}
          {...props}
          type={inputType}
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-md text-(--color-text-muted) transition hover:text-(--color-text) focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-950"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </div>
      {error ? <span className="mt-1 block text-sm text-rose-600">{error}</span> : null}
    </div>
  )
}
