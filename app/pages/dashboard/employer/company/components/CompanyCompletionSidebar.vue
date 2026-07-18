<template>
  <aside class="space-y-4 lg:sticky lg:top-24">
    <div class="rounded-2xl border border-gray-default bg-white p-4">
      <Titr>میزان تکمیل رزومه</Titr>

      <div class="mt-4 flex justify-center">
        <div class="relative h-48 w-48">
          <svg viewBox="0 0 120 120" class="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#F2F2F2"
              stroke-width="12"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              :stroke="percent >= 100 ? '#009F65' : '#4864E1'"
              stroke-width="12"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
              class="transition-all duration-500"
            />
          </svg>
          <div
            class="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span class="font-yb-bold text-2xl text-text-tertiary"
              >٪{{ percent }}</span
            >
            <span class="text-xs text-text-passive">میزان کامل شدن</span>
          </div>
        </div>
      </div>

      <ul class="mt-4 space-y-1">
        <li v-for="section in sections" :key="section.key">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-50"
            @click="scrollToSection(section.key)"
          >
            <span>{{ section.label }}</span>
            <Icon
              :name="
                section.complete ? 'lucide:circle-check' : 'lucide:circle-alert'
              "
              size="18"
              :class="section.complete ? 'text-[#009F65]' : 'text-[#F59E0B]'"
            />
          </button>
        </li>
      </ul>
    </div>

    <div class="rounded-2xl border border-gray-default bg-white p-4">
      <Titr>آدرس رزومه سازمان</Titr>
      <p class="mt-3 text-sm leading-7 text-text-passive">
        به کمک این آدرس یکتا می‌توانید رزومه سازمان خود را با دیگران به اشتراک
        بگذارید.
      </p>
      <div
        v-if="profileUrl"
        class="mt-3 flex items-center justify-end gap-2 text-sm font-semibold text-primary-500"
      >
        <Icon name="svg:copy" class="cursor-pointer" @click="copyProfileUrl" />
        <span dir="ltr">{{ profileUrl }}</span>
      </div>
      <p v-else class="mt-3 text-sm text-text-muted">
        پس از تکمیل و ذخیره اطلاعات پایه، آدرس اختصاصی سازمان شما ساخته می‌شود.
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import useClipboard from "vue-clipboard3";
import Titr from "~/features/panel/cv/Titr.vue";
import type {
  CompanyProfileSection,
  CompanyProfileSectionKey,
} from "~/types/company-profile-form";

const props = defineProps<{
  sections: Array<CompanyProfileSection & { complete: boolean }>;
  percent: number;
  slug: string;
}>();

const { toClipboard } = useClipboard();
const { $toast } = useNuxtApp();

const circumference = 2 * Math.PI * 52;

const dashOffset = computed(
  () => circumference * (1 - Math.min(props.percent, 100) / 100),
);

const profileUrl = computed(() =>
  props.slug ? `hihesab.com/companies/${props.slug}` : "",
);

function scrollToSection(key: CompanyProfileSectionKey) {
  document
    .getElementById(`section-${key}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function copyProfileUrl() {
  try {
    await toClipboard(profileUrl.value);
    $toast.success("آدرس کپی شد");
  } catch {
    // clipboard unavailable
  }
}
</script>
