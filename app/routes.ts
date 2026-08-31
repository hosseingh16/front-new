export const paths = {
  root: '/',
  login: '/login',
  entering: '/entering',
  dashboard: '/dashboard',
  jobs: {
    root: '/jobs',
    detail: (id: string | number) => `/jobs/${id}`,
  },
  employer: {
    ads: '/dashboard/employer/ads',
    adsCreate: '/dashboard/employer/ads/create',
    resumeBank: '/dashboard/employer/resumes',
    taxReturnCreate: '/dashboard/tax-returns/create',
  },
  jobSeeker: {
    ads: '/dashboard/ad',
  },
};
