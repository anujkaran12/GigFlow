import type { Response } from 'express'
import {
  createLead as createLeadService,
  deleteLead as deleteLeadService,
  getLeadById as getLeadByIdService,
  getLeads as getLeadsService,
  getLeadsCsv,
  updateLead as updateLeadService,
} from '../services/lead.service'
import type { AuthRequest, LeadBody, LeadQuery } from '../types'
import { AppError } from '../utils/AppError'
import { ResponseHandler } from '../utils/ResponseHandler'

const getRouteParam = (value: string | string[] | undefined, name: string) => {
  if (typeof value === 'string') return value
  throw new AppError(`${name} is required`, 400)
}

export const getLeads = async (req: AuthRequest, res: Response) => {
  const result = await getLeadsService(req.query as LeadQuery)

  ResponseHandler.send(res, 200, 'Leads fetched successfully', result.leads, result.meta)
}

export const getLeadById = async (
  req: AuthRequest,
  res: Response,
) => {
  const leadId = getRouteParam(req.params.id, 'Lead id')
  const lead = await getLeadByIdService(leadId)

  ResponseHandler.send(res, 200, 'Lead fetched successfully', lead)
}

export const createLead = async (
  req: AuthRequest,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }

  const lead = await createLeadService(req.body as LeadBody, req.user.id)

  ResponseHandler.send(res, 201, 'Lead created successfully', lead)
}

export const updateLead = async (
  req: AuthRequest,
  res: Response,
) => {
  const leadId = getRouteParam(req.params.id, 'Lead id')
  const lead = await updateLeadService(leadId, req.body as LeadBody)

  ResponseHandler.send(res, 200, 'Lead updated successfully', lead)
}

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
) => {
  const leadId = getRouteParam(req.params.id, 'Lead id')

  await deleteLeadService(leadId)

  ResponseHandler.send(res, 200, 'Lead deleted successfully', null)
}

export const exportLeadsCsv = async (req: AuthRequest, res: Response) => {
  const csv = await getLeadsCsv(req.query as LeadQuery)

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv')
  res.status(200).send(csv)
}
