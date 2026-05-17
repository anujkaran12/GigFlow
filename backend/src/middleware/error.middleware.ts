import type { ErrorRequestHandler, RequestHandler } from 'express'
import { Error as MongooseError } from 'mongoose'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { AppError } from '../utils/AppError'
import { ResponseHandler } from '../utils/ResponseHandler'

interface ErrorWithCode extends Error {
  code?: number
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404))
}

export const errorHandler: ErrorRequestHandler = (error: ErrorWithCode, _req, res, _next) => {
  let statusCode = error instanceof AppError ? error.statusCode : 500
  let message = error.message || 'Internal Server Error'
  const details = error instanceof AppError ? error.details : undefined

  if (error instanceof MongooseError.ValidationError) {
    statusCode = 400
    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(', ')
  }

  if (error.code === 11000) {
    statusCode = 400
    message = 'Email already exists'
  }

  if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
    statusCode = 401
    message = 'Unauthorized'
  }

  const data = details ?? null

  return ResponseHandler.send(res, statusCode, message, data)
}
