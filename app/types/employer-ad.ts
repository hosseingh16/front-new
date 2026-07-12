export interface EmployerAdRequests {
  total?: number
  unseen?: number
  seen?: number
  confirmed?: number
  rejected?: number
}

export interface EmployerAd {
  id: number
  title: string
  company_logo?: string
  company_name?: string
  status?: string
  publish_date?: string
  created_at?: string
  updated_at?: string
  expired?: boolean
  requests?: EmployerAdRequests
}

export type EmployerAdFilter = 'all' | 'active' | 'draft' | 'expired'

export interface EmployerAdsData {
  active: EmployerAd[]
  draft: EmployerAd[]
  expired: EmployerAd[]
  total: EmployerAd[]
}
