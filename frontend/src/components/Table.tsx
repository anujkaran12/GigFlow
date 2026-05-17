import type { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  className?: string
}

interface TableSectionProps {
  children: ReactNode
  className?: string
}

interface TableCellProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface)">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-(--color-border) ${className}`}>
          {children}
        </table>
      </div>
    </div>
  )
}

export function TableHead({ children, className = '' }: TableSectionProps) {
  return <thead className={`bg-(--color-surface-muted) ${className}`}>{children}</thead>
}

export function TableBody({ children, className = '' }: TableSectionProps) {
  return <tbody className={`divide-y divide-(--color-border) ${className}`}>{children}</tbody>
}

export function TableRow({ children, className = '' }: TableSectionProps) {
  return <tr className={`align-top ${className}`}>{children}</tr>
}

export function TableHeaderCell({ children, className = '' }: TableCellProps) {
  return (
    <th
      className={`px-5 py-3 text-left text-xs font-semibold uppercase text-(--color-text-muted) ${className}`}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return <td className={`px-5 py-4 text-sm text-(--color-text-soft) ${className}`}>{children}</td>
}
