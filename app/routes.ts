import { jobCategoryPath } from '~/utils/job-category'
import { jobCityPath } from '~/utils/job-city'
import { jobDetailPath } from '~/utils/job-detail-path'

export const paths = {
  root: '/',
  login: '/login',
  entering: '/entering',
  dashboard: '/dashboard',
  jobs: {
    root: '/jobs',
    detail: jobDetailPath,
    category: jobCategoryPath,
    city: jobCityPath,
  },
  taxReturn: {
    root: '/tax-return',
    consultants: '/tax-return/consultants',
    termsAndConditions: '/tax-return/terms-and-conditions',
  },
  employer: {
    ads: '/dashboard/employer/ads',
    adsCreate: '/dashboard/employer/ads/create',
    resumeBank: '/dashboard/employer/resumes',
    taxReturnCreate: '/dashboard/tax-returns/create',
  },
  jobSeeker: {
    jobs: '/dashboard/jobs',
  },
};
