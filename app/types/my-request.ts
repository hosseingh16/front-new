export type MyRequestStatus =
  | 'sent'
  | 'priority'
  | 'interview'
  | 'rejected'
  | 'pending'

export type MyRequestTab =
  | 'all'
  | 'sent'
  | 'priority'
  | 'interview'
  | 'rejected'

export type MyRequestTimelineActor = 'company' | 'platform' | 'user'

export type MyRequestTimelineEventType =
  | 'interview'
  | 'contact'
  | 'rejected'
  | 'reviewing'
  | 'waiting'
  | 'sent'

export interface MyRequestTimelineEvent {
  id: string
  type: MyRequestTimelineEventType
  title: string
  description: string
  date?: string | null
  actor: MyRequestTimelineActor
  rejectReason?: string
  showContactCta?: boolean
}

export interface MyRequest {
  id: number
  ad_id: number
  job_title: string
  company_name: string
  company_logo?: string
  company_website?: string
  category?: string
  province_name?: string
  city_name?: string
  employment_type?: string
  ad_type?: string
  salary?: string
  gender?: string
  minimum_work_experience?: string
  minimum_degree?: string
  publish_date?: string
  status: MyRequestStatus
  reject_reasons?: string
  reject_description?: string
  requested_at?: string
  checked_at?: string
  updated_at?: string
  created_at: string
  is_bookmarked?: boolean
}
