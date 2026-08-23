<template>
  <div class="flex w-full flex-col items-center gap-5 px-4 min-[560px]:w-140">
    <EnteringLoader v-if="!error" />

    <p class="text-center font-yb-bold text-xl">{{ message }}</p>

    <div v-if="error" class="space-y-4 text-center">
      <p class="text-sm text-error">{{ error }}</p>
      <button type="button" class="btn btn-primary h-10" @click="retry">
        تلاش مجدد
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

const route = useRoute()
const { isAuthenticated, refreshIdentity } = useSanctumAuth()
const { updateUserRole, userId: authUserId } = useAccountAuth()
const { fetchMenu } = usePanelConfig()
const { user, refreshUser } = useCurrentUser()

const parsed = parseEnteringQuery(route.query)
const message = ref(
  enteringMessageForDestination(parsed?.destination ?? paths.dashboard),
)
const error = ref('')

async function ensureAuth() {
  if (!isAuthenticated.value) {
    try {
      await refreshIdentity()
    } catch {
      // still unauthenticated
    }
  }

  if (!isAuthenticated.value) {
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

  await refreshUser()

  const work = async () => {
    if (role && !resolvePrimaryRole(user.value)) {
      await updateUserRole(role as AccountRole)
      await refreshUser()
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

async function retry() {
  try {
    await runTransition()
  } catch {
    error.value = 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.'
  }
}

onMounted(async () => {
  if (!(await ensureAuth())) return

  try {
    await runTransition()
  } catch {
    error.value = 'ورود ناموفق بود. لطفاً دوباره تلاش کنید.'
  }
})
</script>
