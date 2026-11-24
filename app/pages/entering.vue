<template>
  <div class="flex w-full flex-col items-center gap-5 px-4 min-[560px]:w-140">
    <EnteringLoader v-if="!error" />

    <p class="text-center font-yb-bold text-xl">{{ message }}</p>

    <div v-if="error" class="space-y-4 text-center">
      <p class="text-sm text-error">{{ error }}</p>
      <p class="text-sm text-text-tertiary">{{ supportContactHint() }}</p>
      <button
        type="button"
        class="btn btn-primary h-10"
        :disabled="resetting"
        @click="clearSessionAndGoToLogin({ notify: false })"
      >
        بازگشت به ورود
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import EnteringLoader from '~/features/account/components/EnteringLoader.vue'
import type { AccountRole } from '~/features/account/types'
import {
  enteringMessageForDestination,
  parseEnteringQuery,
} from '~/utils/entering-route'
import { markFirstVisitWelcomePending } from '~/utils/first-visit-welcome'
import { resolvePrimaryRole } from '~/utils/user-role'
import { paths } from '~/routes'

definePageMeta({
  layout: 'auth',
})

const MIN_DISPLAY_MS = 400
const LOGOUT_TIMEOUT_MS = 3000
const FALLBACK_ERROR = 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.'

const route = useRoute()
const { $toast } = useNuxtApp()
const { logout } = useSanctumAuth()
const { contactPhones } = useSettings()
const { ensureIdentity, unavailableMessage, noteGuestIdentity } =
  useAuthIdentity()
const {
  updateUserRole,
  userId: authUserId,
  reset: resetAccountAuth,
} = useAccountAuth()
const { fetchMenu } = usePanelConfig()
const { user } = useCurrentUser()

const parsed = parseEnteringQuery(route.query)
const message = ref(
  enteringMessageForDestination(parsed?.destination ?? paths.dashboard),
)
const error = ref('')
const resetting = ref(false)

function supportContactHint() {
  const phone = contactPhones.value[0]
  return phone
    ? `در صورت ادامه مشکل با پشتیبانی تماس بگیرید: \u200E${phone}`
    : 'در صورت ادامه مشکل با پشتیبانی تماس بگیرید.'
}

async function clearSessionAndGoToLogin(options?: { notify?: boolean }) {
  if (resetting.value) return
  resetting.value = true

  const shouldNotify = options?.notify !== false

  // Clear local session immediately so a hung logout API cannot leave the
  // user stuck authenticated on this page.
  noteGuestIdentity()
  resetAccountAuth()

  try {
    await Promise.race([
      logout(),
      new Promise<void>((resolve) => {
        setTimeout(resolve, LOGOUT_TIMEOUT_MS)
      }),
    ])
  } catch {
    // Session may already be invalid.
  }

  await navigateTo(paths.login, { replace: true })

  // Show after navigation so the URL change does not dismiss it.
  if (shouldNotify) {
    $toast.error(`${FALLBACK_ERROR} ${supportContactHint()}`, {
      autoClose: 12000,
      clearOnUrlChange: false,
    })
  }

  resetting.value = false
}

async function ensureAuth() {
  const outcome = await ensureIdentity({ ignoreGuestHint: true })

  if (outcome === 'unavailable') {
    error.value = unavailableMessage
    return false
  }

  if (outcome !== 'auth') {
    await navigateTo(
      { path: paths.login, query: { redirect: route.fullPath } },
      { replace: true },
    )
    return false
  }

  return true
}

async function runTransition() {
  error.value = ''

  const parsed = parseEnteringQuery(route.query)
  if (!parsed) {
    await navigateTo(paths.dashboard, { replace: true })
    return
  }

  const { destination, role, forwardQuery } = parsed

  const work = async () => {
    if (role && !resolvePrimaryRole(user.value)) {
      await updateUserRole(role as AccountRole, { silent: true })

      if (!resolvePrimaryRole(user.value)) {
        throw new Error('role-assignment-failed')
      }
    }

    if (destination.startsWith('/dashboard')) {
      await fetchMenu(true)
    }
  }

  await Promise.all([work(), new Promise((r) => setTimeout(r, MIN_DISPLAY_MS))])

  const userId = user.value?.id ?? authUserId.value
  if (userId != null && userId !== '') {
    markFirstVisitWelcomePending(String(userId))
  }

  await navigateTo(
    { path: destination, query: forwardQuery },
    { replace: true },
  )
}

async function bootstrap() {
  try {
    if (!(await ensureAuth())) return
    await runTransition()
  } catch {
    await clearSessionAndGoToLogin()
  }
}

onMounted(() => {
  void bootstrap()
})
</script>
