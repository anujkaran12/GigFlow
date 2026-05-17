import type { ReactNode } from 'react'
import { Button } from './Button'

interface StateMessageProps {
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export function StateMessage({
  title,
  message,
  actionLabel,
  onAction,
  children,
}: StateMessageProps) {
  return (
    <div className="rounded-lg border border-dashed border-(--color-field-border) bg-(--color-surface) p-8 text-center">
      <h3 className="text-lg font-semibold text-(--color-text)">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-(--color-text-muted)">
        {message}
      </p>
      {children}
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
