import { Router } from 'express'
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  getLeadById,
  getLeads,
  updateLead,
} from '../controllers/lead.controller'
import { protect } from '../middleware/auth.middleware'
import { isAdmin } from '../middleware/role.middleware'
import { validateLead } from '../validators/lead.validator'

const router = Router()

router.use(protect)

router.get('/', getLeads)
router.get('/export/csv', exportLeadsCsv)
router.get('/:id', getLeadById)
router.post('/', isAdmin, validateLead, createLead)
router.put('/:id', validateLead, updateLead)
router.delete('/:id', isAdmin, deleteLead)

export default router
