import type { EmployerAd, EmployerAdFilter, EmployerAdsData } from '~/types/employer-ad'

export function normalizeEmployerAdStatus(ad: EmployerAd) {
  if (ad.expired) return 'expired'

  const status = (ad.status ?? '').toLowerCase()
  if (status.includes('draft') || status.includes('پیش')) return 'draft'
  if (status.includes('expired') || status.includes('منقضی')) return 'expired'
  if (status.includes('publish') || status.includes('active') || status.includes('منتشر')) {
    return 'published'
  }

  return status || 'published'
}

export function getEmployerAdStatusMeta(ad: EmployerAd) {
  const status = normalizeEmployerAdStatus(ad)

  const map: Record<string, { label: string; className: string }> = {
    published: {
      label: 'منتشر شده',
      className: 'bg-[#E8F5E9] text-[#2E7D32]',
    },
    draft: {
      label: 'پیش‌نویس',
      className: 'bg-surface-100 text-text-passive',
    },
    expired: {
      label: 'منقضی شده',
      className: 'bg-[#FFF3E0] text-[#E65100]',
    },
  }

  return map[status] ?? {
    label: 'منتشر شده',
    className: 'bg-[#E8F5E9] text-[#2E7D32]',
  }
}

export function getEmployerAdStatItems(ad: EmployerAd) {
  const stats = ad.stats

  return [
    {
      label: 'دریافت شده',
      value: stats?.received ?? ad.received_count ?? 0,
      icon: 'material-symbols:folder-open-outline',
    },
    {
      label: 'بررسی نشده',
      value: stats?.unreviewed ?? ad.unreviewed_count ?? 0,
      icon: 'material-symbols:chat-bubble-outline',
    },
    {
      label: 'تعیین وضعیت',
      value: stats?.status_determined ?? ad.status_determined_count ?? 0,
      icon: 'material-symbols:calendar-today-outline',
    },
    {
      label: 'تایید برای مصاحبه',
      value: stats?.interview_approved ?? ad.interview_approved_count ?? 0,
      icon: 'material-symbols:check-circle-outline',
    },
    {
      label: 'رد شده',
      value: stats?.rejected ?? ad.rejected_count ?? 0,
      icon: 'material-symbols:cancel-outline',
    },
  ]
}

export function getEmployerAdsByFilter(groups: EmployerAdsData, filter: EmployerAdFilter) {
  if (filter === 'active') return groups.active
  if (filter === 'draft') return groups.draft
  if (filter === 'expired') return groups.expired
  return groups.total
}

export function countEmployerAdsByFilter(groups: EmployerAdsData, filter: EmployerAdFilter) {
  return getEmployerAdsByFilter(groups, filter).length
}
