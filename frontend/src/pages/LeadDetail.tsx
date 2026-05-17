import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { DeleteConfirmModal } from '../components/DeleteConfirmModal'
import { LeadFormModal } from '../components/LeadFormModal'
import { Spinner } from '../components/Spinner'
import { StateMessage } from '../components/StateMessage'
import { useToast } from '../context/ToastContext'
import { deleteLead, fetchLeadById, updateLead } from '../store/leadsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { LeadFormValues } from '../types'
import { formatDate } from '../utils/formatters'

export function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { showToast } = useToast()
  const { user } = useAppSelector((state) => state.auth)
  const { selectedLead, detailLoading, saving, error } = useAppSelector((state) => state.leads)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (id) void dispatch(fetchLeadById(id))
  }, [dispatch, id])

  const handleEdit = async (values: LeadFormValues) => {
    if (!selectedLead) return

    const result = await dispatch(updateLead({ id: selectedLead.id, values }))
    if (updateLead.fulfilled.match(result)) {
      showToast('Lead updated successfully', 'success')
      setIsEditOpen(false)
      void dispatch(fetchLeadById(selectedLead.id))
    } else {
      showToast(result.payload ?? 'Unable to update lead', 'error')
    }
  }

  const handleDelete = async () => {
    if (!selectedLead) return

    const result = await dispatch(deleteLead(selectedLead.id))
    if (deleteLead.fulfilled.match(result)) {
      showToast('Lead deleted successfully', 'success')
      navigate('/dashboard')
    } else {
      showToast(result.payload ?? 'Unable to delete lead', 'error')
    }
  }

  if (detailLoading) return <Spinner />

  if (error) {
    return (
      <StateMessage
        title="Could not load lead"
        message={error}
        actionLabel="Back to dashboard"
        onAction={() => history.back()}
      />
    )
  }

  if (!selectedLead) {
    return (
      <StateMessage
        title="Lead not found"
        message="This lead may have been deleted or moved."
      />
    )
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-(--color-border) bg-(--color-surface) p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Lead details</p>
          <h1 className="mt-1 text-3xl font-bold text-(--color-text)">
            {selectedLead.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            icon={<Pencil size={16} />}
            onClick={() => setIsEditOpen(true)}
          >
            Edit
          </Button>
          {isAdmin ? (
            <Button
              variant="danger"
              icon={<Trash2 size={16} />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          ) : null}
          <Link to="/dashboard">
            <Button variant="secondary" icon={<ArrowLeft size={16} />}>
              Back
            </Button>
          </Link>
        </div>
      </div>

      <section className="grid gap-4 rounded-lg border border-(--color-border) bg-(--color-surface) p-6 sm:grid-cols-2">
        <DetailItem label="Name" value={selectedLead.name} />
        <DetailItem label="Email" value={selectedLead.email} />
        <DetailItem label="Status" value={selectedLead.status} />
        <DetailItem label="Source" value={selectedLead.source} />
        <DetailItem label="Created At" value={formatDate(selectedLead.createdAt)} />
      </section>

      {isEditOpen ? (
        <LeadFormModal
          key={selectedLead.id}
          lead={selectedLead}
          isSubmitting={saving}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEdit}
        />
      ) : null}

      {isDeleteOpen ? (
        <DeleteConfirmModal
          lead={selectedLead}
          isDeleting={saving}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}

interface DetailItemProps {
  label: string
  value: string
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <p className="text-sm font-medium text-(--color-text-muted)">{label}</p>
      <p className="mt-1 text-base font-semibold text-(--color-text)">{value}</p>
    </div>
  )
}
