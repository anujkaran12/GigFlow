import type { ValidationErrorDetail } from '../types'

export class AppError extends Error {
  statusCode: number
  details?: ValidationErrorDetail[]

  constructor(message: string, statusCode = 500, details?: ValidationErrorDetail[]) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
}
