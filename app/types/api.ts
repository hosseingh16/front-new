export interface User {
  id: number
  name: string
  mobile: string
}

export interface Ad {
  id: number
  title: string
  image: string
  link: string
}

export interface ApiError {
  status: number
  message?: string
  errors?: Record<string, any> | string
}