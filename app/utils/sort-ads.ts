import type { AdList } from '~/types/ad'
import type { AdsSort } from '~/utils/ads-filters-query'

export function parseAdPublishTimestamp(date?: string | null): number {
  if (!date) return 0

  if (/^\d{8}$/.test(date)) {
    const year = Number(date.slice(0, 4))
    const month = Number(date.slice(4, 6))
    const day = Number(date.slice(6, 8))
    return new Date(year, month - 1, day).getTime()
  }

  const parsed = Date.parse(date)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function parseAdSalaryValue(
  ad: Pick<AdList, 'salary' | 'salary_range'>,
): number {
  const salary = ad.salary

  if (typeof salary === 'number' && Number.isFinite(salary)) {
    return salary
  }

  const raw = String(salary ?? ad.salary_range ?? '').trim()
  if (!raw || /توافقی/i.test(raw)) return 0

  const numbers =
    raw.match(/[\d,.]+/g)?.map((value) => Number(value.replace(/,/g, ''))) ??
    []
  const valid = numbers.filter((value) => Number.isFinite(value) && value > 0)
  if (!valid.length) return 0

  const max = Math.max(...valid)
  if (/میلیون/i.test(raw) && max < 1000) return max * 1_000_000
  if (/هزار/i.test(raw) && max < 1000) return max * 1_000

  return max
}

export function compareAdsByNewest(a: AdList, b: AdList): number {
  return (
    parseAdPublishTimestamp(b.publish_date) -
    parseAdPublishTimestamp(a.publish_date)
  )
}

export function compareAdsBySalary(a: AdList, b: AdList): number {
  return parseAdSalaryValue(b) - parseAdSalaryValue(a)
}

export function sortAds(list: AdList[], sort: AdsSort): AdList[] {
  const compare = sort === 'salary' ? compareAdsBySalary : compareAdsByNewest
  return [...list].sort(compare)
}
