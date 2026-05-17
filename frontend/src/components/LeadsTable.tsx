import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Lead } from '../types'
import { formatDate } from '../utils/formatters'
import { Button } from './Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from './Table'

interface LeadsTableProps {
  leads: Lead[]
  canDelete: boolean
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

const statusStyles: Record<Lead['status'], string> = {
  New: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
  Qualified: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  Lost: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200',
}

export function LeadsTable({ leads, canDelete, onEdit, onDelete }: LeadsTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {['Name', 'Email', 'Status', 'Source', 'Created At', 'Actions'].map((heading) => (
            <TableHeaderCell key={heading}>{heading}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-semibold text-(--color-text)">
              {lead.name}
            </TableCell>
            <TableCell>{lead.email}</TableCell>
            <TableCell>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[lead.status]}`}
              >
                {lead.status}
              </span>
            </TableCell>
            <TableCell>{lead.source}</TableCell>
            <TableCell>{formatDate(lead.createdAt)}</TableCell>
            <TableCell className="py-3">
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/leads/${lead.id}`}
                  className="inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-950"
                >
                  <Eye size={16} className="mr-2" />
                  View
                </Link>
                <Button
                  variant="secondary"
                  icon={<Pencil size={16} />}
                  onClick={() => onEdit(lead)}
                >
                  Edit
                </Button>
                {canDelete ? (
                  <Button
                    variant="danger"
                    icon={<Trash2 size={16} />}
                    onClick={() => onDelete(lead)}
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
