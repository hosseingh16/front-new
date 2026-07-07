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

export const usePanelConfig = () => {
  const api = useApi()

  // -----------------------------
  // SSR-safe state (prevents undefined crash)
  // -----------------------------
  const rawConfig = useState<PanelConfig>('panel-config', () => ({
    navigation: {
      sidebar: [],
      userMenu: [],
      shortcuts: [],
    },
    permissions: [],
  }))

  const initialized = useState('panel-initialized', () => false)

  // -----------------------------
  // Fetch bootstrap
  // -----------------------------
  const fetchMenu = async () => {
   
    initialized.value = false
    if (initialized.value) return

      const res = await api.get('/panel/bootstrap') as any

  

    rawConfig.value = res.panel
      initialized.value = true
    }

  // -----------------------------
  // Recursive resolver (backend tree → UI tree)
  // -----------------------------
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
      children: children?.length ? children : undefined,
    }
  }

  // -----------------------------
  // Sidebar
  // -----------------------------
  const sidebarMenu = computed<MenuItem[]>(() => {
    const nav = rawConfig.value?.navigation

    if (!nav?.sidebar) return []

    return nav.sidebar
      .map(resolveMenuItem)
      .filter(Boolean) as MenuItem[]
  })

  // -----------------------------
  // User menu
  // -----------------------------
  const userMenu = computed<MenuItem[]>(() => {
    const nav = rawConfig.value?.navigation

    if (!nav?.userMenu) return []

    return nav.userMenu
      .map(resolveMenuItem)
      .filter(Boolean) as MenuItem[]
  })

  // -----------------------------
  // Shortcuts
  // -----------------------------
  const shortcuts = computed<MenuItem[]>(() => {
    const nav = rawConfig.value?.navigation

    if (!nav?.shortcuts) return []

    return nav.shortcuts
      .map(resolveMenuItem)
      .filter(Boolean) as MenuItem[]
  })

  // -----------------------------
  // Permissions
  // -----------------------------
  const permissions = computed(() => {
    return rawConfig.value?.permissions ?? []
  })

  // -----------------------------
  // Public API
  // -----------------------------
  return {
    fetchMenu,
    sidebarMenu,
    userMenu,
    shortcuts,
    permissions,
  }
}