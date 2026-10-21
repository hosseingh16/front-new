<template>
  <div class="bg-surface-50">
    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-5.png')] bg-no-repeat bg-top pb-10 md:pb-16"
    >
      <div class="custom-pad pt-6">
        <nav class="flex items-center text-sm text-text-passive">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 transition-colors hover:text-primary-500"
          >
            <Icon name="svg:home" size="16" />
            خانه
          </NuxtLink>
          <span class="mx-2">/</span>
          <span>خدمات</span>
          <span class="mx-2">/</span>
          <span class="text-text-tertiary">کارفرمایان</span>
        </nav>
      </div>
      <div class="custom-pad flex flex-col items-center pt-6 md:pt-8">
        <span
          class="inline-flex h-8 items-center rounded-lg bg-[#4864E114] px-3 text-[13px] font-semibold text-primary-500"
        >
          نشر تخصصی جذب و همکاری با حسابداران
        </span>
        <h1
          class="mt-4 max-w-[764px] text-center font-yb-bold text-2xl leading-[56px] text-text-tertiary md:text-[32px]"
        >
          پلی میان کسب‌وکارها و متخصصان حسابداری و مالی
        </h1>
        <p
          class="mt-2 max-w-[828px] text-center text-base font-semibold leading-[35px] text-text-tertiary md:text-lg"
        >
          در های‌حساب می‌توانید برای جذب نیروی حسابداری آگهی منتشر کنید و
          پروژه‌های حسابداری و تنظیم اظهارنامه مالیاتی خود را به متخصصان
          بسپارید.
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-4">
          <IntentLink
            :to="paths.employer.adsCreate"
            role="employer"
            class="btn btn-primary h-10 w-[179px] px-4 text-sm"
          >
            ثبت آگهی جدید
          </IntentLink>
          <IntentLink
            :to="paths.employer.projectsCreate"
            role="employer"
            class="btn btn-outline h-10 w-[179px] border-[#D6DCF5] bg-white px-4 text-sm text-primary-500 hover:bg-primary-50"
          >
            ثبت پروژه جدید
          </IntentLink>
        </div>
        <img
          :src="heroMobile"
          alt="پنل کارفرمایان های‌حساب"
          class="mt-6 w-full max-w-md md:hidden"
        />
        <img
          :src="heroDesktop"
          alt="پنل کارفرمایان های‌حساب"
          class="mt-6 hidden w-full max-w-[1137px] md:block"
        />
      </div>
    </section>

    <TrustBar
      title="به جمع بیش از دو میلیون کسب و کار در های‌حساب بپیوندید"
      subtitle="های‌حساب ، مورد اعتماد بهترین سازمان‌ها همراه شما در جذب حرفه ای ترین نیروها"
      :stats="trustStats"
    />

    <!-- Service Cards -->
    <section class="relative overflow-hidden bg-surface-100 py-12 md:py-16">
      <img
        :src="empLeftPattern"
        alt=""
        class="pointer-events-none absolute -left-10 top-8 hidden w-40 opacity-80 lg:block"
      />
      <img
        :src="empRightPattern"
        alt=""
        class="pointer-events-none absolute -right-10 top-16 hidden w-40 opacity-80 lg:block"
      />
      <div class="custom-pad relative">
        <div class="mx-auto flex w-full max-w-[976px] flex-col items-center">
          <span
            class="inline-flex h-8 items-center rounded-lg bg-[#4864E114] px-3 text-sm font-semibold text-primary-500"
          >
            ارزش ها
          </span>
          <h2
            class="mt-4 text-center font-yb-bold text-xl leading-[39px] text-text-tertiary md:text-[28px]"
          >
            های‌حساب برای کارفرما چه کاری انجام می‌دهد؟
          </h2>
        </div>

        <div class="mx-auto mt-8 w-full max-w-[976px] space-y-6">
          <div
            v-for="(card, index) in serviceCards"
            :key="card.featureTitle"
            class="flex flex-col-reverse items-center gap-6 overflow-hidden rounded-2xl bg-white px-4 py-6 md:h-[271px] md:flex-row md:gap-8 md:px-8"
            :class="index != 1 ? 'md:flex-row-reverse' : ''"
          >
            <div class="flex w-full flex-1 flex-col md:max-w-[504px]">
              <ol class="space-y-2">
                <li
                  v-for="(point, i) in card.points"
                  :key="point"
                  class="flex items-center gap-2 text-sm leading-[27px] text-text-tertiary md:text-base"
                >
                  <span :class="card.numberClass">
                    {{ i + 1 }}
                  </span>
                  <span>{{ point }}</span>
                </li>
              </ol>
              <IntentLink
                :to="card.to"
                :role="card.role"
                :query="card.query"
                class="mt-2.5 flex h-8 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
                :class="card.ctaClass"
              >
                {{ card.btnText }}
                <icons-arrow
                  :color="card.ctaArrowColor"
                  :size="14"
                  class="rotate-45"
                />
              </IntentLink>
            </div>

            <div
              class="flex h-[207px] w-full shrink-0 flex-col items-center justify-center rounded-2xl px-6 text-center md:w-[368px]"
              :class="card.boxClass"
            >
              <Icon :name="card.icon" size="61" />
              <p
                class="mt-3 font-yb-bold text-base text-text-tertiary md:text-lg"
              >
                {{ card.featureTitle }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- @todo: After adding the Resume Bank -->
    <!-- Dark Feature Section -->
    <!-- <section
      class="custom-pad bg-surface-100 md:pb-24 min-h-[950px] md:min-h-0"
    >
      <div
        class="relative overflow-visible rounded-2xl bg-[#2C3D89] [background:radial-gradient(circle,rgba(44,61,137,1)_35%,rgba(0,0,0,1)_100%)]"
      >
        <img
          :src="empLeftPattern"
          alt=""
          class="absolute left-0 top-0 bottom-0"
        />
        <img
          :src="empRightPattern"
          alt=""
          class="absolute right-0 top-0 bottom-0"
        />
        <div
          class="relative px-6 pt-12 pb-28 text-white md:px-10 md:pt-6 md:pb-36 mb-10"
        >
          <div class="flex flex-col items-center text-center">
            <span
              class="inline-flex items-center rounded-full bg-accent-500 px-4 py-1.5 text-sm font-semibold text-white"
            >
              بانک رزومه
            </span>
            <h2 class="mt-5 font-yb-bold text-xl md:text-2xl">
              استفاده از بانک رزومه حسابداران
            </h2>
            <p
              class="mx-auto mt-4 text-sm leading-7 text-surface-200 md:text-base"
            >
              به رزومه حسابداران آماده همکاری دسترسی داشته باشید و بر اساس
              مهارت، سابقه، شهر و نوع همکاری، گزینه مناسب را پیدا کنید.
            </p>
          </div>

          <div class="mt-10 flex justify-center">
            <img
              :src="filtersIllustration"
              alt="فیلتر و جستجوی رزومه حسابداران"
              class="w-full max-h-[198px] object-contain"
            />
          </div>
        </div>

        <div
          class="absolute z-10 -mt-20 grid grid-cols-1 gap-4 px-6 pb-8 sm:grid-cols-3 md:-mt-24 md:px-10"
        >
          <div
            v-for="item in darkFeatures"
            :key="item.title"
            class="rounded-xl bg-white py-6 shadow-[0px_4px_20px_0px_#0000001A] border-r-4 border-primary-500"
          >
            <div class="px-4">
              <h3
                class="font-yb-bold text-sm text-text-tertiary md:text-base bg-primary-50 border-r-2 border-primary-500 p-1 text-center"
              >
                {{ item.title }}
              </h3>
              <p class="mt-3 text-sm leading-7 text-text-passive">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- How It Works -->
    <section class="relative bg-surface-100 py-10 md:py-16">
      <div class="custom-pad relative z-10 flex flex-col items-center">
        <span
          class="inline-flex items-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
        >
          فرآیندکار
        </span>
        <h2 class="mt-4 font-yb-bold text-xl text-text-tertiary md:text-2xl">
          چطور انجام می‌شود؟
        </h2>
      </div>

      <div
        class="custom-pad relative z-10 mt-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16"
      >
        <div class="space-y-3">
          <div
            v-for="(step, index) in processSteps"
            :key="step.title"
            class="overflow-hidden rounded-lg"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-right transition-colors"
              :class="
                expandedProcessStep === index
                  ? 'rounded-t-lg bg-primary-500 text-white'
                  : 'rounded-lg bg-white text-text-tertiary'
              "
              @click="toggleProcessStep(index)"
            >
              <span
                v-if="expandedProcessStep === index"
                class="shrink-0 text-lg leading-none font-light"
              >
                −
              </span>
              <Icon
                v-else
                name="svg:plus"
                size="16"
                class="shrink-0 text-text-passive"
              />
              <span class="flex-1 font-semibold text-sm md:text-base">
                {{ index + 1 }} : {{ step.title }}
              </span>
              <icons-chevron
                :color="expandedProcessStep === index ? 'white' : '#757575'"
                class="shrink-0 transition-transform"
                :class="expandedProcessStep === index ? 'rotate-180' : ''"
              />
            </button>
            <div
              v-if="expandedProcessStep === index"
              class="rounded-b-lg border border-t-0 border-gray-default bg-white px-4 py-4 text-sm leading-7 text-text-passive"
            >
              {{ step.description }}
            </div>
          </div>
        </div>

        <div
          class="relative flex min-h-80 items-center justify-center bg-contain bg-center bg-no-repeat"
          :style="{ backgroundImage: `url(${processGraphic})` }"
        >
          <div
            class="relative z-10 mx-auto w-full max-w-[190px] overflow-hidden transition-[height] duration-500 ease-in-out"
            :style="{ height: `${processViewportHeight}px` }"
          >
            <div
              class="relative will-change-transform"
              :class="
                shouldAnimateProcessScroll
                  ? 'transition-transform duration-500 ease-in-out'
                  : ''
              "
              :style="{ transform: `translateY(-${processScrollOffset}px)` }"
            >
              <img
                :src="activeProcessIllustration"
                alt="فرآیند کار های‌حساب"
                class="block w-[190px]"
                width="190"
                :height="processImageHeight"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <Testimonials
      badge="تجربه کاربران ما"
      title="نظر کسانی که تجربه واقعی استفاده از پلتفرم ما را داشته‌اند، بهترین راهنمای شماست."
      :testimonials="testimonials"
      class="pt-10 pb-12"
    />

    <FaqSection
      :categories="faqCategories"
      :items="faqs"
      title="سوالی دارید ؟ ما پاسخگو هستیم"
      tabs-class="max-w-[736px] grid-cols-2"
    />
  </div>
</template>

<script setup lang="ts">
import empLeftPattern from "~/assets/vectors/pages/employers/emp-left-pattern.svg";
import empRightPattern from "~/assets/vectors/pages/employers/emp-right-pattern.svg";
import heroDesktop from "~/assets/vectors/pages/employers/banner.webp";
import heroMobile from "~/assets/vectors/pages/employers/banner-mobile.webp";
import filtersIllustration from "~/assets/vectors/pages/employers/filters.webp";
import step0 from "~/assets/vectors/pages/employers/step0.svg";
import step1 from "~/assets/vectors/pages/employers/step1.svg";
import step2 from "~/assets/vectors/pages/employers/step2.svg";
import step3 from "~/assets/vectors/pages/employers/step3.svg";
import step4 from "~/assets/vectors/pages/employers/step4.svg";
import processGraphic from "~/assets/vectors/pages/employers/Group 1142813134.svg";
import TrustBar from "../../components/Elements/TrustBar.vue";
import FaqSection from "~/components/Elements/FaqSection.vue";
import { FAQ_TYPE, faqsByType } from "~/data/faqs";
import Testimonials, {
  type Testimonial,
} from "~/components/Elements/Testimonials.vue";
import { paths } from "~/routes";

const PROCESS_STEP_OFFSETS = [0, 217, 449, 680];
const PROCESS_VIEWPORT_HEIGHTS = [217, 232, 241, 220];
const PROCESS_IMAGE_HEIGHTS = [853, 853, 853, 853, 903];

const resumeBankPoints = [
  "جستجو بر روی بانک رزومه با 14 فیلتر کاربردی مخصوص حسابداران",
  "انتقال رزومه های متناسب با کسب و کار شما به پوشه منتخب",
  "ایجاد آگهی استخدامی با توجه به نرم افزار و دانش مد نظر مجموعه شما",
  "استخدام توانمند ترین حسابدار",
];

type ServiceCard = {
  featureTitle: string;
  icon: string;
  points: string[];
  boxClass: string;
  numberClass: string;
  ctaClass: string;
  ctaArrowColor: string;
  btnText: string;
  to: string;
  role: "employer";
  query?: Record<string, string>;
};

const serviceCards: ServiceCard[] = [
  {
    featureTitle: "آگهی استخدام‌تان را ثبت کنید",
    icon: "svg:bag-icon",
    points: [
      "تعیین تخصص و مهارت‌های موردنیاز برای جذب هدفمندتر",
      "دیده‌شدن آگهی در میان حسابداران با تخصص‌ها و سوابق متنوع",
      "مقایسه آسان رزومه‌ها با قالب یکسان و دسته‌بندی تخصصی",
      "انتخاب توانمندترین حسابدار",
    ],
    boxClass:
      "bg-gradient-to-bl from-[#708FEA] to-[#fff] border-2 border-[#C6D2F7]",
    numberClass:
      "text-[#4864e1] shrink-0 rounded-xl bg-[#EBF0FC] w-[28px] h-[32px] text-center leading-[32px]",
    ctaClass: "bg-[#EBF0FC] text-primary-500",
    ctaArrowColor: "#4864e1",
    btnText: "ایجاد آگهی استخدام",
    to: paths.employer.adsCreate,
    role: "employer" as const,
  },
  {
    featureTitle: "پروژه حسابداری ثبت کن",
    icon: "svg:bag-icon",
    points: resumeBankPoints,
    boxClass:
      "bg-gradient-to-bl from-[#2BDCAF] to-[#fff] border-2 border-[#A0F8D5]",
    numberClass:
      "text-[#0ea972] shrink-0 rounded-xl bg-[#E6FAF3] w-[28px] h-[32px] text-center leading-[32px]",
    ctaClass: "bg-[#E6FAF3] text-accent-500",
    ctaArrowColor: "#0ea972",
    btnText: "ایجاد پروژه حسابداری",
    to: paths.employer.projectsCreate,
    role: "employer" as const,
  },
  {
    featureTitle: "درخواست انجام اظهار نامه مالیاتی",
    icon: "svg:bag-icon",
    points: resumeBankPoints,
    boxClass:
      "bg-gradient-to-bl from-[#C5772E] to-[#fff] border-2 border-[#DCAE82]",
    numberClass:
      "text-[#b95c04] shrink-0 rounded-xl bg-[#FFF5EB] w-[28px] h-[32px] text-center leading-[32px]",
    ctaClass: "bg-[#FFF5EB] text-warning-500",
    ctaArrowColor: "#b95c04",
    btnText: "درخواست اظهارنامه مالیاتی",
    to: paths.employer.taxReturnCreate,
    role: "employer" as const,
  },
];

const trustStats = [
  { value: 24000, label: "متخصص و حسابدار" },
  { value: 36000, label: "پروژه ثبت شده" },
];

const darkFeatures = [
  {
    title: "صرفه‌جویی در زمان استخدام",
    description:
      "بدون نیاز به انتشار آگهی جدید، مستقیماً از بین رزومه‌های آماده و مرتبط انتخاب کنید.",
  },
  {
    title: "دسترسی به نیروهای منتخب",
    description:
      "رزومه‌های منتخب را ذخیره کنید و هر زمان که نیاز داشتید سریع وارد همکاری شوید.",
  },
  {
    title: "انتخاب آگاهانه و کم ریسک",
    description:
      "با مقایسه مهارت‌ها، سوابق و تخصص‌ها، بهترین گزینه را با اطمینان بیشتر انتخاب کنید.",
  },
];

const processSteps = [
  {
    title: "ثبت‌نام سازمان در های‌حساب",
    description:
      "در های‌حساب ثبت‌نام کنید و اطلاعات مربوط به سازمان خود را وارد کنید.",
  },
  {
    title: "انتخاب نوع نیاز: استخدام، پروژه یا اظهارنامه",
    description:
      "نوع همکاری مورد نیاز خود را مشخص کنید؛ استخدام حسابدار، ثبت پروژه حسابداری یا درخواست اظهارنامه.",
  },
  {
    title: "بررسی رزومه‌ها یا دریافت پیشنهاد همکاری",
    description:
      "رزومه‌های مرتبط را بررسی کنید یا پیشنهادهای همکاری از حسابداران متخصص دریافت نمایید.",
  },
  {
    title: "شروع همکاری با حسابدار مناسب",
    description:
      "پس از انتخاب حسابدار مناسب، فرآیند همکاری را آغاز کرده و نیاز مالی خود را برطرف کنید.",
  },
];

const testimonials: Testimonial[] = [
  {
    text: "تخصصی بودن های‌حساب باعث شد زمان کمتری صرف جست‌وجو کنیم و راحت‌تر به حسابداران متناسب با نیاز کسب‌وکارمان دسترسی داشته باشیم.",
    name: "مهدی هوشمند",
    role: "مدیر منابع انسانی",
    avatarClass: "from-[#FFE68C] to-[#FFF5CC]",
    iconClass: "text-[#C49A2E]",
  },
  {
    text: "فرآیند ثبت پروژه در های‌حساب ساده و سریع بود و توانستیم بدون دردسر با متخصصان مرتبط با نیاز مجموعه‌مان ارتباط بگیریم.",
    name: "امیر هنری",
    role: "مشاور مالی",
    avatarClass: "from-[#AFAAD4] to-[#FFFFFF]",
    iconClass: "text-[#6A5AA3]",
  },
  {
    text: "با کمک های‌حساب توانستیم در زمان کوتاه‌تری به رزومه حسابداران متخصص دسترسی پیدا کنیم و نیروی مناسب تیم مالی‌مان را انتخاب کنیم.",
    name: "مهیا ثابتی",
    role: "حسابدار ارشد",
    avatarClass: "from-[#9AEEF6] to-[#FFFFFF]",
    iconClass: "text-[#4A9AAD]",
  },
];

const faqCategories = [
  { id: FAQ_TYPE.hiring, label: "کارفرمایان" },
  { id: FAQ_TYPE.general, label: "عمومی" },
];
const faqs = faqsByType(FAQ_TYPE.hiring, FAQ_TYPE.general);

const expandedProcessStep = ref(-1);

const processIllustrations = [step0, step1, step2, step3, step4];

const activeProcessIndex = computed(() => {
  if (expandedProcessStep.value < 0) return 0;
  return Math.min(
    expandedProcessStep.value + 1,
    processIllustrations.length - 1,
  );
});

const activeProcessIllustration = computed(
  () => processIllustrations[activeProcessIndex.value] ?? step0,
);

const processScrollOffset = computed(() => {
  if (expandedProcessStep.value < 0) return 0;
  return PROCESS_STEP_OFFSETS[expandedProcessStep.value] ?? 0;
});

const processViewportHeight = computed(() => {
  if (expandedProcessStep.value < 0) return PROCESS_VIEWPORT_HEIGHTS[0];
  return (
    PROCESS_VIEWPORT_HEIGHTS[expandedProcessStep.value] ??
    PROCESS_VIEWPORT_HEIGHTS[0]
  );
});

const processImageHeight = computed(
  () => PROCESS_IMAGE_HEIGHTS[activeProcessIndex.value] ?? 853,
);

const shouldAnimateProcessScroll = computed(
  () => expandedProcessStep.value >= 1,
);

function toggleProcessStep(index: number) {
  expandedProcessStep.value = expandedProcessStep.value === index ? -1 : index;
}

useSeoMeta({
  title: "تأمین نیروی حسابداری تا خدمات مالی کسب‌وکار شما|های‌حساب",
  description:
    "از استخدام حسابدار تا برون‌سپاری پروژه‌های مالی و تنظیم و ارسال اظهارنامه، نیازهای حسابداری کسب‌وکارتان را در های‌حساب مدیریت کنید.",
});
</script>
