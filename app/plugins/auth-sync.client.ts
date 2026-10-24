import { paths } from '~/routes'

const LOGOUT_KEY = 'hihesab:auth:logout'
const LOGIN_KEY = 'hihesab:auth:login'

function broadcastAuthEvent(key: string) {
  localStorage.setItem(key, String(Date.now()))
  localStorage.removeItem(key)
}

export default defineNuxtPlugin((nuxtApp) => {
  const { user, isAuthenticated } = useSanctumAuth()
  const { ensureIdentity, noteAuthenticatedIdentity, noteGuestIdentity } =
    useAuthIdentity()

  function redirectToLogin() {
    if (window.location.pathname === paths.login) return
    return nuxtApp.runWithContext(() =>
      navigateTo(paths.login, { replace: true }),
    )
  }

  // The document may have been rendered as a guest before another tab set
  // hihesab_auth=1. Wait until after hydration, then load the user.
  if (readAuthHint() === '1' && user.value == null) {
    nuxtApp.hook('app:mounted', () => {
      void nuxtApp.runWithContext(() => ensureIdentity({ force: true }))
    })
  }

  window.addEventListener('storage', (event) => {
    if (!event.newValue) return

    if (event.key === LOGOUT_KEY && user.value) {
      noteGuestIdentity()
      redirectToLogin()
      return
    }

    if (event.key === LOGIN_KEY && !isAuthenticated.value) {
      void nuxtApp.runWithContext(() => ensureIdentity({ force: true }))
    }
  })

  nuxtApp.hook('sanctum:logout', () => {
    noteGuestIdentity()
    broadcastAuthEvent(LOGOUT_KEY)
  })

  nuxtApp.hook('sanctum:login', () => {
    noteAuthenticatedIdentity()
    broadcastAuthEvent(LOGIN_KEY)
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !isAuthenticated.value) return

    void nuxtApp.runWithContext(async () => {
      const outcome = await ensureIdentity({ force: true })
      if (outcome === 'guest') await redirectToLogin()
    })
  })
})
