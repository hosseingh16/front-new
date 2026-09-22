<template>
  <div>
    <h1 class="font-yb-bold text-2xl text-text-tertiary">پروفایل سازمان</h1>

    <template v-if="loading">
      <div class="mt-5 grid items-start gap-4 lg:grid-cols-8">
        <div class="space-y-4 lg:col-span-6">
          <div
            v-for="n in 3"
            :key="`skeleton-${n}`"
            class="h-64 animate-pulse rounded-2xl bg-surface-200"
          />
        </div>
        <div class="lg:col-span-2">
          <div class="h-96 animate-pulse rounded-2xl bg-surface-200" />
        </div>
      </div>
    </template>

    <div v-else class="mt-5 grid items-start gap-4 lg:grid-cols-8">
      <div class="space-y-4 lg:col-span-6">
        <CompanyLogoSection
          :form="form"
          :logo-uploading="savingLogo"
          @upload-logo="uploadLogo"
          @remove-logo="removeLogo"
        />

        <CompanyBasicInfoSection
          :form="form"
          :errors="errors"
          :activity-options="activityOptions"
          :size-options="sizeOptions"
          :saving="savingSection === 'basic'"
          @save="saveSection('basic')"
          @cancel="reload"
        />

        <CompanyIntroSection
          :form="form"
          :errors="errors"
          :saving="savingSection === 'intro'"
          @save="saveSection('intro')"
          @cancel="reload"
        />

        <CompanyLocationSection
          :form="form"
          :errors="errors"
          :city-options="cityOptions"
          :cities-loading="citiesLoading"
          :load-cities="loadCities"
          :saving="savingSection === 'location'"
          @save="saveSection('location')"
          @cancel="reload"
        />

        <CompanyGallerySection
          :form="form"
          :saving="savingSection === 'gallery'"
          @save="saveSection('gallery')"
          @cancel="reload"
          @upload="(file) => uploadImage('gallery', file)"
          @remove="removeGalleryImage"
        />

        <CompanyCoverSection
          :form="form"
          :saving="savingSection === 'cover'"
          @save="saveSection('cover')"
          @cancel="reload"
          @upload="(file) => uploadImage('cover', file)"
        />

        <CompanyVisibilitySection
          :form="form"
          :saving="savingSection === 'visibility'"
          @save="saveSection('visibility')"
        />
      </div>

      <CompanyCompletionSidebar
        class="lg:col-span-2"
        :sections="sectionStates"
        :percent="completionPercent"
        :slug="form.slug"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CompanyLogoSection from './components/CompanyLogoSection.vue'
import CompanyBasicInfoSection from './components/CompanyBasicInfoSection.vue'
import CompanyIntroSection from './components/CompanyIntroSection.vue'
import CompanyLocationSection from './components/CompanyLocationSection.vue'
import CompanyGallerySection from './components/CompanyGallerySection.vue'
import CompanyCoverSection from './components/CompanyCoverSection.vue'
import CompanyVisibilitySection from './components/CompanyVisibilitySection.vue'
import CompanyCompletionSidebar from './components/CompanyCompletionSidebar.vue'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()

const {
  form,
  errors,
  loading,
  savingSection,
  savingLogo,
  activityOptions,
  sizeOptions,
  cityOptions,
  citiesLoading,
  sectionStates,
  completionPercent,
  loadCities,
  reload,
  saveSection,
  uploadImage,
  uploadLogo,
  removeLogo,
  removeGalleryImage,
} = useCompanyProfileForm()

watch(loading, async (isLoading) => {
  if (isLoading || route.hash !== '#section-logo') return
  await nextTick()
  document
    .getElementById('section-logo')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

useSeoMeta({
  title: 'پروفایل سازمان',
})
</script>
