<template>
  <div dir="rtl" class="min-h-screen bg-surface-50">
    <PublicCvActionBar
      v-if="!error"
      :slug="slug"
      :title="user?.name"
    />

    <div class="custom-pad mx-auto max-w-384 py-6 md:py-10">
      <div class="rounded-2xl bg-white p-6">
        <p
          v-if="error"
          class="py-12 text-center text-sm text-error"
        >
          {{ error }}
        </p>

        <UserResumeDetailContent
          v-else
          :user="user"
          :loading="loading"
          :show-bookmark="false"
          :show-share="false"
          show-full-contact
          embedded
        />
      </div>

      <p class="mt-8 text-center text-xs leading-6 text-text-passive">
        ساخته شده توسط
        <NuxtLink
          to="/"
          class="text-primary-500 transition-opacity hover:opacity-80"
        >
          های‌حساب
        </NuxtLink>
        -
        {{ copyrightYear }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PublicCvActionBar from "./components/PublicCvActionBar.vue";
import UserResumeDetailContent from "~/pages/users/components/UserResumeDetailContent.vue";

definePageMeta({
  layout: false,
});

const { setForcedTheme } = useAppTheme();
setForcedTheme("light");
onUnmounted(() => {
  setForcedTheme(null);
});

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));

const { user, loading, error } = usePublicCv(slug);

const copyrightYear = computed(() => {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
    }).format(new Date());
  } catch {
    return "۱۴۰۵";
  }
});

useSeoMeta({
  title: () =>
    user.value?.name ? `رزومه | ${user.value.name}` : "رزومه کارجو",
  description: () =>
    user.value?.resume_personal?.about ||
    user.value?.description ||
    "مشاهده رزومه از دید کارفرما",
});
</script>
