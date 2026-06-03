export function useApi() {
  const { request } = useApiClient()

  return {
    get: <T>(url: string) =>
      request<T>(url, { method: 'GET' }),

    post: <T>(url: string, body?: any) =>
      request<T>(url, { method: 'POST', body }),

    put: <T>(url: string, body?: any) =>
      request<T>(url, { method: 'PUT', body }),

    delete: <T>(url: string) =>
      request<T>(url, { method: 'DELETE' }),
  }
}