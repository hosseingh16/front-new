<template>
  <div :class="{ 'fixed left-4 right-4': expandedCvCompletion }">
    <div class="flex justify-between items-center">
      <p class="font-yb-bold text-2xl">رزومه من</p>
      <button class="btn text-sm border-none text-primary-500 bg-[#4864E114]">
        <Icon name="svg:user-2" size="24" />
        از دید کارفرما
      </button>
    </div>
    <div class="grid lg:grid-cols-8 gap-4 mt-5">
      <div class="lg:col-span-6">
        <div class="flex items-center border-b-2 border-gray-default">
          <button
            class="btn text-sm border-0 rounded-none border-primary-500 font-normal"
            :class="{ 'border-b-2 text-primary-500 font-semibold': tab === 1 }"
            @click="tab = 1"
          >
            <div
              class="flex justify-center items-center w-6 h-6 bg-[#4A4A4A14] rounded-full p-1"
            >
              <Icon name="svg:user-3" />
            </div>
            اطلاعات پایه
          </button>

          <button
            class="btn text-sm border-0 rounded-none border-primary-500 font-normal"
            :class="{ 'border-b-2 text-primary-500 font-semibold': tab === 2 }"
            @click="tab = 2"
          >
            <div
              class="flex justify-center items-center w-6 h-6 bg-[#4A4A4A14] rounded-full p-1"
            >
              <icons-bag2 :color="tab === 2 ? '#4864e1' : '#4A4A4A'" />
            </div>
            اطلاعات شغلی
          </button>
        </div>

        <Tab1 v-if="tab === 1" />
        <Tab2 v-if="tab === 2" />
      </div>
      <div class="lg:col-span-2">
        <div class="bg-white p-3 rounded-2xl border-2 border-gray-default max-lg:hidden">
          <p class="font-yb-bold text-xl">
            <span class="text-primary-500">-</span> میزان تکمیل رزومه
          </p>
          <CvCompletion />
        </div>
        <div class="bg-white p-3 rounded-2xl border-2 border-gray-default mt-4">
          <p class="font-yb-bold text-xl">
            <span class="text-primary-500">-</span> آدرس رزومه‌ی شما
          </p>
          <p class="mt-4 text-sm text-text-passive leading-8">
            به کمک این آدرس یکتا می‌توانید رزومه خود را با دیگران به اشتراک بگذارید.
          </p>
          <div
            class="mt-4 text-sm text-primary-500 font-semibold flex justify-end items-center gap-2"
          >
            <Icon
              name="svg:copy"
              class="cursor-pointer"
              @click="copy('Hihesab.ir/d4ds54gd')"
            />
            <span>Hihesab.ir/d4ds54gd</span>
          </div>
        </div>
      </div>

      <div
        v-if="expandedCvCompletion"
        class="lg:hidden hero-overlay fixed top-0 right-0"
        @click="expandedCvCompletion = false"
      ></div>
      <div
        v-if="!showBottomMenu"
        class="lg:hidden fixed bottom-18 right-0 w-full bg-white px-5 py-4 border-t-2 border-gray-default rounded-t-2xl transition-all"
        :class="expandedCvCompletion ? 'h-125' : 'h-14'"
      >
        <div class="flex justify-between items-center" @click="expandedCvCompletion = !expandedCvCompletion">
          <div class="flex items-center gap-1">
            <div
              v-if="!expandedCvCompletion"
              class="flex justify-center items-center bg-[#EF403514] h-6 w-8 text-danger-500 text-caption rounded-lg"
            >
              0%
            </div>
            <span v-if="!expandedCvCompletion" class="text-text-passive">رزومه تکمیل شده</span>
            <p v-else class="font-yb-bold">
              <span class="text-primary-500">-</span> میزان تکمیل رزومه
            </p>
          </div>
          <icons-chevron class="transition-all" :class="{ 'rotate-180': expandedCvCompletion }" />
        </div>
        <CvCompletion v-if="expandedCvCompletion" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CvCompletion from '@/features/panel/cv/CvCompletion.vue';
import useClipboard from 'vue-clipboard3';
import Tab1 from '~/features/panel/cv/Tab1.vue';
import Tab2 from '~/features/panel/cv/Tab2.vue';

definePageMeta({
  layout: 'panel',
});

// Variables
const tab = ref(1);
const { toClipboard } = useClipboard();
const expandedCvCompletion = useState('expandedCvCompletion_state', () => false);
const showBottomMenu = useState('showBottomMenu_state');

// Functions
async function copy(text: string) {
  try {
    await toClipboard(text);
  } catch (e) {}
}
</script>
