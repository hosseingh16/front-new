<template>
  <div class="rounded-2xl bg-surface-50 p-6">
    <div class="flex items-center justify-between gap-4">
      <NuxtLink
        to="/dashboard/cv"
        class="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary transition-opacity hover:opacity-80"
        aria-label="بستن"
      >
        <Icon name="svg:close" size="20" />
      </NuxtLink>

      <div class="flex items-center gap-1">
        <span
          class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
          aria-hidden="true"
        />
        <h1 class="font-yb-bold text-xl text-text-primary md:text-2xl">
          رزومه از دید کارفرما
        </h1>
      </div>
    </div>

    <UserResumeDetailContent
      class="mt-4"
      :user="resumeUser"
      :show-bookmark="false"
      show-full-contact
      embedded
    />
  </div>
</template>

<script setup lang="ts">
import UserResumeDetailContent from "~/pages/users/components/UserResumeDetailContent.vue";
import { mapCurrentUserToResume } from "~/pages/users/utils/user-resume";

definePageMeta({
  layout: "dashboard",
});

const { user } = useCurrentUser();

const resumeUser = computed(() => mapCurrentUserToResume(user.value));
</script>
