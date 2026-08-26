<template>
  <div>
    <CompanyBasicInfoModal
      ref="companyBasicModalRef"
      @completed="onCompanyBasicCompleted"
    />

    <h1 class="font-yb-bold text-2xl text-text-tertiary">ایجاد پروژه</h1>

    <div class="mt-5 grid items-start gap-4 lg:grid-cols-8">
      <div class="space-y-4 lg:col-span-6">
        <CreateProjectInfoSection :form="form" :errors="errors" />
        <CreateProjectMethodSection :form="form" :errors="errors" />
        <CreateProjectDurationSection
          v-if="form.presence_mode === 'required'"
          :form="form"
          :errors="errors"
        />
        <CreateProjectBudgetSection :form="form" :errors="errors" />
        <CreateProjectPreviewCard
          :form="form"
          :company-name="companyName"
          :company-logo="companyLogo"
          :company-province="companyProvince"
          :company-city="companyCity"
        />
      </div>

      <CreateAdInvoiceSidebar
        class="lg:col-span-2"
        publish-label="انتشار پروژه"
        :submitting="submitting"
        :saving-draft="savingDraft"
        :payable-amount="payableAmount"
        @publish="publish"
        @save-draft="saveDraft"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CreateAdInvoiceSidebar from "~/pages/dashboard/employer/ads/components/create/CreateAdInvoiceSidebar.vue";
import CompanyBasicInfoModal from "~/pages/dashboard/employer/company/components/CompanyBasicInfoModal.vue";
import CreateProjectBudgetSection from "./components/create/CreateProjectBudgetSection.vue";
import CreateProjectDurationSection from "./components/create/CreateProjectDurationSection.vue";
import CreateProjectInfoSection from "./components/create/CreateProjectInfoSection.vue";
import CreateProjectMethodSection from "./components/create/CreateProjectMethodSection.vue";
import CreateProjectPreviewCard from "./components/create/CreateProjectPreviewCard.vue";

definePageMeta({
  layout: "dashboard",
});

useSeoMeta({
  title: "ایجاد پروژه",
});

const {
  form,
  errors,
  submitting,
  savingDraft,
  payableAmount,
  companyName,
  companyLogo,
  companyProvince,
  companyCity,
  loadCompanyPreview,
  saveDraft,
  publish,
} = useCreateProjectForm();

const companyBasicModalRef = ref<InstanceType<
  typeof CompanyBasicInfoModal
> | null>(null);

onMounted(async () => {
  await companyBasicModalRef.value?.checkAndOpen();
});

async function onCompanyBasicCompleted() {
  await loadCompanyPreview();
}
</script>
