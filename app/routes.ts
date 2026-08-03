export const paths = {
  root: '/',
  login: '/login',
  jobs: {
    root: '/jobs',
    detail: (id: string | number) => `/jobs/${id}`,
  },
};
