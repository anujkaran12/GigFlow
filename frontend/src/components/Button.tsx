import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  icon?: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-cyan-300',
  secondary:
    'border border-(--color-field-border) bg-(--color-surface) text-(--color-text) hover:bg-(--color-surface-muted)',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300',
  ghost: 'text-(--color-text-soft) hover:bg-(--color-surface-muted)',
}

export function Button({
  children,
  className = '',
  icon,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon ? <span className="mr-2 inline-flex shrink-0">{icon}</span> : null}
      {children}
    </button>
  )
}
