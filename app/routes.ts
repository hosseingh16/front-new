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
    adsCreate: '/dashboard/employer/ads/create',
    taxReturnCreate: '/dashboard/tax-returns/create',
  },
  jobSeeker: {
    ads: '/dashboard/ad',
  },
};
