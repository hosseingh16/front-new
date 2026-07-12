<template>
  <div class="bg-surface-50">
    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-5.png')] bg-no-repeat bg-top pb-10 md:pb-16"
    >
      <div class="custom-pad pt-6">
        <nav class="text-sm text-text-passive">
          <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
            <Icon name="svg:home" size="16" />
          </NuxtLink>
          <span class="mx-2">/</span>
          <span>خدمات</span>
          <span class="mx-2">/</span>
          <span class="text-text-tertiary">کارفرمایان</span>
        </nav>
      </div>
      <div class="custom-pad flex flex-col items-center pt-8 md:pt-12">
        <span
          class="inline-flex items-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
        >
          استخدام سریع و مطمئن
        </span>
        <h1
          class="mt-6 max-w-4xl text-center font-yb-bold text-2xl leading-10 text-text-tertiary md:text-h1"
        >
          استخدام، پروژه و خدمات مالیاتی کسب‌وکارت را در های‌حساب مدیریت کن
        </h1>
        <p
          class="mt-4 max-w-3xl text-center text-base font-semibold leading-8 text-text-tertiary md:text-lg"
        >
          در های‌حساب می‌توانید آگهی استخدام ثبت کنید، پروژه حسابداری بسپارید،
          درخواست انجام اظهارنامه بدهید و از بانک رزومه حسابداران برای جذب نیروی
          مناسب استفاده کنید.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <button class="btn btn-primary gap-2 px-6">
            <Icon name="svg:user-plus-white" size="20" />
            ایجاد اولین آگهی
          </button>
          <button class="btn btn-outline border-success text-success px-6">
            درخواست اظهارنامه مالیاتی
          </button>
        </div>

        <img
          :src="heroMobile"
          alt="پنل کارفرمایان های‌حساب"
          class="mt-10 w-full max-w-md md:hidden"
        />
        <img
          :src="heroDesktop"
          alt="پنل کارفرمایان های‌حساب"
          class="mt-12 hidden w-full max-w-5xl md:block"
        />
      </div>
    </section>

    <TrustBar />

    <!-- Service Cards -->
    <section class="custom-pad bg-surface-100 py-12 md:py-16">
      <div class="flex flex-col items-center">
        <span
          class="inline-flex items-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
        >
          ارزش ها
        </span>
        <h2
          class="mt-4 text-center font-yb-bold text-xl text-text-tertiary md:text-2xl"
        >
          های‌حساب برای کارفرما چه کاری انجام می‌دهد؟
        </h2>
      </div>

      <div class="mt-10 space-y-6">
        <div
          v-for="(card, index) in serviceCards"
          :key="card.featureTitle"
          class="flex flex-col-reverse gap-6 overflow-hidden rounded-2xl bg-white p-6 md:flex-row md:items-stretch md:gap-10 md:p-8"
          :class="index != 1 ? 'md:flex-row-reverse' : ''"
        >
          <div class="flex flex-1 flex-col">
            <ol class="space-y-4">
              <li
                v-for="(point, i) in servicePoints"
                :key="point"
                class="flex items-start gap-3 text-sm leading-7 text-text-tertiary md:text-base"
              >
                <span :class="card.numberClass">
                  {{ i + 1 }}
                </span>

                <span>{{ point }}</span>
              </li>
            </ol>
            <NuxtLink
              :to="card.link"
              class="mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-opacity hover:opacity-80"
              :class="card.ctaClass"
            >
              {{ card.btnText }}
              <icons-arrow
                :color="card.ctaArrowColor"
                :size="14"
                class="rotate-45"
              />
            </NuxtLink>
          </div>

          <div
            class="flex w-full shrink-0 flex-col items-center justify-center rounded-2xl px-6 py-10 text-center md:w-72 lg:w-[450px]"
            :class="card.boxClass"
          >
            <Icon :name="card.icon" size="92" class="mb-5 text-white" />
            <p class="font-yb-bold text-base text-text-tertiary md:text-lg">
              {{ card.featureTitle }}
            </p>
            <p class="mt-2 text-xs leading-6 text-text-tertiary md:text-sm">
              {{ card.featureSubtitle }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Dark Feature Section -->
    <section
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
    </section>

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
                {{ index }} : {{ step.title }}
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
      title="آنچه کسانی که از خدمات ما استفاده کرده‌اند می‌گویند"
      subtitle="نظرات کارفرمایانی که با های‌حساب استخدام کرده‌اند"
      :testimonials="testimonials"
      class="pt-10 pb-12"
    />

    <FaqSection :categories="faqCategories" :items="faqs" />
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
import Testimonials, {
  type Testimonial,
} from "~/components/Elements/Testimonials.vue";

const PROCESS_STEP_OFFSETS = [0, 217, 449, 680];
const PROCESS_VIEWPORT_HEIGHTS = [217, 232, 241, 220];
const PROCESS_IMAGE_HEIGHTS = [853, 853, 853, 853, 903];

const servicePoints = [
  "جستجو بر روی بانک رزومه با ۱۴ فیلتر کاربردی مخصوص حسابداران",
  "انتقال رزومه های متناسب با کسب و کار شما به پوشه منتخب",
  "ایجاد آگهی استخدامی با توجه به نرم افزار و دانش مد نظر مجموعه شما",
  "استخدام توانمند ترین حسابدار",
];

const serviceCards = [
  {
    featureTitle: "آگهی استخدام رو ثبت کن",
    icon: "svg:bag-icon",
    featureSubtitle:
      "نوع نیازت رو انتخاب کن: استخدام دائم، حسابدار پاره وقت یا تمام وقت",
    boxClass:
      "bg-gradient-to-bl from-[#708FEA] to-[#fff] border-2 border-[#C6D2F7]",
    numberClass:
      "text-[#4864e1] rounded-xl bg-[#EBF0FC] w-[28px] h-[32px] text-center leading-[32px]",
    ctaClass: "bg-[#EBF0FC] text-primary-500",
    ctaArrowColor: "#4864e1",
    btnText: "ایجاد آگهی استخدام",
    link: "/account",
  },
  {
    featureTitle: "پروژه حسابداری رو ثبت کن",
    icon: "svg:bag-icon",
    featureSubtitle:
      "نوع نیازت رو انتخاب کن: نوع پروژه، میزان کار، بودجه مدنظر",
    boxClass:
      "bg-gradient-to-bl from-[#2BDCAF] to-[#fff] border-2 border-[#A0F8D5]",
    numberClass:
      "text-[#06c399] rounded-xl bg-[#E6FAF3] w-[28px] h-[32px] text-center leading-[32px]",
    ctaClass: "bg-[#E6FAF3] text-accent-500",
    ctaArrowColor: "#06c399",
    btnText: "ایجاد پروژه حسابداری",
    link: "/account",
  },
  {
    featureTitle: "درخواست انجام اظهارنامه مالیاتی",
    icon: "svg:bag-icon",
    featureSubtitle:
      "نوع نیازت رو انتخاب کن: نوع پروژه، میزان کار، بودجه مدنظر",
    boxClass:
      "bg-gradient-to-bl from-[#C5772E] to-[#fff] border-2 border-[#DCAE82]",
    numberClass:
      "text-[#b95c04] rounded-xl bg-[#FFF5EB] w-[28px] h-[32px] text-center leading-[32px]",
    ctaClass: "bg-[#FFF5EB] text-warning-500",
    ctaArrowColor: "#b95c04",
    btnText: "ایجاد پروژه حسابداری",
    link: "/tax-return",
  },
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
    text: "ما دنبال یک حسابدار دقیق و با‌تجربه بودیم. در این سایت خیلی راحت آگهی گذاشتیم. رزومه‌هایی که دریافت کردیم دقیق و فیلترشده بودند و سریع به نتیجه رسیدیم.",
    name: "فرزاد فرحزاد",
    role: "مدیر منابع انسانی موسسه کاسپین",
    image: "bank3.png",
    avatarClass: "from-[#FFE68C] to-[#FFF5CC] p-0",
  },
  {
    text: "فرآیند ثبت پروژه و دسترسی به نیروهای متخصص برای ما بسیار ساده و سریع بود. این پلتفرم کمک کرد در زمان کوتاه‌تری نیروی مناسب تیم مالی‌مان را پیدا کنیم.",
    name: "مریم یاوری",
    role: "مدیر ارشد منابع انسانی",
    image: "bank1.png",
    avatarClass: "from-[#AFAAD4] to-[#FFFFFF] p-2",
    imageClass: "w-[80%]",
  },
  {
    text: "با بانک رزومه های‌حساب توانستیم بدون آگهی‌نویسی، حسابدار مناسب شرکت را پیدا کنیم. فیلترهای تخصصی واقعاً در صرفه‌جویی زمان مؤثر بودند.",
    name: "مسعود شاه‌مرادی",
    role: "بنیان‌گذار خانومی",
    image: "bank2.png",
    avatarClass: "from-[#82E8F2] to-[#FFFFFF] p-2",
  },
];

