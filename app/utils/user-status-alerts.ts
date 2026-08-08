import type { UserStatusPayload } from '~/types/user-status'
import { isEmployerUser, isJobSeekerUser } from '~/utils/user-role'

export type DashboardStatusAlertType = 'warning' | 'info' | 'error'

export type DashboardStatusAlert = {
  id: string
  type: DashboardStatusAlertType
  message: string
  actionLabel?: string
  actionTo?: string
  actionIcon?: string
  dismissible?: boolean
}

function isEmployer(status: UserStatusPayload): boolean {
  return isEmployerUser({
    type: status.user.type,
    roles: status.user.roles,
  })
}

function isJobSeeker(status: UserStatusPayload): boolean {
  return isJobSeekerUser({
    type: status.user.type,
    roles: status.user.roles,
  })
}

/**
 * Build the single dashboard status alert for the current role.
 * Employer and jobseeker stacks are intentionally different.
 */
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

  if (isEmployer(status)) {
    if (status.company.completion < 100) {
      return {
        id: 'company-profile-incomplete',
        type: 'warning',
        message: 'با تکمیل «پروفایل سازمان»، از همه امکانات استفاده کنید.',
        actionLabel: 'تکمیل پروفایل',
        actionTo: '/dashboard/employer/company',
        actionIcon: 'lucide:building',
        dismissible: true,
      }
    }

    if (status.profile.completion < 100) {
      return {
        id: 'employer-profile-incomplete',
        type: 'info',
        message:
          'برای استفاده بهتر از های‌حساب، اطلاعات حساب کاربری خود را تکمیل کنید.',
        dismissible: true,
      }
    }

    return null
  }

  if (isJobSeeker(status)) {
    if (status.resume.completion < 100) {
      return {
        id: 'resume-incomplete',
        type: 'warning',
        message: 'برای افزایش شانس استخدام، رزومه خود را تکمیل کنید.',
        actionLabel: 'تکمیل رزومه',
        actionTo: '/dashboard/cv',
        actionIcon: 'lucide:file-user',
        dismissible: true,
      }
    }

    if (status.profile.completion < 100) {
      return {
        id: 'jobseeker-profile-incomplete',
        type: 'info',
        message:
          'برای استفاده بهتر از های‌حساب، اطلاعات حساب کاربری خود را تکمیل کنید.',
        dismissible: true,
      }
    }

    return null
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
