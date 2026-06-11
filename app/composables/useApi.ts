import type { ApiRequestOptions } from '~/types/api'

export function useApi() {
  const { request } = useApiClient()

  return {
    get: <T>(url: string, options?: ApiRequestOptions) =>
      request<T>(url, { method: 'GET', ...options }),

    post: <T>(url: string, body?: any, options?: ApiRequestOptions) =>
      request<T>(url, { method: 'POST', body, ...options }),

    put: <T>(url: string, body?: any, options?: ApiRequestOptions) =>
      request<T>(url, { method: 'PUT', body, ...options }),

    patch: <T>(url: string, body?: any, options?: ApiRequestOptions) =>
      request<T>(url, { method: 'PATCH', body, ...options }),

    delete: <T>(url: string, options?: ApiRequestOptions) =>
      request<T>(url, { method: 'DELETE', ...options }),
  }
}