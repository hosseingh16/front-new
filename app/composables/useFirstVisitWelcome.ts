import type { ApiResponse } from '~/types/api'
import type { EmployerAdsData } from '~/types/employer-ad'
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
  const api = useApi()

  const welcomeAlert = useState<WelcomeAlertView | null>(
    'first-visit-welcome-alert',
    () => null,
  )

  const employerHasAds = useState<boolean | null>(
    'first-visit-welcome-employer-has-ads',
    () => null,
  )

  const isWelcomeVisible = computed(() => welcomeAlert.value != null)

  function currentUserId() {
    const id = user.value?.id
    if (id == null || id === '') return null
    return String(id)
  }

  function applyWelcomeAlert() {
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

  async function employerHasCreatedAd(): Promise<boolean> {
    if (employerHasAds.value != null) return employerHasAds.value

    try {
      const result = await api.get<ApiResponse<EmployerAdsData>>('/employers/ads')
      const total = result.data?.total
      const hasAds = Array.isArray(total) && total.length > 0
      employerHasAds.value = hasAds
      return hasAds
    } catch {
      return false
    }
  }

  async function syncWelcome() {
    const userId = currentUserId()
    if (
      !userId ||
      !isFirstVisitWelcomePending(userId) ||
      isFirstVisitWelcomeDismissed(userId)
    ) {
      welcomeAlert.value = null
      return
    }

    if (isEmployer.value) {
      const hasAds = await employerHasCreatedAd()
      if (hasAds) {
        dismissFirstVisitWelcome(userId)
        welcomeAlert.value = null
        return
      }

      if (
        currentUserId() !== userId ||
        !isFirstVisitWelcomePending(userId) ||
        isFirstVisitWelcomeDismissed(userId)
      ) {
        welcomeAlert.value = null
        return
      }
    }

    applyWelcomeAlert()
  }

  function dismissWelcome() {
    const userId = currentUserId()
    if (userId) dismissFirstVisitWelcome(userId)
    welcomeAlert.value = null
  }

  function markFirstAdCreated() {
    employerHasAds.value = true
    dismissWelcome()
  }

  function initWelcome() {
    if (!import.meta.client) return

    void syncWelcome()
    watch(
      [() => user.value?.id, isEmployer, () => route.path],
      () => {
        void syncWelcome()
      },
    )
  }

  return {
    welcomeAlert,
    isWelcomeVisible,
    dismissWelcome,
    markFirstAdCreated,
    syncWelcome,
    initWelcome,
  }
}
