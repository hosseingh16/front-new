import type { UserStatusPayload } from '~/types/user-status'

export type DashboardStatusAlertType = 'warning' | 'info' | 'error'

export type DashboardStatusAlert = {
  id: string
  type: DashboardStatusAlertType
  message: string
  actionLabel?: string
  actionTo?: string
  dismissible?: boolean
}

function isEmployer(status: UserStatusPayload): boolean {
  const { user } = status
  return user.roles.includes('employer') || user.type === 'employer'
}

function isJobSeeker(status: UserStatusPayload): boolean {
  const { user } = status
  return user.roles.includes('jobseeker') || user.type === 'jobseeker'
}

export function getDashboardStatusAlert(
  status: UserStatusPayload,
): DashboardStatusAlert | null {
  if (status.user.is_deactivated) {
    return {
      id: 'account-deactivated',
      type: 'error',
      message: 'حساب کاربری شما غیرفعال شده است.',
      dismissible: false,
    }
  }

  if (isEmployer(status) && status.company.completion < 100) {
    return {
      id: 'company-profile-incomplete',
      type: 'warning',
      message: 'با تکمیل «پروفایل سازمان»، از همه امکانات استفاده کنید.',
      actionLabel: 'تکمیل پروفایل',
      actionTo: '/dashboard/employer/company',
      dismissible: true,
    }
  }

  if (isJobSeeker(status) && status.resume.completion < 100) {
    return {
      id: 'resume-incomplete',
      type: 'warning',
      message: 'برای افزایش شانس استخدام، رزومه خود را تکمیل کنید.',
      actionLabel: 'تکمیل رزومه',
      actionTo: '/dashboard/cv',
      dismissible: true,
    }
  }

  if (status.profile.completion < 100) {
    return {
      id: 'profile-incomplete',
      type: 'info',
      message:
        'برای استفاده بهتر از های‌حساب، اطلاعات حساب کاربری خود را تکمیل کنید.',
      dismissible: true,
    }
  }

  return null
}

export function getDashboardStatusAlertStorageKey(id: string): string {
  return `dashboard-status-alert-${id}-dismissed`
}
