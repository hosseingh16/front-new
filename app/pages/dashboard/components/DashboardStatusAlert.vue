<template>
  <div
    class="flex items-center gap-3 rounded-2xl border px-4 py-3 md:items-center md:px-5"
    :class="variantClasses.container"
  >
    <div
      class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex min-w-0 items-start gap-2.5">
        <Icon
          :name="variantClasses.icon"
          size="18"
          class="mt-0.5 shrink-0"
          :class="variantClasses.iconColor"
        />
        <p class="text-sm leading-7 text-text-secondary">
          {{ message }}
        </p>
      </div>

      <div v-if="actionLabel || dismissible" class="flex items-center gap-2">
        <NuxtLink
          v-if="actionLabel && actionTo"
          :to="actionTo"
          class="btn btn-ghost h-9 min-h-9 shrink-0 gap-2 px-3 text-sm font-semibold"
          :class="variantClasses.action"
        >
          <Icon v-if="type === 'warning'" name="lucide:building" size="18" />
          {{ actionLabel }}
        </NuxtLink>

        <button
          v-if="dismissible"
          type="button"
          class="mt-0.5 flex shrink-0 cursor-pointer justify-center text-text-passive transition-colors hover:text-text-secondary md:mt-0"
          aria-label="بستن"
          @click="emit('dismiss')"
        >
          <Icon name="material-symbols:close" size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DashboardStatusAlertType } from '~/utils/user-status-alerts'

const props = withDefaults(
  defineProps<{
    type: DashboardStatusAlertType
    message: string
    actionLabel?: string
    actionTo?: string
    dismissible?: boolean
  }>(),
  {
    dismissible: true,
  },
)

const emit = defineEmits<{
  dismiss: []
}>()

const variantClasses = computed(() => {
  switch (props.type) {
    case 'error':
      return {
        container: 'border-danger-200 bg-danger-100',
        icon: 'lucide:circle-alert',
        iconColor: 'text-danger-500',
        action:
          'border border-danger-200 bg-surface-card text-danger-500 hover:bg-danger-100',
      }
    case 'info':
      return {
        container: 'border-primary-200 bg-primary-50',
        icon: 'lucide:info',
        iconColor: 'text-info-500',
        action:
          'border border-primary-200 bg-surface-card text-primary-500 hover:bg-primary-100',
      }
    default:
      return {
        container: 'border-warning-200 bg-warning-100',
        icon: 'lucide:triangle-alert',
        iconColor: 'text-warning-500',
        action:
          'border border-warning-300 bg-warning-400 text-surface-card hover:bg-warning-500',
      }
  }
})
</script>
