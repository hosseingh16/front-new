import type { DashboardStatusAlert } from '~/utils/user-status-alerts'

const WELCOME_ID = 'first-visit-welcome'

function matchesPath(path: string, base: string) {
  return path === base || path.startsWith(`${base}/`)
}

export function getFirstVisitWelcomePendingKey(userId: string): string {
  return `first-visit-welcome-${userId}-pending`
}

export function getFirstVisitWelcomeDismissedKey(userId: string): string {
  return `first-visit-welcome-${userId}-dismissed`
}

export function markFirstVisitWelcomePending(userId: string) {
  if (!import.meta.client) return
  sessionStorage.setItem(getFirstVisitWelcomePendingKey(userId), '1')
}

export function isFirstVisitWelcomePending(userId: string): boolean {
  if (!import.meta.client) return false
  return sessionStorage.getItem(getFirstVisitWelcomePendingKey(userId)) === '1'
}

export function isFirstVisitWelcomeDismissed(userId: string): boolean {
  if (!import.meta.client) return false
  return localStorage.getItem(getFirstVisitWelcomeDismissedKey(userId)) === '1'
}

export function dismissFirstVisitWelcome(userId: string) {
  if (!import.meta.client) return
  localStorage.setItem(getFirstVisitWelcomeDismissedKey(userId), '1')
  sessionStorage.removeItem(getFirstVisitWelcomePendingKey(userId))
}

export function getFirstVisitWelcome(options: {
  isEmployer: boolean
  currentPath: string
}): DashboardStatusAlert {
  if (options.isEmployer) {
    const onCreatePage = matchesPath(
      options.currentPath,
      '/dashboard/employer/ads/create',
    )

    return {
      id: WELCOME_ID,
      type: 'info',
      message: 'خوش آمدید! قدم بعدی: ایجاد اولین آگهی',
      actionLabel: onCreatePage ? 'شروع کنید' : 'ایجاد آگهی',
      actionTo: onCreatePage ? undefined : '/dashboard/employer/ads/create',
      actionIcon: 'lucide:briefcase',
      dismissible: true,
    }
  }

  const onCvPage = matchesPath(options.currentPath, '/dashboard/cv')

  return {
    id: WELCOME_ID,
    type: 'info',
    message: 'خوش آمدید! قدم بعدی: تکمیل رزومه',
    actionLabel: onCvPage ? 'شروع کنید' : 'تکمیل رزومه',
    actionTo: onCvPage ? undefined : '/dashboard/cv',
    actionIcon: 'lucide:file-user',
    dismissible: true,
  }
}
