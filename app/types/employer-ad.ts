export interface EmployerAdStats {
  received?: number
  unreviewed?: number
  status_determined?: number
  interview_approved?: number
  rejected?: number
}

export interface EmployerAd {
  id: number
  title: string
  status?: string
  publish_date?: string
  created_at?: string
  updated_at?: string
  expired?: boolean
  stats?: EmployerAdStats
  received_count?: number
  unreviewed_count?: number
  status_determined_count?: number
  interview_approved_count?: number
  rejected_count?: number
}

export type EmployerAdFilter = 'all' | 'active' | 'draft' | 'expired'

export interface EmployerAdsData {
  active: EmployerAd[]
  draft: EmployerAd[]
  expired: EmployerAd[]
  total: EmployerAd[]
}
