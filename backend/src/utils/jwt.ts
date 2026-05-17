import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'
import type { AuthUserPayload } from '../types'

const accessTokenExpiresIn: SignOptions['expiresIn'] = '15m'
const refreshTokenExpiresIn: SignOptions['expiresIn'] = '7d'

export const accessTokenMaxAge = 15 * 60 * 1000
export const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000

const signJwt = (
  payload: AuthUserPayload,
  secret: string,
  expiresIn: SignOptions['expiresIn'],
) => {
  const options: SignOptions = {
    expiresIn,
  }

  return jwt.sign(payload, secret, options)
}

export const signAccessToken = (payload: AuthUserPayload) =>
  signJwt(payload, env.accessTokenSecret, accessTokenExpiresIn)

export const signRefreshToken = (payload: AuthUserPayload) =>
  signJwt(payload, env.refreshTokenSecret, refreshTokenExpiresIn)

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.accessTokenSecret) as AuthUserPayload

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.refreshTokenSecret) as AuthUserPayload
