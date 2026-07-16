<template>
  <div>
    <h1 class="font-yb-bold text-2xl text-text-tertiary">رزومه سازمان</h1>

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
        <CompanyBasicInfoSection
          :form="form"
          :errors="errors"
          :activity-options="activityOptions"
          :size-options="sizeOptions"
          :saving="savingSection === 'basic'"
          @save="saveSection('basic')"
          @cancel="reload"
          @upload-logo="(file) => uploadImage('logo', file)"
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
          :region-options="regionOptions"
          :cities-loading="citiesLoading"
          :regions-loading="regionsLoading"
          :load-cities="loadCities"
          :load-regions="loadRegions"
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

const {
  form,
  errors,
  loading,
  savingSection,
  activityOptions,
  sizeOptions,
  cityOptions,
  regionOptions,
  citiesLoading,
  regionsLoading,
  sectionStates,
  completionPercent,
  loadCities,
  loadRegions,
  reload,
  saveSection,
  uploadImage,
  removeGalleryImage,
} = useCompanyProfileForm()

useSeoMeta({
  title: 'رزومه سازمان',
})
</script>
