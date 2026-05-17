import type { QueryFilter, Types } from 'mongoose'
import {
  DEFAULT_PAGE,
  LEADS_PAGE_LIMIT,
  MIN_PAGE,
  MIN_TOTAL_PAGES,
} from '../constants/pagination'
import { Lead, type LeadDocument } from '../models/Lead'
import type {
  ILead,
  LeadBody,
  LeadData,
  LeadQuery,
  LeadSort,
  PaginationMeta,
  UserData,
  UserRole,
} from '../types'
import { AppError } from '../utils/AppError'

type PopulatedUser = {
  _id: Types.ObjectId
  name: string
  email: string
  role: UserRole
}

interface LeadListResult {
  leads: LeadData[]
  meta: PaginationMeta
}

const populateCreatedBy = {
  path: 'createdBy',
  select: 'name email role',
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildLeadFilter = (query: LeadQuery): QueryFilter<ILead> => {
  const filter: QueryFilter<ILead> = {}

  if (query.status) {
    filter.status = query.status
  }

  if (query.source) {
    filter.source = query.source
  }

  if (query.search?.trim()) {
    const searchRegex = new RegExp(escapeRegex(query.search.trim()), 'i')
    filter.$or = [{ name: searchRegex }, { email: searchRegex }]
  }

  return filter
}

const getSortDirection = (sort?: LeadSort) => (sort === 'oldest' ? 1 : -1)

const isPopulatedUser = (value: unknown): value is PopulatedUser => {
  if (!value || typeof value !== 'object') return false

  const user = value as Partial<PopulatedUser>
  return Boolean(user._id && user.name && user.email && user.role)
}

const userToResponse = (user: PopulatedUser): UserData => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
})

const createdByToResponse = (createdBy: Types.ObjectId | PopulatedUser) => {
  if (isPopulatedUser(createdBy)) {
    return userToResponse(createdBy)
  }

  return createdBy.toString()
}

const leadToResponse = (lead: LeadDocument): LeadData => ({
  id: lead.id,
  name: lead.name,
  email: lead.email,
  status: lead.status,
  source: lead.source,
  createdAt: lead.createdAt,
  createdBy: createdByToResponse(lead.createdBy as Types.ObjectId | PopulatedUser),
})

const toCsvValue = (value: string) => `"${value.replaceAll('"', '""')}"`

export const getLeads = async (query: LeadQuery): Promise<LeadListResult> => {
  try {
    const currentPage = Math.max(Number(query.page) || DEFAULT_PAGE, MIN_PAGE)
    const skip = (currentPage - MIN_PAGE) * LEADS_PAGE_LIMIT
    const filter = buildLeadFilter(query)
    const sortDirection = getSortDirection(query.sort)

    const [leads, totalCount] = await Promise.all([
      Lead.find(filter)
        .select('-__v')
        .populate(populateCreatedBy)
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(LEADS_PAGE_LIMIT),
      Lead.countDocuments(filter),
    ])

    return {
      leads: leads.map(leadToResponse),
      meta: {
        currentPage,
        totalPages: Math.max(Math.ceil(totalCount / LEADS_PAGE_LIMIT), MIN_TOTAL_PAGES),
        totalCount,
        limit: LEADS_PAGE_LIMIT,
      },
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError('Failed to get leads', 500)
  }
}

export const getLeadById = async (leadId: string): Promise<LeadData> => {
  try {
    const lead = await Lead.findById(leadId).select('-__v').populate(populateCreatedBy)

    if (!lead) {
      throw new AppError('Lead not found', 404)
    }

    return leadToResponse(lead)
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError('Failed to get lead', 500)
  }
}

export const createLead = async (
  body: LeadBody,
  createdBy: string,
): Promise<LeadData> => {
  try {
    const lead = await Lead.create({
      name: body.name,
      email: body.email,
      status: body.status ?? 'New',
      source: body.source,
      createdBy,
    })

    await lead.populate(populateCreatedBy)

    return leadToResponse(lead)
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError('Failed to create lead', 500)
  }
}

export const updateLead = async (leadId: string, body: LeadBody): Promise<LeadData> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      leadId,
      {
        name: body.name,
        email: body.email,
        status: body.status ?? 'New',
        source: body.source,
      },
      { new: true, runValidators: true },
    )
      .select('-__v')
      .populate(populateCreatedBy)

    if (!lead) {
      throw new AppError('Lead not found', 404)
    }

    return leadToResponse(lead)
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError('Failed to update lead', 500)
  }
}

export const deleteLead = async (leadId: string) => {
  try {
    const lead = await Lead.findByIdAndDelete(leadId)

    if (!lead) {
      throw new AppError('Lead not found', 404)
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError('Failed to delete lead', 500)
  }
}

export const getLeadsCsv = async (query: LeadQuery) => {
  try {
    const filter = buildLeadFilter(query)
    const sortDirection = getSortDirection(query.sort)
    const leads = await Lead.find(filter).select('-__v').sort({ createdAt: sortDirection })
    const rows = leads.map((lead) =>
      [
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        lead.createdAt.toISOString(),
      ]
        .map(toCsvValue)
        .join(','),
    )

    return ['Name,Email,Status,Source,Created At', ...rows].join('\n')
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError('Failed to export leads CSV', 500)
  }
}
