<template>
  <div
    class="flex items-start gap-3 rounded-2xl border border-[#F5D5B8] bg-[#FFF4EC] px-4 py-3 md:items-center md:px-5"
  >
    <button
      type="button"
      class="mt-0.5 shrink-0 cursor-pointer text-text-passive transition-colors hover:text-text-secondary md:mt-0"
      aria-label="بستن"
      @click="emit('dismiss')"
    >
      <Icon name="material-symbols:close" size="18" />
    </button>

    <div class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm leading-7 text-text-secondary">
        با تکمیل «رزومه سازمان»، از همه امکانات استفاده کنید.
      </p>

      <NuxtLink
        to="/dashboard/employer/company"
        class="btn btn-ghost h-9 min-h-9 shrink-0 gap-2 border border-[#F0C9A8] bg-white px-3 text-sm font-semibold text-[#C56A1A] hover:bg-[#FFF8F2]"
      >
        <Icon name="svg:illust-bag-c" size="18" />
        تکمیل رزومه
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  dismiss: []
}>()
</script>
