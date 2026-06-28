import type { ISelectItem } from '~/types/select-item'

export type ProvinceCheckState = 'none' | 'some' | 'all'

export interface JobFilterSection {
  title: string
  icon: string
}

export interface LocationTreeItem {
  province: ISelectItem
  cities: ISelectItem[]
  forceExpand: boolean
}

export interface JobFiltersModel {
  jobTypes: Array<string | number>
  titleSearch: string
  jobGroups: Array<string | number>
  cities: Array<string | number>
  provinces: number[]
  salaries: Array<string | number>
  workHistory: Array<string | number>
  contractTypes: Array<string | number>
  benefits: Array<string | number>
}

export const JOB_FILTER_SECTIONS: JobFilterSection[] = [
  { title: 'نوع آگهی', icon: 'user-search-4' },
  { title: 'جستجو عنوان', icon: 'search-1' },
  { title: 'گروه‌های شغلی', icon: 'bag-4' },
  { title: 'شهر', icon: 'location-6' },
  { title: 'حقوق', icon: 'wallet' },
  { title: 'سابقه کار', icon: 'work-history-2' },
  { title: 'نوع قرارداد', icon: 'text' },
  { title: 'مزایای سازمانی', icon: 'benefits' },
]

export function createEmptyJobFilters(): JobFiltersModel {
  return {
    jobTypes: [],
    titleSearch: '',
    jobGroups: [],
    cities: [],
    provinces: [],
    salaries: [],
    workHistory: [],
    contractTypes: [],
    benefits: [],
  }
}
