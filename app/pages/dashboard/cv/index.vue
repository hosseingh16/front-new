<template>
  <div :class="{ 'fixed left-4 right-4': expandedCvCompletion }">
    <CvIncompleteBanner
      v-if="showCvIncompleteBanner"
      class="mb-5"
      @dismiss="dismissCvIncompleteBanner"
    />

    <div class="flex justify-between items-center">
      <p class="font-yb-bold text-2xl">رزومه من</p>
      <button
        class="btn h-10 border-none text-sm text-primary-500 bg-[#4864E114]"
        type="button"
        @click="navigateTo('/dashboard/my-resume')"
      >
        <Icon name="svg:user-2" size="18" />
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
      <aside class="space-y-4 lg:col-span-2 lg:sticky lg:top-24">
        <div
          class="rounded-2xl border border-gray-default bg-white p-4 max-lg:hidden"
        >
          <CvCompletion :user="user" @select="goToSection" />
        </div>
        <div class="rounded-2xl border border-gray-default bg-white p-4">
          <Titr>آدرس رزومه‌ی شما</Titr>
          <p class="mt-3 text-sm leading-7 text-text-passive">
            به کمک این آدرس یکتا می‌توانید رزومه خود را با دیگران به اشتراک
            بگذارید.
          </p>
          <div
            class="mt-3 flex items-center justify-end gap-2 text-sm font-semibold text-primary-500"
          >
            <Icon
              name="svg:copy"
              class="cursor-pointer"
              @click="copy('Hihesab.com/d4ds54gd')"
            />
            <span
              dir="ltr"
              class="cursor-pointer"
              @click="copy('Hihesab.com/d4ds54gd')"
              >Hihesab.com/d4ds54gd</span
            >
          </div>
        </div>
      </aside>

      <div
        v-if="expandedCvCompletion"
        class="lg:hidden hero-overlay fixed top-0 right-0"
        @click="expandedCvCompletion = false"
      ></div>
      <div
        v-if="!showBottomMenu"
        class="lg:hidden fixed bottom-18 right-0 w-full bg-white px-5 py-4 border-t-2 border-gray-default rounded-t-2xl transition-all overflow-y-auto"
        :class="expandedCvCompletion ? 'h-125' : 'h-14'"
      >
        <div
          class="flex justify-between items-center"
          @click="expandedCvCompletion = !expandedCvCompletion"
        >
          <div class="flex items-center gap-1">
            <div
              v-if="!expandedCvCompletion"
              class="flex justify-center items-center h-6 w-8 text-caption rounded-lg"
              :class="
                totalPercent > 0
                  ? 'bg-success/10 text-success'
                  : 'bg-[#EF403514] text-danger-500'
              "
            >
              {{ totalPercent }}%
            </div>
            <span v-if="!expandedCvCompletion" class="text-text-passive"
              >رزومه تکمیل شده</span
            >
            <Titr v-else class="!mb-0">میزان تکمیل رزومه</Titr>
          </div>
          <icons-chevron
            class="transition-all"
            :class="{ 'rotate-180': expandedCvCompletion }"
          />
        </div>
        <CvCompletion
          v-if="expandedCvCompletion"
          :user="user"
          :show-title="false"
          @select="goToSection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CvCompletion from "@/features/panel/cv/CvCompletion.vue";
import CvIncompleteBanner from "@/features/panel/cv/CvIncompleteBanner.vue";
import useClipboard from "vue-clipboard3";
import Tab1 from "~/features/panel/cv/Tab1.vue";
import Tab2 from "~/features/panel/cv/Tab2.vue";
import Titr from "~/features/panel/cv/Titr.vue";
import type { CvCompletionItem } from "~/composables/useCvCompletion";
import { isResumeBasicInfoComplete } from "~/utils/api-error";

definePageMeta({
  layout: "dashboard",
});

const BANNER_STORAGE_KEY = "cv-incomplete-banner-dismissed";

// Variables
const tab = ref(1);
const { user } = useCurrentUser();
const { isWelcomeVisible } = useFirstVisitWelcome();
const { totalPercent } = useCvCompletion(user);
const { toClipboard } = useClipboard();
const expandedCvCompletion = useState(
  "expandedCvCompletion_state",
  () => false,
);
const showBottomMenu = useState("showBottomMenu_state");
const cvIncompleteBannerDismissed = ref(false);

const showCvIncompleteBanner = computed(
  () =>
    !isResumeBasicInfoComplete(user.value) &&
    !cvIncompleteBannerDismissed.value &&
    !isWelcomeVisible.value,
);

onMounted(() => {
  if (!import.meta.client) return;
  cvIncompleteBannerDismissed.value =
    localStorage.getItem(BANNER_STORAGE_KEY) === "1";
});

function dismissCvIncompleteBanner() {
  cvIncompleteBannerDismissed.value = true;
  if (import.meta.client) {
    localStorage.setItem(BANNER_STORAGE_KEY, "1");
  }
}

watch(
  () => isResumeBasicInfoComplete(user.value),
  (complete) => {
    if (!complete || !import.meta.client) return;
    cvIncompleteBannerDismissed.value = false;
    localStorage.removeItem(BANNER_STORAGE_KEY);
  },
);

async function goToSection(item: CvCompletionItem) {
  tab.value = item.tab;
  expandedCvCompletion.value = false;
  await nextTick();
  document
    .getElementById(`section-${item.key}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function copy(text: string) {
  try {
    await toClipboard(text);
  } catch (e) {}
}
</script>
