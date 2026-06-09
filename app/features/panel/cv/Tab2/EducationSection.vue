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
        @item="(v) => educationItems.push(v)"
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
        با افزودن حداقل یک سابقه تحصیلی، شانس شما برای استخدام افزایش پیدا می‌کند.
      </p>
      <EducationModal
        label="افزودن اطلاعات تحصیلی"
        :levels
        :years
        @item="(v) => educationItems.push(v)"
      />
    </div>
    <div v-else class="mt-4 space-y-4">
      <div
        v-for="(item, index) in educationItems"
        class="p-4 border-2 border-dashed border-gray-default rounded-lg flex justify-between">
        <div class="flex items-start gap-4">
          <Icon name="svg:edu-item" size="28" />
          <div class="space-y-3">
            <p class="text-text-primay font-semibold">
              {{ levels.find((x) => x.value === item.level)?.label }} . {{ item.field }}
            </p>
            <p class="text-text-passive text-sm">
              {{ item.school }} .
              <span v-if="!item.inStudy">{{
                years.find((x) => x.value === item.date)?.label
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
            @item="educationItems[index] = $event"
          />
          <button class="btn bg-white h-8 w-8 p-0 border-2 rounded-lg border-text-muted">
            <Icon name="svg:dots" />
          </button>
          <button
            class="btn bg-white h-8 w-8 p-0 border-2 rounded-lg border-text-muted"
            @click="educationItems.splice(index, 1)"
          >
            <Icon name="svg:trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from '~/types/ISelectItem';
import EducationModal from './EducationModal.vue';

// Variabels
const levels = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]);
const years = ref<ISelectItem[]>([{ label: '1400', value: '1' }]);
const educationItems = ref<any[]>([]);
</script>
