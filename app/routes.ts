export const paths = {
  root: '/',
  account: {
    root: '/account',
    signIn: '/account/sign-in',
    signUp: '/account/sign-up',
  },
  jobs: {
    root: '/jobs',
    detail: (id: string | number) => `/jobs/${id}`,
  },
};
