import type { ISelectItem } from '~/types/select-item'

const BENEFIT_ICON_MAP: Record<string, string> = {
  بیمه: 'lucide:shield',
  'بیمه تکمیلی': 'lucide:shield-plus',
  'بیمه درمان تکمیلی': 'lucide:shield-plus',
  'پاداش و هدایا': 'svg:reward',
  'سرانه آموزشی': 'lucide:book-open-text',
  'کمک هزینه آموزشی': 'lucide:book-open-text',
  'پزشک سازمانی': 'lucide:stethoscope',
  'وام سازمانی': 'lucide:hand-coins',
  صبحانه: 'lucide:coffee',
  ناهار: 'lucide:utensils',
  'سرویس رفت و برگشت': 'lucide:bus',
}

export const PROFICIENCY_NO_NEED = 'no_need'

const ORANGE_PROFICIENCY_VALUES = new Set([
  PROFICIENCY_NO_NEED,
  'very_low',
  'low',
])

export function getProficiencyColor(
  value: string | boolean | number | null | undefined,
): string {
  if (value === true) return '#2E7D32'

  if (typeof value === 'number') {
    return value <= 2 ? '#FFA726' : '#2E7D32'
  }

  if (value == null || value === '' || value === false) {
    return '#2E7D32'
  }

  return ORANGE_PROFICIENCY_VALUES.has(String(value)) ? '#FFA726' : '#2E7D32'
}

export function getProficiencySteps(proficiencies: ISelectItem[]) {
  return proficiencies
    .filter((item) => item.value !== PROFICIENCY_NO_NEED)
    .map((item) => item.label)
}

export function getProficiencyLevel(
  value: string | boolean | number | null | undefined,
  proficiencies: ISelectItem[],
): number | null {
  if (value == null || value === '' || value === false) return null

  const steps = proficiencies.filter((item) => item.value !== PROFICIENCY_NO_NEED)
  if (!steps.length) return null

  if (typeof value === 'number') {
    return value > 0 && value <= steps.length ? value : null
  }

  if (value === true) {
    const goodIndex = steps.findIndex((item) => item.value === 'good')
    return goodIndex >= 0 ? goodIndex + 1 : null
  }

  const proficiencyValue = String(value)
  if (proficiencyValue === PROFICIENCY_NO_NEED) return null

  const index = steps.findIndex((item) => String(item.value) === proficiencyValue)
  return index >= 0 ? index + 1 : null
}

export function parseAdBenefits(raw?: string | null) {
  if (!raw?.trim()) return []

  return raw
    .split(/,|،/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((label) => ({
      label,
      icon: BENEFIT_ICON_MAP[label] ?? 'lucide:gift',
    }))
}
