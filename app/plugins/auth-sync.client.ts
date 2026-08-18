import { paths } from '~/routes'

const LOGOUT_KEY = 'hihesab:auth:logout'
const LOGIN_KEY = 'hihesab:auth:login'

function broadcastAuthEvent(key: string) {
  localStorage.setItem(key, String(Date.now()))
  localStorage.removeItem(key)
}

export default defineNuxtPlugin((nuxtApp) => {
  const { user, isAuthenticated, refreshIdentity } = useSanctumAuth()

  function redirectToLogin() {
    if (window.location.pathname === paths.login) return
    return nuxtApp.runWithContext(() =>
      navigateTo(paths.login, { replace: true }),
    )
  }

  window.addEventListener('storage', (event) => {
    if (!event.newValue) return

    if (event.key === LOGOUT_KEY && user.value) {
      user.value = null
      redirectToLogin()
      return
    }

    if (event.key === LOGIN_KEY && !isAuthenticated.value) {
      nuxtApp.runWithContext(() => refreshIdentity().catch(() => {}))
    }
  })

  nuxtApp.hook('sanctum:logout', () => {
    broadcastAuthEvent(LOGOUT_KEY)
  })

  nuxtApp.hook('sanctum:login', () => {
    broadcastAuthEvent(LOGIN_KEY)
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !isAuthenticated.value) return

    nuxtApp.runWithContext(async () => {
      try {
        await refreshIdentity()
      } catch {
        await redirectToLogin()
        return
      }

      if (!isAuthenticated.value) {
        await redirectToLogin()
      }
    })
  })
})
