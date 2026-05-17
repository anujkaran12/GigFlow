import type { NextFunction, Response } from 'express'
import type { AuthRequest } from '../types'
import { AppError } from '../utils/AppError'

export const isAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    next(new AppError('Admin access required', 403))
    return
  }

  next()
}
