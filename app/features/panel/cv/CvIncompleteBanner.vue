<template>
  <div
    class="flex items-center gap-3 rounded-2xl border border-warning-200 bg-warning-100 px-4 py-3 md:px-5"
  >
    <div
      class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E5]"
      aria-hidden="true"
    >
      <Icon name="svg:warning" size="20" />
    </div>

    <div
      class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm leading-7 text-text-secondary">
        برای ارسال رزومه، تکمیل حداقل اطلاعات پایه الزامیست.
      </p>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/dashboard/ad"
          class="btn btn-ghost h-9 min-h-9 shrink-0 gap-2 border border-warning-300 bg-warning-400 px-3 text-sm font-semibold text-surface-card hover:bg-warning-500"
        >
          <Icon name="svg:jobs" size="18" />
          فرصت‌های شغلی
        </NuxtLink>

        <button
          type="button"
          class="flex shrink-0 cursor-pointer justify-center text-text-passive transition-colors hover:text-text-secondary"
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
const emit = defineEmits<{
  dismiss: [];
}>();
</script>
