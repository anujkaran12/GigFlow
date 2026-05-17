import type { ReactNode, SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  children: ReactNode
}

export function Select({ label, error, id, children, className = '', ...props }: SelectProps) {
  const selectId = id ?? props.name

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-(--color-text-soft)">
        {label}
      </span>
      <select
        id={selectId}
        className={`w-full rounded-md border border-(--color-field-border) bg-(--color-field) px-3 py-2 text-(--color-text) outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-950 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-sm text-rose-600">{error}</span> : null}
    </label>
  )
}
