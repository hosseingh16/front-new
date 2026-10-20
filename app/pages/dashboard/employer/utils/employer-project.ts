import type {
  EmployerProject,
  EmployerProjectFilter,
  EmployerProjectsData,
} from '~/types/employer-project'

export type EmployerProjectStatus =
  | 'published'
  | 'pending'
  | 'unpublished'
  | 'under_review'
  | 'expired'
  | 'draft'

export function getEmployerProjectTitle(project: EmployerProject) {
  if (project.title?.trim()) return project.title.trim()
  if (project.type?.trim()) {
    const type = project.type.trim()
    return type.startsWith('پروژه') ? type : `پروژه ${type}`
  }
  return 'پروژه حسابداری'
}

export function getEmployerProjectRequests(project: EmployerProject) {
  return {
    total: project.requests?.total ?? project.requests_total ?? 0,
    unseen: project.requests?.unseen ?? project.requests_unseen ?? 0,
    seen: project.requests?.seen ?? project.requests_seen ?? 0,
    confirmed: project.requests?.confirmed ?? project.requests_confirmed ?? 0,
    rejected: project.requests?.rejected ?? project.requests_rejected ?? 0,
  }
}

export function normalizeEmployerProjectStatus(
  project: EmployerProject,
): EmployerProjectStatus {
  if (project.expired) return 'expired'

  const status = (project.status ?? '').toLowerCase()
  if (status.includes('draft') || status.includes('پیش')) return 'draft'
  if (status.includes('expired') || status.includes('منقضی')) return 'expired'
  if (
    status.includes('under_review') ||
    status.includes('review') ||
    status.includes('بازبینی')
  ) {
    return 'under_review'
  }
  if (status.includes('unpublished') || status.includes('منتشر نشده')) {
    return 'unpublished'
  }
  if (status.includes('pending') || status.includes('در انتظار')) return 'pending'

  return 'published'
}

export function getEmployerProjectStatusMeta(project: EmployerProject) {
  const status = normalizeEmployerProjectStatus(project)

  const map: Record<
    EmployerProjectStatus,
    { label: string; className: string; dotClassName: string }
  > = {
    published: {
      label: 'منتشر شده',
      className: 'bg-[#E8F5E9] text-[#2E7D32]',
      dotClassName: 'bg-[#2E7D32]',
    },
    draft: {
      label: 'پیش‌نویس',
      className: 'bg-surface-100 text-text-passive',
      dotClassName: 'bg-text-passive',
    },
    expired: {
      label: 'منقضی شده',
      className: 'bg-[#FFF3E0] text-[#E65100]',
      dotClassName: 'bg-[#E65100]',
    },
    pending: {
      label: 'در انتظار تعیین وضعیت',
      className: 'bg-[#E5F5FD] text-[#0098E7]',
      dotClassName: 'bg-[#0098E7]',
    },
    unpublished: {
      label: 'منتشر نشده',
      className: 'bg-[#FDECEB] text-[#EF4035]',
      dotClassName: 'bg-[#EF4035]',
    },
    under_review: {
      label: 'در انتظار بازبینی اطلاعات',
      className: 'bg-[#FFF8E1] text-[#B95C04]',
      dotClassName: 'bg-[#B95C04]',
    },
  }

  return map[status]
}

export function getEmployerProjectStatItems(project: EmployerProject) {
  const stats = getEmployerProjectRequests(project)

  return [
    {
      label: 'دریافت شده',
      value: stats.total,
      icon: 'mdi:briefcase-download-outline',
      iconColor: '#4A4A4A',
      iconBgColor: '#F2F2F2',
    },
    {
      label: 'بررسی نشده',
      value: stats.unseen,
      icon: 'mdi:briefcase-search-outline',
      iconColor: '#0098E7',
      iconBgColor: '#E5F5FD',
      status: 35,
    },
    {
      label: 'تعیین وضعیت',
      value: stats.seen,
      icon: 'mdi:briefcase-clock-outline',
      iconColor: '#B95C04',
      iconBgColor: '#FFF3E8',
      status: 3,
    },
    {
      label: 'تایید برای مصاحبه',
      value: stats.confirmed,
      icon: 'material-symbols:check-circle-outline',
      iconColor: '#009F65',
      iconBgColor: '#E6F6F0',
      status: 10,
    },
    {
      label: 'رد شده',
      value: stats.rejected,
      icon: 'material-symbols:cancel-outline',
      iconColor: '#EF4035',
      iconBgColor: '#FDECEB',
      status: 11,
    },
  ]
}

export function getEmployerProjectsByFilter(
  groups: EmployerProjectsData,
  filter: EmployerProjectFilter,
) {
  if (filter === 'active') return groups.active
  if (filter === 'draft') return groups.draft
  if (filter === 'expired') return groups.expired
  return groups.total
}

export function countEmployerProjectsByFilter(
  groups: EmployerProjectsData,
  filter: EmployerProjectFilter,
) {
  return getEmployerProjectsByFilter(groups, filter).length
}
