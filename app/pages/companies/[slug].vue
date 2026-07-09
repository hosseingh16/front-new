<template>
  <div class="bg-surface-50 pb-12">
    <div class="custom-pad mx-auto pt-6">
      <nav class="text-sm text-text-passive">
        <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
          <Icon name="svg:home" size="16" />
        </NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/companies" class="hover:text-primary-500 transition-colors">
          شرکت‌ها
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-text-tertiary">{{ company?.name ?? 'شرکت' }}</span>
      </nav>

      <p
        v-if="error"
        class="mt-8 py-12 text-center text-sm text-error"
      >
        {{ error }}
      </p>

      <CompanyDetailContent
        v-else
        :company="company"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CompanyDetailContent from './components/CompanyDetailContent.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

const { company, loading, error } = useCompany(slug)

useSeoMeta({
  title: () => (company.value?.name ? `پروفایل شرکت | ${company.value.name}` : 'پروفایل شرکت'),
  description: () =>
    company.value?.intro
      ? company.value.intro.replace(/<[^>]+>/g, '').slice(0, 160)
      : 'جزئیات شرکت، اطلاعات پایه، موقعیت مکانی و گالری تصاویر',
})
</script>
