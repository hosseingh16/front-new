<template>
  <div>
    <h1 class="font-yb-bold text-2xl text-text-tertiary">ویرایش آگهی</h1>

    <div v-if="loadingAd" class="mt-5 space-y-4">
      <div
        v-for="n in 4"
        :key="`edit-skeleton-${n}`"
        class="h-40 animate-pulse rounded-2xl bg-surface-200"
      />
    </div>

    <div v-else class="mt-5 grid items-start gap-4 lg:grid-cols-8">
      <div class="space-y-4 lg:col-span-6">
        <CreateAdGeneralFields
          :form="form"
          :errors="errors"
          :is-part-time="isPartTime"
          :job-titles="jobTitles"
          :employment-types="employmentTypes"
          :experience-levels="experienceLevels"
          :salary-ranges="salaryRanges"
          :education-levels="educationLevels"
          :genders="genders"
          :city-options="cityOptions"
          :region-options="regionOptions"
          :cities-loading="citiesLoading"
          :regions-loading="regionsLoading"
          :load-cities="loadCities"
          :load-regions="loadRegions"
        />

        <CreateAdRequirementsEditor :form="form" :errors="errors" />

        <CreateAdSpecializedFields
          :form="form"
          :accounting-programs="accountingPrograms"
          :proficiencies="proficiencies"
        />

        <CreateAdBenefitsSection :form="form" :benefits="benefits" />

        <CreateAdWorkingHoursSection :form="form" />

        <CreateAdPreviewCard
          :form="form"
          :company-name="companyName"
          :company-logo="companyLogo"
          :job-titles="jobTitles"
          :employment-types="employmentTypes"
          :genders="genders"
          :salary-ranges="salaryRanges"
        />
      </div>

      <CreateAdInvoiceSidebar
        class="lg:col-span-2"
        :submitting="submitting"
        publish-label="ثبت تغییرات"
        :show-draft="false"
        @publish="publish"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CreateAdBenefitsSection from '../components/create/CreateAdBenefitsSection.vue'
import CreateAdGeneralFields from '../components/create/CreateAdGeneralFields.vue'
import CreateAdInvoiceSidebar from '../components/create/CreateAdInvoiceSidebar.vue'
import CreateAdPreviewCard from '../components/create/CreateAdPreviewCard.vue'
import CreateAdRequirementsEditor from '../components/create/CreateAdRequirementsEditor.vue'
import CreateAdSpecializedFields from '../components/create/CreateAdSpecializedFields.vue'
import CreateAdWorkingHoursSection from '../components/create/CreateAdWorkingHoursSection.vue'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const adId = computed(() => String(route.params.id ?? ''))

const {
  form,
  errors,
  isPartTime,
  submitting,
  loadingAd,
  citiesLoading,
  regionsLoading,
  cityOptions,
  regionOptions,
  companyName,
  companyLogo,
  jobTitles,
  employmentTypes,
  experienceLevels,
  salaryRanges,
  benefits,
  proficiencies,
  educationLevels,
  genders,
  accountingPrograms,
  loadCities,
  loadRegions,
  publish,
} = useCreateAdForm({ adId })

useSeoMeta({
  title: 'ویرایش آگهی',
})
</script>
