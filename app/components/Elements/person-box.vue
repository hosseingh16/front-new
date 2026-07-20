<template>
  <div class="rounded-xl border border-surface-200 bg-[#F6F8FE] dark:bg-surface-200 p-4">
    <template v-if="loading">
      <div class="flex flex-col items-center">
        <div class="h-16 w-16 rounded-2xl bg-surface-200 animate-pulse" />
        <div class="mt-3 h-5 w-36 rounded bg-surface-200 animate-pulse" />
        <div class="mt-2 h-4 w-48 rounded bg-surface-200 animate-pulse" />
      </div>
      <div class="mt-4 space-y-2">
        <div class="h-8 w-full rounded-full bg-surface-200 animate-pulse" />
        <div class="h-8 w-full rounded-full bg-surface-200 animate-pulse" />
        <div class="h-8 w-full rounded-full bg-surface-200 animate-pulse" />
        <div class="h-8 w-full rounded-full bg-surface-200 animate-pulse" />
        <div class="h-8 w-full rounded-full bg-surface-200 animate-pulse" />
      </div>
      <div class="mt-4 flex justify-center">
        <div class="h-4 w-24 rounded bg-surface-200 animate-pulse" />
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center text-center">
        <div class="h-16 w-16 overflow-hidden rounded-2xl bg-[#c5dff5]">
          <img
            v-if="avatar"
            :src="avatar"
            :alt="name"
            class="h-full w-full object-cover"
          />
          <div
            v-else
            class="flex h-full w-full items-end justify-center bg-gradient-to-b from-[#c5dff5] to-[#9ec5e8]"
          >
            <div class="h-[85%] w-[70%] rounded-t-full bg-[#e8a4a4]" />
          </div>
        </div>

        <p class="mt-3 font-yb-bold text-base text-text-tertiary">{{ name }}</p>

        <div
          v-if="jobTitle"
          class="mt-2 flex items-center gap-1 text-sm text-text-passive"
        >
          <Icon name="ph:suitcase-simple-light" class="shrink-0" />
          <span>عنوان شغلی: {{ jobTitle }}</span>
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-2">
        <div
          v-if="employmentType"
          class="flex items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1.5 text-sm text-text-tertiary"
        >
          <Icon name="tabler:file-text" class="shrink-0 text-text-passive" />
          <span>{{ employmentType }}</span>
        </div>

        <div
          v-if="salary"
          class="flex items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1.5 text-sm text-text-tertiary"
        >
          <Icon name="svg:wallet" class="shrink-0" size="16" />
          <span>{{ salary }}</span>
        </div>

        <div
          v-if="experience"
          class="flex items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1.5 text-sm text-text-tertiary"
        >
          <Icon name="svg:work-history" class="shrink-0" />
          <span>{{ experience }}</span>
        </div>

        <div
          v-if="age"
          class="flex items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1.5 text-sm text-text-tertiary"
        >
          <Icon name="svg:timer" class="shrink-0" size="12" />
          <span>{{ age }}</span>
        </div>

        <div
          v-if="location"
          class="flex items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1.5 text-sm text-text-tertiary"
        >
          <Icon name="svg:location-4" class="shrink-0" />
          <span>{{ location }}</span>
        </div>
      </div>

      <NuxtLink
        v-if="to"
        :to="to"
        class="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
      >
        <Icon name="svg:eye" class="shrink-0" />
        <span>مشاهده رزومه</span>
      </NuxtLink>
      <div
        v-else
        class="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-500"
      >
        <Icon name="svg:eye" class="shrink-0" />
        <span>مشاهده رزومه</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name?: string;
    avatar?: string | null;
    jobTitle?: string;
    employmentType?: string;
    salary?: string;
    experience?: string;
    age?: string;
    provinceName?: string;
    cityName?: string;
    to?: string;
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const location = computed(() => {
  if (props.provinceName && props.cityName) {
    return `${props.provinceName}، ${props.cityName}`;
  }
  return props.provinceName || props.cityName || "";
});
</script>
