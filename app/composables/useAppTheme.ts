import type { ThemeType } from '~/types/theme'

const THEME_COOKIE = 'hihesab-theme'

function isThemeType(value: unknown): value is ThemeType {
  return value === 'system' || value === 'light' || value === 'dark'
}

function getSystemTheme(): 'light' | 'dark' {
  if (!import.meta.client) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useAppTheme() {
  const preference = useCookie<ThemeType>(THEME_COOKIE, {
    default: () => 'light',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  if (!isThemeType(preference.value)) {
    preference.value = 'light'
  }

  const systemTheme = useState<'light' | 'dark'>(
    'app-system-theme',
    () => 'light',
  )

  const resolved = computed<'light' | 'dark'>(() => {
    if (preference.value === 'system') return systemTheme.value
    return preference.value === 'dark' ? 'dark' : 'light'
  })

  const isDark = computed(() => resolved.value === 'dark')

  function setTheme(value: ThemeType) {
    preference.value = value
  }

  function applyToDocument() {
    if (!import.meta.client) return
    const root = document.documentElement
    root.classList.toggle('dark', isDark.value)
    root.dataset.theme = resolved.value
    root.style.colorScheme = resolved.value
  }

  const watchersReady = useState('app-theme-watchers-ready', () => false)

  if (import.meta.client && !watchersReady.value) {
    watchersReady.value = true
    systemTheme.value = getSystemTheme()

    watch(resolved, applyToDocument, { immediate: true })

    onMounted(() => {
      systemTheme.value = getSystemTheme()
      applyToDocument()

      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const onChange = () => {
        systemTheme.value = getSystemTheme()
      }
      media.addEventListener('change', onChange)
      onUnmounted(() => media.removeEventListener('change', onChange))
    })
  }

  return {
    preference,
    resolved,
    isDark,
    setTheme,
  }
}
