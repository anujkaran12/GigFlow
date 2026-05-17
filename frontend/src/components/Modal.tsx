import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-(--color-surface) p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-(--color-text)">{title}</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label="Close modal"
            title="Close modal"
            className="px-3"
          >
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
