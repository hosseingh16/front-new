<template>
  <DaisyCard class="w-full min-[1052px]:w-263">
    <SignUpStepper :current="3" class="hidden min-[560px]:flex flex-1" />
    <div class="flex items-center">
      <Icon
        v-if="!forced"
        name="svg:chevron-right"
        class="shrink-0 cursor-pointer"
        @click="goBack"
      />
      <span v-else class="hidden min-[560px]:block w-6 shrink-0" />
      <img src="/images/3-3.png" width="54" class="ms-auto min-[560px]:hidden" />
      <span class="hidden min-[560px]:block w-6 shrink-0" />
    </div>

    <p class="mt-4 text-2xl sm:text-h1 font-yb-bold">نوع درخواست جدید:</p>

    <div class="grid grid-cols-1 min-[1052px]:grid-cols-3 gap-4 mt-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="border border-gray-default hover:border-primary-500 rounded-2xl py-4 min-[1052px]:p-6 flex h-full flex-row min-[1052px]:flex-col items-center group cursor-pointer"
        :class="{ 'pointer-events-none opacity-60': loading }"
        @click="onSelect(item)"
      >
        <NuxtImg
          :src="`/images/${item.image}`"
          class="w-32 h-32 min-[1052px]:w-50 min-[1052px]:h-50 shrink-0"
        />
        <div class="flex min-w-0 flex-1 flex-col min-[1052px]:w-full min-[1052px]:text-center">
          <p class="min-[1052px]:-mt-10 text-lg sm:text-xl font-yb-bold">
            {{ item.title }}
          </p>
          <p class="my-2 leading-7 max-[1052px]:text-sm">
            {{ item.description }}
          </p>
          <button
            type="button"
            class="request-type-btn btn btn-soft group-hover:btn-primary mt-auto inline-flex h-10 items-center justify-center gap-1"
            :disabled="loading"
            @click.stop="onSelect(item)"
          >
            <span
              v-if="loading && pendingId === item.id"
              class="loading loading-spinner loading-sm"
            />
            <template v-else>
              <Icon
                v-if="item.icon.includes(':')"
                :name="item.icon"
                size="24"
                class="size-6 shrink-0 text-inherit"
              />
              <span
                v-else
                :class="`icon-${item.icon}`"
                class="text-2xl leading-none"
              ></span>
              <span>{{ item.buttonText }}</span>
            </template>
          </button>
        </div>
      </div>
    </div>
  </DaisyCard>
</template>

<script setup lang="ts">
import SignUpStepper from "~/features/account/components/SignUpStepper.vue";
import type { AccountRole, DirectionT } from "../types";
import { paths } from "~/routes";

const props = withDefaults(
  defineProps<{
    step: number;
    /** When true, no back / auto-nav — parent handles next step after selected. */
    forced?: boolean;
  }>(),
  { forced: false },
);

const emits = defineEmits<{
  (e: "onChangeStep", step: number): void;
  (e: "onChangeDirection", step: DirectionT): void;
  (e: "selected", role: AccountRole): void;
}>();

const { updateUserRole, loading } = useAccountAuth();
const pendingId = ref<string | null>(null);

type RequestTypeItem = {
  id: string;
  image: string;
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  role: AccountRole;
  to?: string;
};

const items: RequestTypeItem[] = [
  {
    id: "employer",
    image: "request-type-1.png",
    title: "ایجاد آگهی",
    description:
      "آگهی استخدامی یا پروژه ایجاد کنید و نیروی موردنظر را جذب کنید.",
    icon: "bag-1",
    buttonText: "ایجاد آگهی",
    role: "employer",
  },
  {
    id: "jobs",
    image: "request-type-2.png",
    title: "فرصت‌های شغلی",
    description:
      "فرصت‌های شغلی را مشاهده کنید و رزومه خود را برای آن‌ها ارسال کنید.",
    icon: "bag-2",
    buttonText: "فرصت‌های شغلی",
    role: "job_seeker",
    to: "/dashboard/ad",
  },
  {
    id: "cv",
    image: "request-type-3.png",
    title: "ساخت رزومه حسابداری",
    description: "ایجاد رزومه حرفه‌ای و ارسال آن برای کارفرما",
    icon: "lucide:clipboard-list",
    buttonText: "رزومه ساز",
    role: "job_seeker",
    to: "/dashboard/cv",
  },
];

function goBack() {
  emits("onChangeDirection", "back");
  emits("onChangeStep", props.step - 1);
}

async function onSelect(item: RequestTypeItem) {
  if (loading.value) return;

  pendingId.value = item.id;
  try {
    await updateUserRole(item.role);
    emits("selected", item.role);

    if (props.forced) return;

    if (item.role === "employer") {
      emits("onChangeDirection", "forward");
      emits("onChangeStep", props.step + 1);
      return;
    }

    navigateTo(item.to || paths.jobs.root);
  } finally {
    pendingId.value = null;
  }
}
</script>
