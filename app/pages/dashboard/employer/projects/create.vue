<template>
  <div>
    <CompanyBasicInfoModal
      ref="companyBasicModalRef"
      @completed="onCompanyBasicCompleted"
    />

    <h1 class="font-yb-bold text-2xl text-text-tertiary">ایجاد پروژه</h1>

    <div class="mt-5 grid items-start gap-4 lg:grid-cols-8">
      <div class="space-y-4 lg:col-span-6">
        <CreateProjectCategorySection :form="form" :errors="errors" />
        <CreateProjectInfoSection :form="form" :errors="errors" />
        <CreateProjectMethodSection :form="form" :errors="errors" />
        <CreateProjectDurationSection :form="form" :errors="errors" />
        <CreateProjectBudgetSection :form="form" :errors="errors" />
        <CreateProjectPreviewCard
          v-if="form.category"
          :form="form"
          :company-name="companyName"
          :company-logo="companyLogo"
          :company-province="companyProvince"
          :company-city="companyCity"
        />
      </div>

      <CreateProjectInvoiceSidebar
        class="lg:col-span-2"
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
import CompanyBasicInfoModal from "~/pages/dashboard/employer/company/components/CompanyBasicInfoModal.vue";
import CreateProjectInvoiceSidebar from "./components/create/CreateProjectInvoiceSidebar.vue";
import CreateProjectBudgetSection from "./components/create/CreateProjectBudgetSection.vue";
import CreateProjectCategorySection from "./components/create/CreateProjectCategorySection.vue";
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