const faqCategories = [
  { id: 1, label: "استخدام حسابدار" },
  { id: 2, label: "عمومی" },
];

const faqs = [
  {
    type: 1,
    question: "چگونه می‌توانم آگهی استخدام ثبت کنم؟",
    answer:
      "پس از ثبت‌نام به‌عنوان کارفرما، از بخش داشبورد می‌توانید آگهی استخدام جدید ایجاد کنید و فیلترهای تخصصی مورد نیاز خود را تعیین نمایید.",
  },
  {
    type: 1,
    question: "آیا می‌توانم بدون ثبت آگهی به رزومه‌ها دسترسی داشته باشم؟",
    answer:
      "بله. با استفاده از بانک رزومه می‌توانید مستقیماً رزومه‌های حسابداران را جستجو و فیلتر کنید و با متخصصان مورد نظر ارتباط برقرار کنید.",
  },
  {
    type: 1,
    question: "هزینه ثبت آگهی چقدر است؟",
    answer:
      "هزینه‌ها بر اساس نوع آگهی و خدمات انتخابی متفاوت است. جزئیات قیمت‌گذاری در بخش ثبت آگهی نمایش داده می‌شود.",
  },
  {
    type: 1,
    question: "چقدر طول می‌کشد تا رزومه دریافت کنم؟",
    answer:
      "معمولاً پس از انتشار آگهی، رزومه‌های مرتبط در همان روزهای اول دریافت می‌شوند. سرعت وابسته به نوع موقعیت شغلی و شرایط بازار است.",
  },
  {
    type: 2,
    question: "های‌حساب چیست؟",
    answer:
      "های‌حساب پلتفرم تخصصی استخدام حسابدار، ساخت رزومه، ثبت آگهی استخدام، ایجاد پروژه‌های حسابداری و خدمات مالیاتی است.",
  },
  {
    type: 2,
    question: "آیا اطلاعات شرکت من محرمانه باقی می‌ماند؟",
    answer:
      "بله. تمامی اطلاعات مطابق سیاست حریم خصوصی های‌حساب محافظت شده و فقط در چارچوب خدمات در اختیار کاربران مجاز قرار می‌گیرد.",
  },
];

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
  title: "بخش کارفرمایان | استخدام حسابدار",
  description:
    "استخدام حسابدار، دسترسی به بانک رزومه، ثبت آگهی و پروژه‌های حسابداری — پلتفرم تخصصی های‌حساب برای کارفرمایان",
});
</script>
