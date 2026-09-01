import type { EmployerAdRequestUser } from '~/types/employer-ad-request'

export type ResumeBankTab = 'all' | 'bookmarked'

export type ResumeBankUser = EmployerAdRequestUser & {
  is_bookmarked?: boolean
}

export interface ResumeBankFilterSection {
  title: string
  icon: string
}

export interface ResumeBankFiltersModel {
  titleSearch: string
  jobTitles: string[]
  skills: string[]
  jobStatuses: string[]
  experience: string[]
  salaries: string[]
  education: string[]
  provinces: number[]
  gender: string | null
}

export const RESUME_BANK_LOOKUP_KEYS =
  'job_titles,experience_levels,salary_ranges,education_levels,genders,provinces,proficiencies'

export const RESUME_BANK_JOB_STATUS_OPTIONS = [
  { value: '0', label: 'جویای کار' },
  { value: '1', label: 'شاغل' },
] as const

export const RESUME_BANK_FILTER_SECTIONS: ResumeBankFilterSection[] = [
  { title: 'جستجو عنوان شغلی', icon: 'search-1' },
  { title: 'مهارت‌ها و تخصص‌ها', icon: 'bag-4' },
  { title: 'وضعیت شغلی و سابقه', icon: 'work-history-2' },
  { title: 'حقوق', icon: 'wallet' },
  { title: 'تحصیلات', icon: 'text' },
  { title: 'محل سکونت', icon: 'location-6' },
  { title: 'اطلاعات فردی', icon: 'user-2' },
]

export function createEmptyResumeBankFilters(): ResumeBankFiltersModel {
  return {
    titleSearch: '',
    jobTitles: [],
    skills: [],
    jobStatuses: [],
    experience: [],
    salaries: [],
    education: [],
    provinces: [],
    gender: null,
  }
}
