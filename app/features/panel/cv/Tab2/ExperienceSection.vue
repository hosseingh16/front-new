<template>
  <div class="bg-white p-4 rounded-2xl mt-5">
    <div class="flex justify-between items-center">
      <p class="font-yb-bold text-xl">
        <span class="text-primary-500">-</span> سوابق کاری
      </p>
      <Icon v-if="experiencesItems.length == 0" name="svg:info" />
      <ExperienceModal
        v-else
        label="افزودن"
        :job-titles
        :contract-types
        :action-types
        :salaries
        :reasons
        :years
        @item="(v) => experiencesItems.push(v)"
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
        با افزودن حداقل یک سابقه تحصیلی، شانس شما برای استخدام افزایش پیدا می‌کند.
      </p>
      <ExperienceModal
        label="افزودن سابقه کاری"
        :job-titles
        :contract-types
        :action-types
        :salaries
        :reasons
        :years
        @item="(v) => experiencesItems.push(v)"
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
              {{ jobTitles.find((x) => x.value === item.jobTitle)?.label }} .
              {{ contractTypes.find((x) => x.value === item.contractType)?.label }}
            </p>
            <p class="text-text-passive text-sm">
              {{ item.organization }} . از
              {{ years.find((x) => x.value === item.startYear)?.label }} تا
              <span v-if="!item.busy">{{
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
            :job-titles
            :contract-types
            :action-types
            :salaries
            :reasons
            :years
            :edit-mode="true"
            :item-to-edit="item"
            @item="experiencesItems[index] = $event"
          />
          <button class="btn bg-white h-8 w-8 p-0 border-2 rounded-lg border-text-muted">
            <Icon name="svg:dots" />
          </button>
          <button
            class="btn bg-white h-8 w-8 p-0 border-2 rounded-lg border-text-muted"
            @click="experiencesItems.splice(index, 1)"
          >
            <Icon name="svg:trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from '~/types/select-item.js';
import ExperienceModal from './ExperienceModal.vue';

// Variabels
const jobTitles = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]);
const contractTypes = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]);
const actionTypes = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]);
const salaries = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]);
const reasons = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]);
const years = ref<ISelectItem[]>([{ label: '1400', value: '1' }]);
const experiencesItems = ref<any[]>([]);
</script>
