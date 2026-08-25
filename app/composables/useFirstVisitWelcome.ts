import type { DashboardStatusAlert } from '~/utils/user-status-alerts'
import {
  dismissFirstVisitWelcome,
  getFirstVisitWelcome,
  isFirstVisitWelcomeDismissed,
  isFirstVisitWelcomePending,
} from '~/utils/first-visit-welcome'

type WelcomeAlertView = Omit<DashboardStatusAlert, 'id'>

export function useFirstVisitWelcome() {
  const { user, isEmployer } = useCurrentUser()
  const route = useRoute()

  const welcomeAlert = useState<WelcomeAlertView | null>(
    'first-visit-welcome-alert',
    () => null,
  )

  const isWelcomeVisible = computed(() => welcomeAlert.value != null)

  function currentUserId() {
    const id = user.value?.id
    if (id == null || id === '') return null
    return String(id)
  }

  function syncWelcome() {
    const userId = currentUserId()
    if (
      !userId ||
      !isFirstVisitWelcomePending(userId) ||
      isFirstVisitWelcomeDismissed(userId)
    ) {
      welcomeAlert.value = null
      return
    }

    const alert = getFirstVisitWelcome({
      isEmployer: isEmployer.value,
      currentPath: route.path,
    })

    welcomeAlert.value = {
      type: alert.type,
      message: alert.message,
      actionLabel: alert.actionLabel,
      actionTo: alert.actionTo,
      actionIcon: alert.actionIcon,
      dismissible: alert.dismissible,
    }
  }

  function dismissWelcome() {
    const userId = currentUserId()
    if (userId) dismissFirstVisitWelcome(userId)
    welcomeAlert.value = null
  }

  function initWelcome() {
    if (!import.meta.client) return

    syncWelcome()
    watch(
      [() => user.value?.id, isEmployer, () => route.path],
      syncWelcome,
    )
  }

  return {
    welcomeAlert,
    isWelcomeVisible,
    dismissWelcome,
    syncWelcome,
    initWelcome,
  }
}
