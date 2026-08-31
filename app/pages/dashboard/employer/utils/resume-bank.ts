import type { EmployerAdRequest } from '~/types/employer-ad-request'
import type { ResumeBankUser } from '~/types/resume-bank'

export function resumeBankUserAsRequest(user: ResumeBankUser): EmployerAdRequest {
  return {
    id: user.id,
    user,
    is_bookmarked: user.is_bookmarked,
    work_experience: user.personal?.work_experience,
  }
}
