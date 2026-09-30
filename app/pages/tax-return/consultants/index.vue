<template>
  <div class="bg-surface-50">
    <section
      class="bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-6 md:bg-[url('/images/bg-5.png')] md:bg-position-[center_-150px]"
    >
      <div class="custom-pad pt-6">
        <nav class="text-sm text-text-passive">
          <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
            <Icon name="svg:home" size="16" />
          </NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink
            to="/tax-return"
            class="hover:text-primary-500 transition-colors"
          >
            اظهارنامه
          </NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-text-tertiary">مشاوران</span>
        </nav>

        <!-- Section 1: selection mode -->
        <section class="flex flex-col items-center">
          <span
            class="inline-flex items-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
          >
            از بهترین‌ها مشاوره دریافت کنید
          </span>

          <h1
            class="mt-6 text-center font-yb-bold text-xl text-text-tertiary md:text-2xl"
          >
            چطور می‌خواهید مشاور خود را انتخاب کنید؟
          </h1>

          <div class="mt-8 grid gap-4 md:grid-cols-2">
            <button
              v-for="option in selectionOptions"
              :key="option.value"
              type="button"
              class="relative flex flex-col items-center gap-4 rounded-2xl border bg-white p-5 text-center transition-colors md:p-6"
              :class="
                selectionMode === option.value
                  ? 'border-primary-500 bg-primary'
                  : 'border-gray-default hover:border-primary-500/40'
              "
              @click="onSelectMode(option.value)"
            >
              <span
                class="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-md border"
                :class="
                  selectionMode === option.value
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-default bg-white'
                "
                aria-hidden="true"
              >
                <Icon
                  v-if="selectionMode === option.value"
                  name="lucide:check"
                  size="14"
                />
              </span>

              <img
                :src="option.image"
                :alt="option.title"
                class="h-32 w-auto md:h-36"
              />

              <div class="w-full space-y-2">
                <p class="font-yb-bold text-base text-text-tertiary md:text-lg">
                  {{ option.title }}
                </p>
                <p class="text-sm leading-7 text-text-passive">
                  {{ option.description }}
                </p>
              </div>
            </button>
          </div>
        </section>

        <!-- Section 2: city filter -->
        <section
          v-if="selectionMode === 'self'"
          class="md:my-6 rounded-2xl border border-primary-500 bg-white p-5 md:p-6"
        >
          <h2 class="font-yb-bold text-lg text-text-tertiary md:text-xl">
            مشاور را در کدام شهر می‌خواهید؟
          </h2>
          <p class="mt-2 text-sm text-text-passive">
            مشاوران را بر اساس شهر فیلتر کنید
          </p>

          <div class="mt-5 flex flex-wrap gap-3">
            <button
              v-for="city in cityOptions"
              :key="city.value"
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors"
              :class="
                selectedCity === city.value
                  ? 'border-primary-500 bg-[#F8FAFF] text-primary-500'
                  : 'border-gray-default bg-white text-text-tertiary hover:border-primary-500/40'
              "
              @click="selectedCity = city.value"
            >
              <span
                class="flex h-4 w-4 items-center justify-center rounded-full border"
                :class="
                  selectedCity === city.value
                    ? 'border-primary-500'
                    : 'border-gray-default'
                "
                aria-hidden="true"
              >
                <span
                  v-if="selectedCity === city.value"
                  class="h-2 w-2 rounded-full bg-primary-500"
                />
              </span>
              <span>{{ city.label }}</span>
            </button>
          </div>

          <div
            class="mt-5 flex items-start gap-2 rounded-xl bg-primary-50 px-4 py-3 text-sm leading-7 text-text-passive"
          >
            <Icon
              name="lucide:info"
              size="18"
              class="mt-0.5 shrink-0 text-primary-500"
            />
            <p>
              بخش مشاوره تخصصی
              <b>های‌حساب</b>
              در حال حاضر فقط در سه شهر ، مشهد ، تهران ، کرج فعالیت دارد
            </p>
          </div>
        </section>

        <!-- Section 3: consultants list -->
        <div
          v-if="selectionMode === 'self'"
          id="consultants-results"
          class="space-y-4"
        >
          <template v-if="loading">
            <ConsultantListCard v-for="n in 6" :key="`skeleton-${n}`" loading />
          </template>

          <p v-else-if="error" class="py-12 text-center text-sm text-error">
            {{ error }}
          </p>

          <NoResult
            v-else-if="initialized && !filteredConsultants.length"
            title="مشاوری یافت نشد"
            description="متاسفانه مشاوری برای نمایش موجود نیست!"
          />

          <template v-else>
            <ConsultantListCard
              v-for="consultant in filteredConsultants"
              :key="consultant.id"
              :consultant="consultant"
              @select="onSelectConsultant"
            />

            <div class="flex justify-center pt-2">
              <Pagination
                :current-page="page"
                :last-page="lastPage"
                @update:current-page="onPageChange"
              />
            </div>
          </template>
        </div>
      </div>
    </section>

    <FaqSection
      class="custom-pad mt-4"
      :categories="faqCategories"
      :items="faqs"
    />

    <TaxReturnRequestModal
      ref="requestModalRef"
      @change-consultant="onChangeConsultantMode"
    />
  </div>
