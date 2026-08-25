export const paths = {
  root: '/',
  login: '/login',
  entering: '/entering',
  dashboard: '/dashboard',
  jobs: {
    root: '/jobs',
    detail: (id: string | number) => `/jobs/${id}`,
  },
};
