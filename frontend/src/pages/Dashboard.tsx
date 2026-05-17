import { Download, Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { DeleteConfirmModal } from '../components/DeleteConfirmModal'
import { LeadFormModal } from '../components/LeadFormModal'
import { LeadsFilters } from '../components/LeadsFilters'
import { LeadsTable } from '../components/LeadsTable'
import { Pagination } from '../components/Pagination'
import { Spinner } from '../components/Spinner'
import { StateMessage } from '../components/StateMessage'
import { useToast } from '../context/ToastContext'
import { exportCsv } from '../services/lead.service'
import {
  createLead,
  deleteLead,
  fetchLeads,
  setFilters,
  updateLead,
} from '../store/leadsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { FilterParams, Lead, LeadFormValues } from '../types'
import { downloadCsvBlob } from '../utils/csv'

const getExportErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  return 'Unable to export CSV'
}

export function Dashboard() {
  const dispatch = useAppDispatch()
  const { showToast } = useToast()
  const { user } = useAppSelector((state) => state.auth)
  const { leads, pagination, filters, loading, saving, error } = useAppSelector(
    (state) => state.leads,
  )
  const [activeLead, setActiveLead] = useState<Lead | undefined>()
  const [leadToDelete, setLeadToDelete] = useState<Lead | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    void dispatch(fetchLeads(filters))
  }, [dispatch, filters])

  const handleFilterChange = useCallback(
    (nextFilters: Partial<FilterParams>) => {
      dispatch(setFilters(nextFilters))
    },
    [dispatch],
  )

  const openCreateModal = () => {
    setActiveLead(undefined)
    setIsModalOpen(true)
  }

  const openEditModal = (lead: Lead) => {
    setActiveLead(lead)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setActiveLead(undefined)
  }

  const handleSubmit = async (values: LeadFormValues) => {
    const result = activeLead
      ? await dispatch(updateLead({ id: activeLead.id, values }))
      : await dispatch(createLead(values))

    if (createLead.fulfilled.match(result) || updateLead.fulfilled.match(result)) {
      showToast(activeLead ? 'Lead updated successfully' : 'Lead created successfully', 'success')
      closeModal()
      void dispatch(fetchLeads(filters))
      return
    }

    showToast(result.payload ?? 'Unable to save lead', 'error')
  }

  const handleDelete = async () => {
    if (!leadToDelete) return
    const result = await dispatch(deleteLead(leadToDelete.id))
    if (deleteLead.fulfilled.match(result)) {
      showToast('Lead deleted successfully', 'success')
      setLeadToDelete(undefined)
      void dispatch(fetchLeads(filters))
    } else {
      showToast(result.payload ?? 'Unable to delete lead', 'error')
    }
  }

  const handleExportCsv = async () => {
    try {
      const blob = await exportCsv(filters)
      downloadCsvBlob(blob)
      showToast('CSV exported successfully', 'success')
    } catch (exportError) {
      showToast(getExportErrorMessage(exportError), 'error')
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 rounded-lg border border-(--color-border) bg-(--color-surface) p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-(--color-text)">Leads</h1>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            Search, filter, sort, and manage your lead pipeline.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin ? (
            <Button icon={<Plus size={16} />} onClick={openCreateModal}>
              Create Lead
            </Button>
          ) : null}
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={() => void handleExportCsv()}
          >
            Export CSV
          </Button>
        </div>
      </div>

      <LeadsFilters filters={filters} onChange={handleFilterChange} />

      {loading ? <Spinner /> : null}
      {!loading && error ? (
        <StateMessage
          title="Could not load leads"
          message={error}
          actionLabel="Try again"
          onAction={() => void dispatch(fetchLeads(filters))}
        />
      ) : null}
      {!loading && !error && leads.length === 0 ? (
        <StateMessage
          title="No leads found"
          message="Try changing your search or filters, or create a new lead."
          actionLabel={isAdmin ? 'Create Lead' : undefined}
          onAction={isAdmin ? openCreateModal : undefined}
        />
      ) : null}
      {!loading && !error && leads.length > 0 ? (
        <>
          <LeadsTable
            leads={leads}
            canDelete={isAdmin}
            onEdit={openEditModal}
            onDelete={setLeadToDelete}
          />
          <Pagination
            meta={pagination}
            onPageChange={(page) => handleFilterChange({ page })}
          />
        </>
      ) : null}

      {isModalOpen ? (
        <LeadFormModal
          key={activeLead?.id ?? 'create'}
          lead={activeLead}
          isSubmitting={saving}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      ) : null}

      {leadToDelete ? (
        <DeleteConfirmModal
          lead={leadToDelete}
          isDeleting={saving}
          onCancel={() => setLeadToDelete(undefined)}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  )
}
