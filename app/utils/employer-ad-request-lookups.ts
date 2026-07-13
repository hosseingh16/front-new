import type { EmployerAdRequestStatusOption } from '~/types/employer-ad-request'
import type { ISelectItem } from '~/types/select-item'

export const EMPLOYER_AD_REQUEST_LOOKUP_KEYS =
  'ad_request_statuses,experience_levels,genders'

export const AD_REQUEST_REJECT_REASONS = [
  { value: 1, label: 'نداشتن سابقه کار کافی در این حوزه' },
  { value: 2, label: 'نداشتن دانش و تخصص کافی در این حوزه' },
  {
    value: 3,
    label: 'عدم تطابق سن / جنسیت / محل سکونت / وضعیت سربازی',
  },
  { value: 4, label: 'عدم تناسب حقوق درخواستی' },
  {
    value: 5,
    label: 'عدم تناسب رشته تحصیلی یا دانشگاه با شرایط مدنظر',
  },
  { value: 6, label: 'نداشتن سابقه کار کافی در این سطح سازمانی' },
  { value: 7, label: 'نداشتن توانمندی کافی در کار با نرم افزار ها' },
  { value: 8, label: 'نداشتن سابقه کار کافی در این صنعت' },
  { value: 9, label: 'کارجو منصرف شد / جای دیگری استخدام شد' },
  { value: 10, label: 'عدم تناسب با محیط و فرهنگ سازمان' },
  { value: 11, label: 'عدم حضور در جلسه مصاحبه' },
  { value: 12, label: 'فرد دیگری استخدام شد' },
  { value: 13, label: 'سایر' },
]

const LOOKUP_COLOR_MAP: Record<string, string> = {
  success: '#009F65',
  danger: '#EF4035',
  warning: '#B95C04',
  info: '#0098E7',
  primary: '#4864E1',
  secondary: '#4A4A4A',
}

type LookupItem = ISelectItem & {
  color?: string
}

export function lookupColorToDotColor(color?: string) {
  return LOOKUP_COLOR_MAP[color ?? ''] ?? '#4864E1'
}

export function mapAdRequestStatusOptions(
  items: LookupItem[] = [],
): EmployerAdRequestStatusOption[] {
  return items.map((item) => ({
    value: Number(item.value),
    label: item.label,
    color: item.color,
    dotColor: lookupColorToDotColor(item.color),
  }))
}

export function mapEmployerGenderOptions(items: ISelectItem[] = []) {
  return items.filter((item) => item.value !== 'any')
}

export function normalizeGenderFilterValue(value: string | null) {
  if (value == null || value === '') return null

  const legacyMap: Record<string, string> = {
    '0': 'female',
    '1': 'male',
  }

  return legacyMap[value] ?? value
}

export function adRequestStatusIcon(value: number) {
  switch (value) {
    case 35:
      return 'mdi:briefcase-search-outline'
    case 3:
      return 'mdi:briefcase-clock-outline'
    case 10:
      return 'lucide:check-check'
    case 11:
      return 'material-symbols:cancel-outline'
    default:
      return 'mdi:briefcase-search-outline'
  }
}
