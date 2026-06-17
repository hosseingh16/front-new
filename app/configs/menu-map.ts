import type { MenuItem } from '~/types/panel-config';

export const menuMap: Record<string, MenuItem> = {
  dashboard: {
    label: 'پیشخوان',
    icon: 'gauge-1',
    to: '/dashboard',
  },
  'job-resumes': {
    label: 'رزومه‌های شغلی',
    icon: 'search-briefcase',
    to: '/dashboard/resumes',
  },
  'my-resume': {
    label: 'رزومه من',
    icon: 'work-history',
    to: '/dashboard/my-resume',
  },
  'organization-resume': {
    label: 'رزومه سازمان',
    icon: 'buildings-5',
    to: '/resumes/org',
  },
  jobs: {
    label: 'آگهی‌ها',
    icon: 'bag-3',
    to: '/jobs',
  },
  'bookmarked-jobs': {
    label: 'نشان شده‌ها',
    icon: 'bookmark-1',
    to: '/jobs/bookmarked',
  },
  'applied-jobs': {
    label: 'ارسال شده‌ها',
    icon: 'i-heroicons-check-circle',
    to: '/jobs/applied',
  },
  projdects: {
    label: 'پروژه‌ها',
    icon: 'projects-1',
    to: '/projects',
  },
} as const;
