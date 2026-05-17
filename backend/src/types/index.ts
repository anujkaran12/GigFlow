import type { Request } from 'express'
import type { Types } from 'mongoose'

export type UserRole = 'admin' | 'sales'
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost'
export type LeadSource = 'Website' | 'Instagram' | 'Referral'
export type LeadSort = 'latest' | 'oldest'

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
}

export interface ILead {
  id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdAt: Date
  createdBy: Types.ObjectId
}

export interface AuthUserPayload {
  id: string
  role: UserRole
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  meta?: PaginationMeta
}

export interface UserData {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthData {
  user: UserData
}

export interface LeadData {
  id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdAt: Date
  createdBy: UserData | string
}

export interface RegisterBody {
  name: string
  email: string
  password: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface LeadBody {
  name: string
  email: string
  status?: LeadStatus
  source: LeadSource
}

export interface LeadQuery {
  status?: LeadStatus
  source?: LeadSource
  search?: string
  sort?: LeadSort
  page?: string
}

export interface ValidationErrorDetail {
  field: string
  message: string
}
