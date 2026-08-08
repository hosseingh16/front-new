export const paths = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  jobs: {
    root: '/jobs',
    detail: (id: string | number) => `/jobs/${id}`,
  },
};
