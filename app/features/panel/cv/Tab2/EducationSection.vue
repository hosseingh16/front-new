<template>
  <div class="bg-white p-4 rounded-2xl mt-5">
    <div class="flex justify-between items-center">
      <p class="font-yb-bold text-xl">
        <span class="text-primary-500">-</span> اطلاعات تحصیلی
      </p>
      <Icon v-if="educationItems.length == 0" name="svg:info" />
      <EducationModal
        v-else
        label="افزودن"
        :levels
        :years
        @item="addEducation"
      />
    </div>
    <div
      v-if="educationItems.length === 0"
      class="flex flex-col items-center justify-center gap-4 py-10"
    >
      <div class="text-center">
        <img src="/images/no-details.png" alt="" class="w-41" />
        <p class="font-yb-bold -mt-14">اطلاعات تحصیلی</p>
      </div>
      <p class="text-text-passive text-sm">
        شما هنوز اطلاعات تحصیلی خود را تکمیل نکرده‌اید.
      </p>
      <p class="text-text-passive text-sm">
        با افزودن حداقل یک سابقه تحصیلی، شانس شما برای استخدام افزایش پیدا
        می‌کند.
      </p>
      <EducationModal
        label="افزودن اطلاعات تحصیلی"
        :levels
        :years
        @item="addEducation"
      />
    </div>
    <div v-else class="mt-4 space-y-4">
      <div
        v-for="(item, index) in educationItems"
        class="p-4 border-2 border-dashed border-gray-default rounded-lg flex justify-between"
      >
        <div class="flex items-start gap-4">
          <Icon name="svg:edu-item" size="28" />
          <div class="space-y-3">
            <p class="text-text-primay font-semibold">
              {{ levels.find((x) => x.value === item.degree)?.label }} .
              {{ item.major }}
            </p>
            <p class="text-text-passive text-sm">
              {{ item.university }} .
              <span v-if="!item.inStudy">{{
                years.find((x) => x.value === item.enddate)?.label
              }}</span>
              <span v-if="item.inStudy">مشغول به تحصیل</span>
            </p>
            <p v-if="item.description" class="text-text-passive text-sm">
              {{ item.description }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <EducationModal
            :levels
            :years
            :edit-mode="true"
            :item-to-edit="item"
            @item="updateEducation(index, $event)"
          />
          <button
            class="btn bg-white h-8 w-8 p-0 border-2 rounded-lg border-text-muted"
          >
            <Icon name="svg:dots" />
          </button>
          <button
            class="btn bg-white h-8 w-8 p-0 border-2 rounded-lg border-text-muted"
            @click="removeEducation(index)"
          >
            <Icon name="svg:trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from "~/types/select-item.js";
import EducationModal from "./EducationModal.vue";

// Variabels
//const levels = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]); //Gets From API
const levels = ref<ISelectItem[]>([]);
//const years = ref<ISelectItem[]>([{ label: '1400', value: '1' }]); //Gets From API
const years = ref<ISelectItem[]>([]);
const educationItems = ref<any[]>([]);
const lookups = ref<Record<string, any[]>>({});
const api = useApi();

async function addEducation(item: any) {
  educationItems.value.push(item);
  await syncEducation();
}

async function updateEducation(index: number, item: any) {
  educationItems.value[index] = item;
  await syncEducation();
}

async function removeEducation(index: number) {
  educationItems.value.splice(index, 1);
  await syncEducation();
}

async function syncEducation() {
  try {
    await api.post("cv/sync-education", {
      education_items: educationItems.value,
    });
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

onMounted(async () => {
  //Load user data
  const currentUser = useSanctumUser<any>();

  educationItems.value = (currentUser.value.data?.resume_educations ?? []).map(
    (item: any) => ({
      degree: item.degree,
      major: item.major,
      university: item.university,
      enddate: item.enddate,
      description: item.description,
    }),
  );

  //Get lookups
  const response = (await api.get(
    "lookups?keys=education_levels, graduation_years",
  )) as any;

  lookups.value = response.data ?? response;

  levels.value = lookups.value.education_levels || [];
  years.value = lookups.value.graduation_years || [];
});
</script>
