export interface CompanyFilterSection {
  title: string
  icon: string
}

export interface CompanyFiltersModel {
  search: string
  provinces: number[]
  cities: Array<string | number>
  activities: Array<string | number>
  sizes: Array<string | number>
  adCounts: Array<string | number>
  benefits: Array<string | number>
}

export const COMPANY_FILTER_SECTIONS: CompanyFilterSection[] = [
  { title: 'جستجو', icon: 'search-1' },
  { title: 'موقعیت مکانی', icon: 'location-6' },
  { title: 'نوع فعالیت', icon: 'bag-4' },
  { title: 'اندازه شرکت', icon: 'users-1' },
  { title: 'تعداد آگهی فعال', icon: 'bag-3' },
  { title: 'مزایای سازمانی', icon: 'benefits' },
]

export function createEmptyCompanyFilters(): CompanyFiltersModel {
  return {
    search: '',
    provinces: [],
    cities: [],
    activities: [],
    sizes: [],
    adCounts: [],
    benefits: [],
  }
}
