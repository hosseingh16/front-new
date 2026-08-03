import { menuMap } from '~/configs/menu-map'
import type { MenuItem } from '~/types/panel-config'

type BackendMenuItem = {
  key: string
  children?: BackendMenuItem[]
}

type PanelConfig = {
  navigation: {
    sidebar: BackendMenuItem[]
    userMenu: BackendMenuItem[]
    shortcuts: BackendMenuItem[]
  }
  permissions: string[]
}

const emptyConfig = (): PanelConfig => ({
  navigation: {
    sidebar: [],
    userMenu: [],
    shortcuts: [],
  },
  permissions: [],
})

export const usePanelConfig = () => {
  const api = useApi()

  const rawConfig = useState<PanelConfig>('panel-config', emptyConfig)
  const initialized = useState('panel-initialized', () => false)

  /**
   * Fetch panel bootstrap. Returns false when the request fails
   * (e.g. user has no role and PanelResolver throws).
   */
  const fetchMenu = async (): Promise<boolean> => {
    try {
      const res = (await api.get('/panel/bootstrap')) as any
      rawConfig.value = res?.panel ?? emptyConfig()
      initialized.value = true
      return true
    } catch {
      rawConfig.value = emptyConfig()
      initialized.value = false
      return false
    }
  }

  const resolveMenuItem = (item: BackendMenuItem): MenuItem | null => {
    const meta = menuMap[item.key]
    if (!meta) return null

    const children = item.children
      ?.map(resolveMenuItem)
      .filter(Boolean) as MenuItem[] | undefined

    return {
      key: item.key,
      label: meta.label,
      icon: meta.icon,
      to: meta.to,
      placement: meta.placement ?? 'top',
      children: children?.length ? children : undefined,
    }
  }

  const sidebarMenu = computed<MenuItem[]>(() => {
    const nav = rawConfig.value?.navigation
    if (!nav?.sidebar) return []
    return nav.sidebar.map(resolveMenuItem).filter(Boolean) as MenuItem[]
  })

  const userMenu = computed<MenuItem[]>(() => {
    const nav = rawConfig.value?.navigation
    if (!nav?.userMenu) return []
    return nav.userMenu.map(resolveMenuItem).filter(Boolean) as MenuItem[]
  })

  const shortcuts = computed<MenuItem[]>(() => {
    const nav = rawConfig.value?.navigation
    if (!nav?.shortcuts) return []
    return nav.shortcuts.map(resolveMenuItem).filter(Boolean) as MenuItem[]
  })

  const permissions = computed(() => rawConfig.value?.permissions ?? [])

  return {
    fetchMenu,
    sidebarMenu,
    userMenu,
    shortcuts,
    permissions,
  }
}
