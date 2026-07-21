<template>
  <div
    class="flex items-center gap-3 rounded-2xl border border-warning-200 bg-warning-100 px-4 py-3 md:items-center md:px-5"
  >
    <div
      class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm leading-7 text-text-secondary">
        با تکمیل «پروفایل سازمان»، از همه امکانات استفاده کنید.
      </p>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/dashboard/employer/company"
          class="btn btn-ghost h-9 min-h-9 shrink-0 gap-2 border border-warning-300 bg-warning-400 text-surface-card px-3 text-sm font-semibold hover:bg-warning-500"
        >
          <Icon name="lucide:building" size="18" />
          تکمیل پروفایل
        </NuxtLink>

        <button
          type="button"
          class="mt-0.5 shrink-0 cursor-pointer text-text-passive transition-colors hover:text-text-secondary md:mt-0 flex justify-center"
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
