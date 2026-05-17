import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import type { FilterParams, LeadSource, LeadStatus, SortOrder } from '../types'
import { Input } from './Input'
import { Select } from './Select'

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost']
const sources: LeadSource[] = ['Website', 'Instagram', 'Referral']

interface LeadsFiltersProps {
  filters: FilterParams
  onChange: (filters: Partial<FilterParams>) => void
}

export function LeadsFilters({ filters, onChange }: LeadsFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search)
  const debouncedSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    onChange({ search: debouncedSearch, page: 1 })
  }, [debouncedSearch, onChange])

  return (
    <section className="grid gap-4 rounded-lg border border-(--color-border) bg-(--color-surface) p-5 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Search"
        name="search"
        placeholder="Name or email"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
      />
      <Select
        label="Status"
        name="status"
        value={filters.status}
        onChange={(event) =>
          onChange({ status: event.target.value as LeadStatus | '', page: 1 })
        }
      >
        <option value="">All statuses</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Select>
      <Select
        label="Source"
        name="source"
        value={filters.source}
        onChange={(event) =>
          onChange({ source: event.target.value as LeadSource | '', page: 1 })
        }
      >
        <option value="">All sources</option>
        {sources.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </Select>
      <Select
        label="Sort"
        name="sort"
        value={filters.sort}
        onChange={(event) => onChange({ sort: event.target.value as SortOrder, page: 1 })}
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </Select>
    </section>
  )
}
