import type { NextFunction, Response } from 'express'
import { User } from '../models/User'
import type { AuthRequest } from '../types'
import { AppError } from '../utils/AppError'
import { verifyAccessToken } from '../utils/jwt'

export const protect = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken as string | undefined

  if (!token) {
    next(new AppError('Unauthorized', 401))
    return
  }

  try {
    const decodedToken = verifyAccessToken(token)
    const user = await User.findById(decodedToken.id).select('role')

    if (!user) {
      throw new AppError('Unauthorized', 401)
    }

    req.user = {
      id: user.id,
      role: user.role,
    }

    next()
  } catch (error) {
    if (error instanceof AppError) {
      next(error)
      return
    }

    next(new AppError('Unauthorized', 401))
  }
}
