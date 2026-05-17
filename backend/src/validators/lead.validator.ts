import type { RequestHandler } from 'express'
import type { LeadSource, LeadStatus, ValidationErrorDetail } from '../types'
import { AppError } from '../utils/AppError'

const emailPattern = /^\S+@\S+\.\S+$/
const allowedStatuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost']
const allowedSources: LeadSource[] = ['Website', 'Instagram', 'Referral']

interface LeadRequestBody {
  name?: string
  email?: string
  status?: LeadStatus
  source?: LeadSource
}

const isBlank = (value?: string) => !value?.trim()

const isValidEmail = (email?: string) => {
  const trimmedEmail = email?.trim()
  if (!trimmedEmail) return false
  return emailPattern.test(trimmedEmail)
}

const isValidStatus = (status?: LeadStatus) => {
  if (!status) return true
  return allowedStatuses.includes(status)
}

const isValidSource = (source?: LeadSource) => {
  if (!source) return false
  return allowedSources.includes(source)
}

export const validateLead: RequestHandler = (req, _res, next) => {
  const { name, email, status, source } = req.body as LeadRequestBody
  const errors: ValidationErrorDetail[] = []

  if (isBlank(name)) {
    errors.push({ field: 'name', message: 'Name is required' })
  }

  if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' })
  }

  if (!isValidStatus(status)) {
    errors.push({
      field: 'status',
      message: 'Status must be New, Contacted, Qualified, or Lost',
    })
  }

  if (!isValidSource(source)) {
    errors.push({
      field: 'source',
      message: 'Source must be Website, Instagram, or Referral',
    })
  }

  if (errors.length > 0) {
    next(new AppError('Validation failed', 400, errors))
    return
  }

  next()
}
