<template>
  <div class="bg-surface-50 pb-12">
    <div class="custom-pad mx-auto pt-6">
      <nav class="text-sm text-text-passive">
        <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
          <Icon name="svg:home" size="16" />
        </NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/jobs" class="hover:text-primary-500 transition-colors">
          رزومه‌های شغلی
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="hover:text-primary-500 transition-colors">کارجویان</span>
        <span class="mx-2">/</span>
        <span class="text-text-tertiary">{{ user?.name ?? 'کارجو' }}</span>
      </nav>

      <p
        v-if="error"
        class="mt-8 py-12 text-center text-sm text-error"
      >
        {{ error }}
      </p>

      <UserResumeDetailContent
        v-else
        :user="user"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserResumeDetailContent from './components/UserResumeDetailContent.vue'

const route = useRoute()
const userId = computed(() => String(route.params.id ?? ''))

const { user, loading, error } = useUser(userId)

useSeoMeta({
  title: () => (user.value?.name ? `رزومه | ${user.value.name}` : 'رزومه کارجو'),
  description: () =>
    user.value?.resume_personal?.about ||
    user.value?.description ||
    'مشاهده اطلاعات پایه، سوابق شغلی و مهارت‌های کارجو',
})
</script>
