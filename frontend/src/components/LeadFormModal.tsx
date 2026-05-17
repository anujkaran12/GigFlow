import { Save, X } from 'lucide-react'
import { useState } from 'react'
import type { Lead, LeadFormValues, LeadSource, LeadStatus } from '../types'
import { Button } from './Button'
import { Input } from './Input'
import { Modal } from './Modal'
import { Select } from './Select'

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost']
const sources: LeadSource[] = ['Website', 'Instagram', 'Referral']

interface LeadFormModalProps {
  lead?: Lead
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (values: LeadFormValues) => Promise<void>
}

interface LeadFormErrors {
  name?: string
  email?: string
}

const defaultValues: LeadFormValues = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
}

const validateLead = (values: LeadFormValues): LeadFormErrors => {
  const errors: LeadFormErrors = {}

  if (!values.name.trim()) errors.name = 'Name is required'
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Valid email is required'

  return errors
}

export function LeadFormModal({
  lead,
  isSubmitting,
  onClose,
  onSubmit,
}: LeadFormModalProps) {
  const [values, setValues] = useState<LeadFormValues>(() =>
    lead
      ? {
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source,
        }
      : defaultValues,
  )
  const [errors, setErrors] = useState<LeadFormErrors>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateLead(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return
    await onSubmit(values)
  }

  return (
    <Modal title={lead ? 'Edit lead' : 'Create lead'} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            name="name"
            value={values.name}
            error={errors.name}
            onChange={(event) => setValues({ ...values, name: event.target.value })}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            error={errors.email}
            onChange={(event) => setValues({ ...values, email: event.target.value })}
          />
          <Select
            label="Status"
            name="status"
            value={values.status}
            onChange={(event) =>
              setValues({ ...values, status: event.target.value as LeadStatus })
            }
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <Select
            label="Source"
            name="source"
            value={values.source}
            onChange={(event) =>
              setValues({ ...values, source: event.target.value as LeadSource })
            }
          >
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" icon={<X size={16} />} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" icon={<Save size={16} />} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save lead'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
