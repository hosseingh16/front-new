export type HomeSearchTab = 'all' | 'jobs' | 'seekers' | 'consultants' | 'organizations'

export interface HomeSearchItem {
  id: number | string
  tab: Exclude<HomeSearchTab, 'all'>
  title: string
  detailLabel: string
  detailValue: string
  url: string
  image?: string | null
}

export const HOME_SEARCH_TABS: { value: HomeSearchTab; label: string; icon?: string }[] = [
  { value: 'all', label: 'همه', icon: 'svg:bag-1' },
  { value: 'jobs', label: 'فرصت‌های شغلی', icon: 'svg:jobs' },
  // { value: 'seekers', label: 'کارجویان', icon: 'svg:user-search-3' },
  // { value: 'consultants', label: 'مشاوران', icon: 'svg:users-1' },
  { value: 'organizations', label: 'سازمان‌ها', icon: 'svg:buildings-5' },
]

export const HOME_SEARCH_GROUPS: {
  tab: Exclude<HomeSearchTab, 'all'>
  title: string
  icon: string
}[] = [
  { tab: 'jobs', title: 'فرصت‌های شغلی', icon: 'svg:jobs' },
  // { tab: 'seekers', title: 'کارجویان', icon: 'svg:user-search-3' },
  // { tab: 'consultants', title: 'مشاوران', icon: 'svg:users-1' },
  { tab: 'organizations', title: 'سازمان‌ها', icon: 'svg:buildings-5' },
]

export const HOME_SEARCH_ITEM_ICONS: Record<
  Exclude<HomeSearchTab, 'all'>,
  string
> = {
  jobs: 'svg:jobs',
  seekers: 'svg:user-search-3',
  consultants: 'svg:users-1',
  organizations: 'svg:buildings-5',
}

export const HOME_SEARCH_ALL_EMPTY = {
  title: 'نتیجه‌ای یافت نشد',
  description: 'متاسفانه موردی با این جستجو پیدا نشد!',
}

export const HOME_SEARCH_EMPTY_STATE: Record<
  Exclude<HomeSearchTab, 'all'>,
  { title: string; description: string }
> = {
  jobs: {
    title: 'فرصت شغلی موجود نیست',
    description: 'متاسفانه هیچ فرصت شغلی جهت نمایش موجود نیست!',
  },
  seekers: {
    title: 'کارجویی یافت نشد',
    description: 'متاسفانه هیچ کارجویی با این جستجو پیدا نشد!',
  },
  consultants: {
    title: 'مشاوری یافت نشد',
    description: 'متاسفانه هیچ مشاوری با این جستجو پیدا نشد!',
  },
  organizations: {
    title: 'سازمانی یافت نشد',
    description: 'متاسفانه هیچ سازمانی با این جستجو پیدا نشد!',
  },
}
