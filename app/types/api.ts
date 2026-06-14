export interface User {
  id: number
  name: string
  mobile: string
}

export interface ApiError {
  status: number
  message?: string
  errors?: Record<string, any> | string
}

export interface ApiResponse<T = any> {
  data: T
  meta?: {
    current_page: number
    from: number
    last_page: number | null
    path: string
    per_page: number
    to: number
    total: number
  }
  links?: {
    first: string
    last: string
    next: string | null
    prev: string | null
  }
  error?: string
  message?: string
  status?: number
}
export interface ApiRequestOptions {
  headers?: Record<string, string>
  query?: Record<string, unknown>
}