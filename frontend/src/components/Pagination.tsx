import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationMeta } from '../types'
import { Button } from './Button'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-(--color-border) px-1 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-(--color-text-muted)">
        Page {meta.currentPage} of {meta.totalPages} | {meta.totalCount} leads
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          icon={<ChevronLeft size={16} />}
          disabled={meta.currentPage <= 1}
          onClick={() => onPageChange(meta.currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          icon={<ChevronRight size={16} />}
          disabled={meta.currentPage >= meta.totalPages}
          onClick={() => onPageChange(meta.currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
