export type EmployerAdRequestTab = 'requests' | 'bookmarked'

export interface EmployerAdRequestPersonal {
  id?: number
  name?: string
  email?: string
  cellphone?: string
  province_name?: string
  city_name?: string
  region_name?: string
  marital_status?: string
  birthdate?: string
  military_service_status?: string
  gender?: string | number
  wanted_job?: string
  job_title?: string
  desired_salary?: string
  salary_range?: string
  job_status?: string
  work_experience?: string
}

export interface EmployerAdRequestUser {
  id: number
  name: string
  phone?: string
  avatar?: string
  personal?: EmployerAdRequestPersonal
}

export interface EmployerAdRequest {
  id: number
  user?: EmployerAdRequestUser
  requested_job_title?: string
  status?: string
  seen?: string
  work_experience?: string
}

export interface EmployerAdRequestStatusOption {
  value: number
  label: string
  dotColor: string
}

export interface EmployerAdRequestFiltersModel {
  statuses: number[]
  experience: string | null
  gender: string | null
}

export interface EmployerAdRequestFilterSection {
  title: string
  icon: string
}

export const AD_REQUEST_STATUS_OPTIONS: EmployerAdRequestStatusOption[] = [
  { value: 35, label: 'بررسی نشده', dotColor: '#4864E1' },
  { value: 3, label: 'در انتظار تعیین وضعیت', dotColor: '#4864E1' },
  { value: 10, label: 'تایید برای مصاحبه', dotColor: '#009F65' },
  { value: 11, label: 'رد شده', dotColor: '#EF4035' },
]

export const AD_REQUEST_EXPERIENCE_OPTIONS = [
  'زیر 5 سال',
  'بین 5 تا 10 سال',
  'بین 10 تا 15 سال',
  'بالاتر از 15 سال',
] as const

export const AD_REQUEST_GENDER_OPTIONS = [
  { value: '1', label: 'آقا' },
  { value: '0', label: 'خانم' },
]

export const AD_REQUEST_FILTER_SECTIONS: EmployerAdRequestFilterSection[] = [
  { title: 'وضعیت رزومه‌ها', icon: 'user-search-4' },
  { title: 'سابقه کار', icon: 'work-history-2' },
  { title: 'جنسیت', icon: 'user-2' },
]

export function createEmptyEmployerAdRequestFilters(): EmployerAdRequestFiltersModel {
  return {
    statuses: AD_REQUEST_STATUS_OPTIONS.map((item) => item.value),
    experience: null,
    gender: null,
  }
}
