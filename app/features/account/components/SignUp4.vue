<template>
  <DaisyCard class="w-full min-[1052px]:w-263">
    <SignUpStepper :current="2" class="hidden min-[560px]:flex flex-1" />
    <div class="flex items-center">
      <Icon
        name="svg:chevron-right"
        class="shrink-0 cursor-pointer"
        @click="goBack"
      />
      <img
        src="/images/3-3.png"
        width="54"
        class="ms-auto min-[560px]:hidden"
      />
      <span class="hidden min-[560px]:block w-6 shrink-0" />
    </div>

    <p class="mt-4 text-2xl sm:text-h1 font-yb-bold">نوع آگهی:</p>
    <div class="flex gap-1 items-center mt-2">
      <Icon name="svg:hint" />
      <span class="text-sm text-text-passive"
        >برای ایجاد آگهی، باید سازمان یا نماینده سازمان باشید.</span
      >
    </div>

    <div class="grid grid-cols-1 min-[1052px]:grid-cols-3 gap-4 mt-4">
      <div
        v-for="item in items"
        :key="item.employmentType"
        class="border border-gray-default hover:border-primary-500 rounded-2xl px-1 py-4 min-[1052px]:p-6 flex flex-row min-[1052px]:flex-col items-center group cursor-pointer"
        @click="goCreate(item.employmentType)"
      >
        <NuxtImg
          :src="`/images/${item.image}`"
          class="w-32 h-32 min-[1052px]:w-50 min-[1052px]:h-50"
        />
        <div class="min-[1052px]:text-center">
          <p class="min-[1052px]:-mt-10 text-lg sm:text-xl font-yb-bold">
            {{ item.title }}
          </p>
          <p class="my-2 leading-7 max-[1052px]:text-sm">
            {{ item.description }}
          </p>
          <button
            type="button"
            class="btn btn-soft group-hover:btn-primary h-10"
            @click.stop="goCreate(item.employmentType)"
          >
            <span :class="`icon-${item.icon}`" class="text-2xl"></span>
            <span class="max-[450px]:text-xs">{{ item.buttonText }}</span>
          </button>
        </div>
      </div>
    </div>
  </DaisyCard>
</template>

<script setup lang="ts">
import SignUpStepper from "~/features/account/components/SignUpStepper.vue";
import type { DirectionT } from "../types";

const props = defineProps<{
  step: number;
}>();

const emits = defineEmits<{
  (e: "onChangeStep", step: number): void;
  (e: "onChangeDirection", step: DirectionT): void;
}>();

const items = [
  {
    image: "request-type-1.png",
    title: "آگهی تمام‌وقت",
    description: "استخدام نیروی تمام‌وقت برای همکاری بلندمدت و پایدار.",
    icon: "bag-1",
    buttonText: "ایجاد آگهی تمام‌وقت",
    employmentType: "full_time",
  },
  {
    image: "request-type-5.png",
    title: "آگهی نیمه‌وقت",
    description: "جذب نیروی نیمه‌وقت برای همکاری منعطف و پاره‌وقت.",
    icon: "bag-1",
    buttonText: "ایجاد آگهی نیمه‌وقت",
    employmentType: "part_time",
  },
  {
    image: "request-type-6.png",
    title: "پروژه حسابداری",
    description: "تعریف پروژه مشخص و دریافت رزومه از متخصصان پروژه.",
    icon: "bag-1",
    buttonText: "ایجاد پروژه",
    employmentType: "project_based",
  },
];

function goBack() {
  emits("onChangeDirection", "back");
  emits("onChangeStep", props.step - 1);
}

function goCreate(employmentType: string) {
  navigateTo({
    path: "/dashboard/employer/ads/create",
    query: { employment_type: employmentType },
  });
}
</script>
