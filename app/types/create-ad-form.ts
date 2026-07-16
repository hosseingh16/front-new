export interface PartTimeTimeRange {
  start: string
  end: string
}

export interface PartTimeDaySchedule {
  day: string
  enabled: boolean
  ranges: PartTimeTimeRange[]
}

export const PART_TIME_WEEK_DAYS = [
  'شنبه‌ها',
  'یکشنبه‌ها',
  'دوشنبه‌ها',
  'سه‌شنبه‌ها',
  'چهارشنبه‌ها',
  'پنج‌شنبه‌ها',
  'جمعه‌ها',
] as const

export function createEmptyPartTimeWeekSchedule(): PartTimeDaySchedule[] {
  return PART_TIME_WEEK_DAYS.map((day) => ({
    day,
    enabled: false,
    ranges: [{ start: '', end: '' }],
  }))
}

export interface CreateAdFormModel {
  title: string
  company_address: string
  city: number | null
  city_name: string
  region: number | null
  region_name: string
  province: number | null
  province_name: string
  employment_type: string
  salary_range: string
  minimum_work_experience: string
  gender: string
  minimum_degree: string
  resume_terms: string
  company_software: string[]
  company_advantages: string[]
  excel_skill: string | null
  maliat_skill: string | null
  bimeh_skill: string | null
  baha_skill: string | null
  work_schedule: string
  travel_need: string
  accounting_management: string
  accounting_needs: string[]
  collaboration_type: string
  floating_days: string
  floating_hours: string
  fixed_schedule: PartTimeDaySchedule[]
}

export interface CreateAdFormErrors {
  title?: string
  employment_type?: string
  resume_terms?: string
  accounting_management?: string
  collaboration_type?: string
  floating_days?: string
  floating_hours?: string
  fixed_schedule?: string
}

export const CREATE_AD_DRAFT_KEY = 'create-ad-draft'

export function createEmptyCreateAdForm(): CreateAdFormModel {
  return {
    title: '',
    company_address: '',
    city: null,
    city_name: '',
    region: null,
    region_name: '',
    province: null,
    province_name: '',
    employment_type: '',
    salary_range: '',
    minimum_work_experience: '',
    gender: '',
    minimum_degree: '',
    resume_terms: '',
    company_software: [],
    company_advantages: [],
    excel_skill: null,
    maliat_skill: null,
    bimeh_skill: null,
    baha_skill: null,
    work_schedule: '',
    travel_need: '',
    accounting_management: '',
    accounting_needs: [],
    collaboration_type: '',
    floating_days: '',
    floating_hours: '',
    fixed_schedule: createEmptyPartTimeWeekSchedule(),
  }
}
