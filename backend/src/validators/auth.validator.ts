import type { NextFunction, RequestHandler } from 'express'
import type { ValidationErrorDetail } from '../types'
import { AppError } from '../utils/AppError'

const emailPattern = /^\S+@\S+\.\S+$/
const minPasswordLength = 6

interface RegisterRequestBody {
  name?: string
  email?: string
  password?: string
}

interface LoginRequestBody {
  email?: string
  password?: string
}

const isBlank = (value?: string) => !value?.trim()

const isValidEmail = (email?: string) => {
  const trimmedEmail = email?.trim()
  if (!trimmedEmail) return false
  return emailPattern.test(trimmedEmail)
}

const failIfInvalid = (
  errors: ValidationErrorDetail[],
  next: NextFunction,
) => {
  if (errors.length === 0) {
    next()
    return
  }

  next(new AppError('Validation failed', 400, errors))
}

export const validateRegister: RequestHandler = (req, _res, next) => {
  const { name, email, password } = req.body as RegisterRequestBody
  const errors: ValidationErrorDetail[] = []

  if (isBlank(name)) {
    errors.push({ field: 'name', message: 'Name is required' })
  }

  if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' })
  }

  if (!password || password.length < minPasswordLength) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters',
    })
  }

  failIfInvalid(errors, next)
}

export const validateLogin: RequestHandler = (req, _res, next) => {
  const { email, password } = req.body as LoginRequestBody
  const errors: ValidationErrorDetail[] = []

  if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' })
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' })
  }

  failIfInvalid(errors, next)
}