</template>

<script setup lang="ts">
import consultingUser from "~/assets/vectors/illustrations/consulting-user.svg";
import consulting from "~/assets/vectors/illustrations/consulting.svg";
import FaqSection from "~/components/Elements/FaqSection.vue";
import NoResult from "~/components/Elements/NoResult.vue";
import Pagination from "~/components/Elements/Pagination.vue";
import { FAQ_TYPE, faqCategoriesByType, faqsByType } from "~/data/faqs";
import TaxReturnRequestModal from "../components/TaxReturnRequestModal.vue";
import ConsultantListCard from "./components/ConsultantListCard.vue";
import type { TaxReturnConsultant } from "~/types/tax-return-consultant";

type SelectionMode = "self" | "auto";
type CityValue = "all" | "tehran" | "karaj" | "mashhad";

const route = useRoute();
const router = useRouter();

const selectionMode = ref<SelectionMode | null>(null);
const selectedCity = ref<CityValue>("all");
const requestModalRef = ref<InstanceType<typeof TaxReturnRequestModal> | null>(
  null,
);

const selectionOptions = [
  {
    value: "self" as const,
    title: "خودم از بین مشاوران انتخاب می‌کنم",
    description: "رزومه و تخصص مشاوران را بررسی می‌کنم",
    image: consultingUser,
  },
  {
    value: "auto" as const,
    title: "های‌حساب برام انتخاب کنه",
    description:
      "بر اساس نوع درخواست و شرایط پرونده، مشاور مناسب برای من انتخاب شود",
    image: consulting,
  },
];

const cityOptions: { value: CityValue; label: string }[] = [
  { value: "all", label: "همه شهر ها" },
  { value: "tehran", label: "تهران" },
  { value: "karaj", label: "کرج" },
  { value: "mashhad", label: "مشهد" },
];

function onSelectMode(mode: SelectionMode) {
  selectionMode.value = mode;
  if (mode === "auto") {
    nextTick(() => requestModalRef.value?.showModal({ autoAssign: true }));
  }
}

function onSelectConsultant(consultant: TaxReturnConsultant) {
  requestModalRef.value?.showModal({ consultant });
}

function onChangeConsultantMode() {
  selectionMode.value = null;
}

function parsePageQuery(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const nextPage = Number(raw);
  return Number.isInteger(nextPage) && nextPage > 0 ? nextPage : 1;
}

const page = ref(parsePageQuery(route.query.page));

const { consultants, lastPage, loading, initialized, error } =
  useTaxReturnConsultants(page);

const cityNameMap: Record<Exclude<CityValue, "all">, string> = {
  tehran: "تهران",
  karaj: "کرج",
  mashhad: "مشهد",
};

const filteredConsultants = computed(() => {
  if (selectedCity.value === "all") return consultants.value;
  const target = cityNameMap[selectedCity.value];
  return consultants.value.filter(
    (consultant) => consultant.city_name === target,
  );
});

watch(
  () => route.query.page,
  (queryPage) => {
    const nextPage = parsePageQuery(queryPage);
    if (nextPage !== page.value) page.value = nextPage;
  },
);

watch(page, async (nextPage) => {
  const normalizedPage =
    Number.isInteger(nextPage) && nextPage > 0 ? nextPage : 1;
  if (normalizedPage !== nextPage) {
    page.value = normalizedPage;
    return;
  }

  if (normalizedPage === parsePageQuery(route.query.page)) return;

  const query = { ...route.query };
  if (normalizedPage <= 1) {
    delete query.page;
  } else {
    query.page = String(normalizedPage);
  }

  await router.replace({ query });
});

function onPageChange(nextPage: number) {
  page.value = nextPage;
  nextTick(() => {
    const el = document.getElementById("consultants-results");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
}

const faqCategories = faqCategoriesByType(
  FAQ_TYPE.consulting,
  FAQ_TYPE.general,
);
const faqs = faqsByType(FAQ_TYPE.consulting, FAQ_TYPE.general);

useSeoMeta({
  title: "مشاوره مالی و مالیاتی بهترین متخصصان کشور | های‌حساب",
  description:
    "از میان بهترین مشاوران تأیید شده های‌حساب مشاور مورد نظر خود را انتخاب کنید و صفر تا صد امور مالیاتی را به متخصصان بسپارید.",
});
</script>
