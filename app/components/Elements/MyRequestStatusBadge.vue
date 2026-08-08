<template>
  <span
    class="inline-flex h-8 items-center gap-1 rounded-xl px-2 text-sm font-semibold"
    :class="meta.className"
  >
    <span
      class="inline-block size-2 shrink-0 rounded-full"
      :class="meta.dotClassName"
    />
    {{ meta.label }}
  </span>
</template>

<script setup lang="ts">
import type { MyRequestStatus } from '~/types/my-request'
import { getMyRequestStatusMeta } from '~/pages/dashboard/utils/my-request'

const props = defineProps<{
  status: MyRequestStatus
}>()

const meta = computed(() => getMyRequestStatusMeta(props.status))
</script>
