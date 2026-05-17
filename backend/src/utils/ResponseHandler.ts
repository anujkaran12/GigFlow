import type { Response } from 'express'
import type { PaginationMeta } from '../types'

export class ResponseHandler {
  static send<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T,
    meta?: PaginationMeta,
  ) {
    return res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data,
      ...(meta ? { meta } : {}),
    })
  }
}
