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
  color?: string
  dotColor: string
}

export interface EmployerAdRequestFiltersModel {
  statuses: number[]
  experience: string[]
  gender: string | null
}

export interface EmployerAdRequestFilterSection {
  title: string
  icon: string
}

export const DEFAULT_AD_REQUEST_STATUS_VALUES = [35, 3, 10, 11]

export const AD_REQUEST_FILTER_SECTIONS: EmployerAdRequestFilterSection[] = [
  { title: 'وضعیت رزومه‌ها', icon: 'user-search-4' },
  { title: 'سابقه کار', icon: 'work-history-2' },
  { title: 'جنسیت', icon: 'user-2' },
]

export function createEmptyEmployerAdRequestFilters(
  statusValues: number[] = DEFAULT_AD_REQUEST_STATUS_VALUES,
): EmployerAdRequestFiltersModel {
  return {
    statuses: [...statusValues],
    experience: [],
    gender: null,
  }
}
