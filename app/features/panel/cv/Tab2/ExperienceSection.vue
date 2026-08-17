<template>
  <div id="section-experience" class="scroll-mt-24 bg-white p-4 rounded-2xl mt-5">
    <div class="flex justify-between items-center">
      <p class="font-yb-bold text-xl">
        <span class="text-primary-500">-</span> سوابق کاری
      </p>
      <Icon v-if="experiencesItems.length == 0" name="svg:info" />
      <ExperienceModal
        v-else
        label="افزودن"
        :job-titles="jobTitles"
        :employment_types="employment_types"
        :industries="industries"
        :salaries
        :reasons
        :years
        @item="addPrior"
      />
    </div>
    <div
      v-if="experiencesItems.length === 0"
      class="flex flex-col items-center justify-center gap-4 py-10"
    >
      <div class="text-center">
        <img src="/images/no-details.png" alt="" class="w-41" />
        <p class="font-yb-bold -mt-14">سوابق کاری</p>
      </div>
      <p class="text-text-passive text-sm">
        شما هنوز اطلاعات تحصیلی خود را تکمیل نکرده‌اید.
      </p>
      <p class="text-text-passive text-sm">
        با افزودن حداقل یک سابقه تحصیلی، شانس شما برای استخدام افزایش پیدا
        می‌کند.
      </p>
      <ExperienceModal
        label="افزودن سابقه کاری"
        :job-titles="jobTitles"
        :employment_types="employment_types"
        :industries="industries"
        :salaries
        :reasons
        :years
        @item="addPrior"
      />
    </div>
    <div v-else class="mt-4 space-y-4">
      <div
        v-for="(item, index) in experiencesItems"
        class="p-4 border-2 border-dashed border-gray-default rounded-lg flex justify-between"
      >
        <div class="flex items-start gap-4">
          <Icon name="svg:edu-item" size="28" />
          <div class="space-y-3">
            <p class="text-text-primay font-semibold">
              {{ jobTitles.find((x) => x.value === item.title)?.label }} .
              {{
                employment_types.find((x) => x.value === item.employmentType)
                  ?.label
              }}
            </p>
            <p class="text-text-passive text-sm">
              {{ item.companyName }} . از
              {{ years.find((x) => x.value === item.startYear)?.label }} تا
              <span v-if="!item.stillBusy">{{
                years.find((x) => x.value === item.endYear)?.label
              }}</span>
              <span v-else>الان</span>
            </p>
            <p v-if="item.description" class="text-text-passive text-sm">
              {{ item.description }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <ExperienceModal
            :job-titles="jobTitles"
            :employment_types="employment_types"
            :industries="industries"
            :salaries
            :reasons
            :years
            :edit-mode="true"
            :item-to-edit="item"
            @item="updatePrior"
          />
          <button class="btn-cv-action">
            <Icon name="svg:dots" />
          </button>
          <button
            class="btn-cv-action"
            @click="requestRemovePrior(index, item.id)"
          >
            <Icon name="svg:trash" />
          </button>
        </div>
      </div>
    </div>

    <RemoveItemModal
      ref="removeModalRef"
      title="حذف سابقه کاری"
      subtitle="آیا از حذف این سابقه کاری مطمئن هستید؟"
      description="پس از حذف، این مورد از رزومه شما پاک می‌شود و قابل بازیابی نخواهد بود."
      confirm-text="حذف"
      cancel-text="انصراف"
      icon="svg:delete"
      :loading="removing"
      @confirm="confirmRemovePrior"
      @cancel="handleRemoveCancel"
    />
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from "~/types/select-item.js";
import ExperienceModal from "./ExperienceModal.vue";
import RemoveItemModal from "~/components/M/RemoveItemModal.vue";

const api = useApi();
const { $toast } = useNuxtApp();
const { refreshUser } = useCurrentUser();

// Variabels
const experiencesItems = ref<any[]>([]);
const { items: lookupItems } = useLookups(
  "job_titles,employment_types,industries,prior_years,salary_ranges,leaving_reasons",
);
const jobTitles = lookupItems("job_titles");
const employment_types = lookupItems("employment_types");
const industries = lookupItems("industries");
const salaries = lookupItems("salary_ranges");
const reasons = lookupItems("leaving_reasons");
const years = lookupItems("prior_years");
const removeModalRef = ref<InstanceType<typeof RemoveItemModal> | null>(null);
const removingIndex = ref<number | null>(null);
const removingPriorId = ref<number | null>(null);
const removing = ref(false);

const addPrior = async (item: any) => {
  const exists = experiencesItems.value.some(
    (x) =>
      x.title === item.title &&
      x.startYear === item.startYear &&
      x.companyName === item.companyName,
  );
  if (exists) {
    alert("duplicate prior");
    return;
  }

  try {
    const response = await api.post<any>("cv/create-prior", item);
    experiencesItems.value.push(mapPrior(response));
    await refreshUser();
  } catch (error: any) {
    if (error?.status === 422) {
      const maxPriors = error?.data?.max_priors;
      $toast.error(
        maxPriors != null
          ? `نمی توانید بیش از ${maxPriors} سابقه شغلی ایجاد کنید.`
          : error?.message || "خطا در افزودن سابقه کاری",
      );
      return;
    }

    $toast.error(error?.message || "خطا در افزودن سابقه کاری");
  }
};

const updatePrior = async (item: any) => {
  try {
    const { id, ...data } = item;

    const response = await api.put(`cv/prior/${id}`, data);

    const index = experiencesItems.value.findIndex((x) => x.id === id);

    if (index !== -1) {
      experiencesItems.value[index] = mapPrior(response);
    }
    await refreshUser();
  } catch (error) {
    console.error(error);
  }
};

function requestRemovePrior(index: number, id: number) {
  if (!import.meta.client) return;
  removingIndex.value = index;
  removingPriorId.value = id;
  removeModalRef.value?.showModal();
}

async function confirmRemovePrior() {
  if (removingIndex.value == null || removingPriorId.value == null) return;

  removing.value = true;
  const index = removingIndex.value;
  const id = removingPriorId.value;

  try {
    await api.delete(`cv/prior/${id}`);
    experiencesItems.value.splice(index, 1);
    removeModalRef.value?.closeModal();
    $toast.success("سابقه کاری با موفقیت حذف شد");
    await refreshUser();
  } catch (error: any) {
    $toast.error(error?.message || "خطا در حذف سابقه کاری");
  } finally {
    removing.value = false;
    removingIndex.value = null;
    removingPriorId.value = null;
  }
}

function handleRemoveCancel() {
  removingIndex.value = null;
  removingPriorId.value = null;
}

const mapPrior = (item: any) => ({
  id: item.id,
  title: item.title,
  employmentType: item.employment_type,
  activityType: item.activity_type,
  companyName: item.company_name,
  startYear: item.start_year,
  endYear: item.end_year,
  stillBusy: item.still_busy,
  lastSalary: item.last_salary,
  leavingReason: item.leaving_reason,
  description: item.description,
});

onMounted(async () => {
  const currentUser = useSanctumUser();
  const priors = (currentUser.value?.data?.resume_priors ?? []).map(mapPrior);
  console.log(currentUser.value?.data?.resume_priors);

  experiencesItems.value = priors;
});
</script>
