export interface EmployerProjectRequests {
  total?: number
  unseen?: number
  seen?: number
  confirmed?: number
  rejected?: number
}

export interface EmployerProject {
  id: number
  title?: string
  type?: string
  scopes?: string | string[]
  status?: string
  publish_date?: string
  created_at?: string
  updated_at?: string
  expired?: boolean
  company_name?: string
  requests?: EmployerProjectRequests
  requests_total?: number
  requests_unseen?: number
  requests_seen?: number
  requests_confirmed?: number
  requests_rejected?: number
}

export type EmployerProjectFilter = 'all' | 'active' | 'draft' | 'expired'

export interface EmployerProjectsData {
  active: EmployerProject[]
  draft: EmployerProject[]
  expired: EmployerProject[]
  total: EmployerProject[]
}
