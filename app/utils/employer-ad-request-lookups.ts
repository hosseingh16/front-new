import type { EmployerAdRequestStatusOption } from '~/types/employer-ad-request'
import type { ISelectItem } from '~/types/select-item'

export const EMPLOYER_AD_REQUEST_LOOKUP_KEYS =
  'ad_request_statuses,experience_levels,genders'

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
