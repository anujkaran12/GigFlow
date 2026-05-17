import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import type { ApiErrorResponse, ApiResponse } from '../types'

const baseURL = import.meta.env.VITE_API_URL as string | undefined
const refreshUrl = '/auth/refresh'

interface RetryableRequest extends AxiosRequestConfig {
  _retry?: boolean
}

let isRefreshing = false
let refreshQueue: Array<{
  resolve: () => void
  reject: (error: unknown) => void
}> = []

const resolveRefreshQueue = () => {
  refreshQueue.forEach(({ resolve }) => resolve())
  refreshQueue = []
}

const rejectRefreshQueue = (error: unknown) => {
  refreshQueue.forEach(({ reject }) => reject(error))
  refreshQueue = []
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config as RetryableRequest | undefined
      const requestUrl = originalRequest?.url
      const canRefresh =
        originalRequest &&
        !originalRequest._retry &&
        requestUrl !== refreshUrl &&
        requestUrl !== '/auth/login' &&
        requestUrl !== '/auth/register'

      if (canRefresh) {
        if (isRefreshing) {
          try {
            await new Promise<void>((resolve, reject) => {
              refreshQueue.push({ resolve, reject })
            })
            return api(originalRequest)
          } catch (refreshError) {
            return Promise.reject(refreshError)
          }
        }

        try {
          isRefreshing = true
          originalRequest._retry = true
          await api.post<ApiResponse<null>>(refreshUrl)
          resolveRefreshQueue()
          return api(originalRequest)
        } catch (refreshError) {
          rejectRefreshQueue(refreshError)
          error = refreshError as AxiosError<ApiErrorResponse>
        } finally {
          isRefreshing = false
        }
      }

    }

    return Promise.reject(error)
  },
)
