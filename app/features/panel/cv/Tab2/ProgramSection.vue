<template>
  <div class="bg-white p-4 rounded-2xl mt-8">
    <div class="flex justify-between items-center">
      <p class="font-yb-bold text-xl">
        <span class="text-primary-500">-</span> نرم‌افزار حسابداری
      </p>
      <Icon v-if="programsItems.length == 0" name="svg:info" />
      <ProgramModal
        v-else
        label="افزودن"
        :programs
        @item="(v) => programsItems.push(v)"
      />
    </div>
    <div
      v-if="programsItems.length === 0"
      class="flex flex-col items-center justify-center gap-4 py-10"
    >
      <div class="text-center">
        <img src="/images/no-details.png" alt="" class="w-41" />
        <p class="font-yb-bold -mt-14">نرم‌افزار حسابداری</p>
      </div>
      <p class="text-text-passive text-sm">
        شما هنوز نرم افزار حسابداری خود را تکمیل نکرده‌اید.
      </p>
      <p class="text-text-passive text-sm">
        با افزودن حداقل یک نرم افزار حسابداری، شانس شما برای استخدام افزایش پیدا می‌کند.
      </p>
      <ProgramModal
        label="افزودن نرم‌افزار حسابداری"
        :programs
        @item="(v) => programsItems.push(v)"
      />
    </div>
    <div v-else class="mt-4 space-y-4">
      <div
        v-for="(item, index) in programsItems"
        class="p-4 border-2 border-dashed border-gray-default rounded-lg flex justify-between"
      >
        <div>
          <p class="text-text-primay font-semibold">
            {{ programs.find((x) => x.value === item.programName)?.label }}
          </p>
          <p class="text-text-passive text-sm mt-2">میزان تسلط به زیر سیستم‌ها:</p>
          <div class="mt-2 flex items-center flex-wrap gap-x-12 gap-y-2">
            <p class="text-text-passive text-sm">
              انبار: <span class="text-text-primay">{{ item.slider1 }}</span>
            </p>
            <p class="text-text-passive text-sm">
              مالی: <span class="text-text-primay">{{ item.slider2 }}</span>
            </p>
            <p class="text-text-passive text-sm">
              حقوق: <span class="text-text-primay">{{ item.slider3 }}</span>
            </p>
            <p class="text-text-passive text-sm">
              فروش: <span class="text-text-primay">{{ item.slider4 }}</span>
            </p>
            <p class="text-text-passive text-sm">
              نقد و بانک: <span class="text-text-primay">{{ item.slider5 }}</span>
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <ProgramModal
            :programs
            :edit-mode="true"
            :item-to-edit="item"
            @item="programsItems[index] = $event"
          />
          <button class="btn bg-white h-8 w-8 p-0 border-2 rounded-lg border-text-muted">
            <Icon name="svg:dots" />
          </button>
          <button
            class="btn bg-white h-8 w-8 p-0 border-2 rounded-lg border-text-muted"
            @click="programsItems.splice(index, 1)"
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
import ProgramModal from './ProgramModal.vue';

// Variabels
const levels = ref<ISelectItem[]>([{ label: 'کارشناسی', value: '1' }]);
const years = ref<ISelectItem[]>([{ label: '1400', value: '1' }]);
const programs = ref<ISelectItem[]>([{ label: 'برنامه 1', value: '1' }]);
const programsItems = ref<any[]>([]);
</script>
