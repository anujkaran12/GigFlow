import { Trash2, X } from 'lucide-react'
import type { Lead } from '../types'
import { Button } from './Button'
import { Modal } from './Modal'

interface DeleteConfirmModalProps {
  lead: Lead
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => Promise<void>
}

export function DeleteConfirmModal({
  lead,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal title="Delete lead" onClose={onCancel}>
      <div className="grid gap-5">
        <p className="text-sm text-(--color-text-soft)">
          Are you sure you want to delete <span className="font-semibold">{lead.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            icon={<X size={16} />}
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            icon={<Trash2 size={16} />}
            onClick={() => void onConfirm()}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete lead'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
