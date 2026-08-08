import type { MyRequest, MyRequestStatus, MyRequestTab } from '~/types/my-request'

export interface MyRequestStatusMeta {
  label: string
  className: string
  dotClassName: string
}

export interface MyRequestTabConfig {
  id: MyRequestTab
  label: string
  icon?: string
  countBadgeClass?: string
}

const STATUS_META: Record<MyRequestStatus, MyRequestStatusMeta> = {
  sent: {
    label: 'ارسال برای کارفرما',
    className: 'bg-[rgba(74,74,74,0.08)] text-[#4a4a4a]',
    dotClassName: 'bg-[#4a4a4a]',
  },
  priority: {
    label: 'مشاهده شده',
    className: 'bg-[rgba(0,152,231,0.08)] text-info-500',
    dotClassName: 'bg-info-500',
  },
  interview: {
    label: 'تأیید برای مصاحبه',
    className: 'bg-[rgba(0,159,101,0.08)] text-success-500',
    dotClassName: 'bg-success-500',
  },
  rejected: {
    label: 'رد شده',
    className: 'bg-[rgba(239,64,53,0.08)] text-danger-500',
    dotClassName: 'bg-danger-500',
  },
  pending: {
    label: 'در حال بررسی',
    className: 'bg-[rgba(185,92,4,0.08)] text-warning-500',
    dotClassName: 'bg-warning-500',
  },
}

export interface EmploymentTypeMeta {
  label: string
  icon: string
  className: string
}

export function getEmploymentTypeMeta(
  type?: string | null,
): EmploymentTypeMeta {
  const normalized = (type ?? '').trim()
  const key = normalized
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .toLowerCase()

  if (
    key.includes('نیمه') ||
    key.includes('پاره') ||
    key.includes('part')
  ) {
    return {
      label: normalized || 'نیمه وقت',
      icon: 'svg:bag-parttime',
      className: 'bg-[rgba(0,152,231,0.08)]',
    }
  }

  if (key.includes('پروژه') || key.includes('project')) {
    return {
      label: normalized || 'پروژه',
      icon: 'svg:notepad-text',
      className: 'bg-[rgba(185,92,4,0.08)]',
    }
  }

  return {
    label: normalized || 'تمام وقت',
    icon: 'svg:briefcase',
    className: 'bg-[rgba(72,100,225,0.08)]',
  }
}

export const MY_REQUEST_TABS: MyRequestTabConfig[] = [
  { id: 'all', label: 'همه' },
  {
    id: 'sent',
    label: 'ارسال برای کارفرما',
    icon: 'svg:buildings-4',
    countBadgeClass: 'bg-[rgba(74,74,74,0.08)] text-[#4a4a4a]',
  },
  {
    id: 'priority',
    label: 'در حال بررسی',
    icon: 'svg:search-briefcase',
    countBadgeClass: 'bg-[rgba(0,152,231,0.08)] text-info-500',
  },
  {
    id: 'interview',
    label: 'تأیید برای مصاحبه',
    icon: 'svg:check-check',
    countBadgeClass: 'bg-success-100 text-success-500',
  },
  {
    id: 'rejected',
    label: 'رد شده',
    icon: 'svg:close',
    countBadgeClass: 'bg-danger-100 text-danger-500',
  },
]

export function getMyRequestStatusMeta(status: MyRequestStatus): MyRequestStatusMeta {
  return STATUS_META[status]
}

export function getMyRequestTabCount(
  requests: MyRequest[],
  tab: MyRequestTab,
): number {
  return filterMyRequestsByTab(requests, tab).length
}

export function filterMyRequestsByTab(
  requests: MyRequest[],
  tab: MyRequestTab,
): MyRequest[] {
  if (tab === 'all') return requests
  if (tab === 'priority') {
    return requests.filter(
      (request) => request.status === 'priority' || request.status === 'pending',
    )
  }
  return requests.filter((request) => request.status === tab)
}

export function filterMyRequestsBySearch(
  requests: MyRequest[],
  query: string,
): MyRequest[] {
  const normalized = query.trim()
  if (!normalized) return requests

  return requests.filter(
    (request) =>
      request.job_title.includes(normalized) ||
      request.company_name.includes(normalized) ||
      request.category?.includes(normalized),
  )
}
