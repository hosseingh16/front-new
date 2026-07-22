<template>
  <div>
    <h1 class="font-yb-bold text-2xl text-text-tertiary">
      اظهارنامه مالیاتی عملکرد
    </h1>

    <div class="mt-5 grid items-start gap-4 lg:grid-cols-8">
      <div class="space-y-4 lg:col-span-6">
        <TaxReturnContactSection
          :form="form"
          :errors="errors"
          :editing="editingContact"
          @edit="editingContact = true"
          @done="editingContact = false"
        />

        <TaxReturnActivitySection :form="form" :errors="errors" />

        <TaxReturnLocationSection
          :form="form"
          :errors="errors"
          :city-options="cityOptions"
          :cities-loading="citiesLoading"
          :load-cities="loadCities"
          @select="onMapSelect"
        />
      </div>

      <TaxReturnInvoiceSidebar
        class="lg:col-span-2"
        :submitting="submitting"
        :can-submit="canSubmit"
        @submit="submit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TaxReturnActivitySection from './components/TaxReturnActivitySection.vue'
import TaxReturnContactSection from './components/TaxReturnContactSection.vue'
import TaxReturnInvoiceSidebar from './components/TaxReturnInvoiceSidebar.vue'
import TaxReturnLocationSection from './components/TaxReturnLocationSection.vue'

definePageMeta({
  layout: 'dashboard',
})

useSeoMeta({
  title: 'اظهارنامه مالیاتی عملکرد',
})

const {
  form,
  errors,
  submitting,
  editingContact,
  cityOptions,
  citiesLoading,
  canSubmit,
  loadCities,
  onMapSelect,
  submit,
} = useTaxReturnForm()
</script>
