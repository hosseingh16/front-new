const SIDEBAR_COLLAPSED_KEY = 'dashboard-sidebar-collapsed'

export function useDashboardSidebar() {
  const collapsed = useState(SIDEBAR_COLLAPSED_KEY, () => false)

  function toggle() {
    collapsed.value = !collapsed.value
  }

  function expand() {
    collapsed.value = false
  }

  function collapse() {
    collapsed.value = true
  }

  return {
    collapsed,
    toggle,
    expand,
    collapse,
  }
}
