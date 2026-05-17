import type { Request, Response } from 'express'
import { env } from '../config/env'
import {
  getCurrentUser,
  loginUser,
  refreshAccessTokenForUser,
  registerUser,
} from '../services/auth.service'
import type { AuthRequest } from '../types'
import { AppError } from '../utils/AppError'
import { accessTokenMaxAge, refreshTokenMaxAge } from '../utils/jwt'
import { ResponseHandler } from '../utils/ResponseHandler'

const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'none' as const,
  maxAge,
})

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'none' as const,
})

const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', getClearCookieOptions())
  res.clearCookie('refreshToken', getClearCookieOptions())
}

export const register = async (
  req: Request,
  res: Response,
) => {
  await registerUser(req.body)

  ResponseHandler.send(res, 201, 'User registered successfully', null)
}

export const login = async (
  req: Request,
  res: Response,
) => {
  const { accessToken, refreshToken, user } = await loginUser(req.body)

  res
    .cookie('accessToken', accessToken, getCookieOptions(accessTokenMaxAge))
    .cookie('refreshToken', refreshToken, getCookieOptions(refreshTokenMaxAge))

  ResponseHandler.send(res, 200, 'Login successful', { user })
}

export const logout = async (
  _req: Request,
  res: Response,
) => {
  clearAuthCookies(res)

  ResponseHandler.send(res, 200, 'Logged out successfully', null)
}

export const refreshAccessToken = async (
  req: Request,
  res: Response,
) => {
  const refreshToken = req.cookies.refreshToken as string | undefined

  if (!refreshToken) {
    clearAuthCookies(res)
    throw new AppError('Unauthorized', 401)
  }

  try {
    const accessToken = await refreshAccessTokenForUser(refreshToken)

    res
      .cookie('accessToken', accessToken, getCookieOptions(accessTokenMaxAge))

    ResponseHandler.send(res, 200, 'Access token refreshed successfully', null)
  } catch (error) {
    clearAuthCookies(res)
    throw error
  }
}

export const getMe = async (
  req: AuthRequest,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401)
  }

  const currentUser = await getCurrentUser(req.user.id)

  ResponseHandler.send(res, 200, 'User fetched successfully', currentUser)
}
