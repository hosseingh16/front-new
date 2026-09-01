export interface JobFilterSection {
  title: string
  icon: string
}

export const JOB_FILTERS_LOOKUP_KEYS =
  'benefits,employment_types,experience_levels,job_titles,provinces,salary_ranges'

export interface JobFiltersModel {
  jobTypes: Array<string | number>
  titleSearch: string
  jobGroups: Array<string | number>
  provinces: number[]
  salaries: Array<string | number>
  workHistory: Array<string | number>
  contractTypes: Array<string | number>
  benefits: Array<string | number>
}
export const JOB_FILTER_SECTIONS: JobFilterSection[] = [
  { title: 'نوع آگهی', icon: 'user-search-4' },
  { title: 'جستجو عنوان شغلی', icon: 'search-1' },
  { title: 'گروه‌های شغلی', icon: 'bag-4' },
  { title: 'استان', icon: 'location-6' },
  { title: 'حقوق', icon: 'wallet' },
  { title: 'سابقه کار', icon: 'work-history-2' },
  { title: 'نوع قرارداد', icon: 'text' },
  { title: 'مزایای شغلی', icon: 'benefits' },
]

export function createEmptyJobFilters(): JobFiltersModel {
  return {
    jobTypes: [],
    titleSearch: '',
    jobGroups: [],
    provinces: [],
    salaries: [],
    workHistory: [],
    contractTypes: [],
    benefits: [],
  }
}
