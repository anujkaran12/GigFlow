export type UserRole = 'admin' | 'sales'
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost'
export type LeadSource = 'Website' | 'Instagram' | 'Referral'
export type SortOrder = 'latest' | 'oldest'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginationMeta
}

export interface Lead {
  id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdAt: string
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
}

export interface FilterParams {
  search: string
  status: LeadStatus | ''
  source: LeadSource | ''
  sort: SortOrder
  page: number
}

export interface LeadsResponse {
  data: Lead[]
  meta: PaginationMeta
}

export interface LeadFormValues {
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
}

export interface ApiErrorResponse {
  success: false
  message: string
  data: null | ValidationErrorDetail[]
}

export interface ValidationErrorDetail {
  field: string
  message: string
}
