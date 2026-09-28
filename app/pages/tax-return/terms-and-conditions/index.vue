<template>
  <div>
    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-6.png')] md:bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-8"
    >
      <div class="custom-pad flex flex-col items-center pt-16 md:pt-24">
        <span
          class="mb-6 inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-500"
        >
          خدمات های‌حساب
        </span>
        <h1 class="text-2xl text-text-tertiary font-yb-bold text-center">
          شرایط ثبت درخواست خدمات مالیاتی
        </h1>
        <p class="mt-4 max-w-3xl text-center text-[18px] leading-8 text-text-tertiary">
          با ثبت درخواست خدمات مالیاتی در های‌حساب، متقاضی تأیید می‌کند که موارد
          زیر را مطالعه و پذیرفته است.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="custom-pad pb-12">
      <div class="rounded-2xl py-6 md:py-10">
        <div
          class="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-8"
        >
          <!-- Table of Contents -->
          <aside
            class="h-fit self-start rounded-xl bg-white p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
          >
            <div class="mb-4 flex items-center gap-2 text-text-tertiary">
              <Icon name="lucide:list" size="18" class="shrink-0" />
              <p class="font-yb-bold text-sm">فهرست مطالب</p>
            </div>
            <ul class="space-y-3">
              <li v-for="section in sections" :key="section.id">
                <button
                  type="button"
                  class="w-full cursor-pointer text-right text-sm leading-6 transition-colors"
                  :class="
                    activeSection === section.id
                      ? 'font-semibold text-primary-500'
                      : 'text-text-passive hover:text-primary-500'
                  "
                  @click="scrollToSection(section.id)"
                >
                  {{ section.title }}
                </button>
              </li>
            </ul>
          </aside>

          <!-- Terms Content -->
          <div class="min-w-0 space-y-12 rounded-xl bg-white p-6 md:p-10">
            <section
              v-for="section in sections"
              :id="section.id"
              :key="section.id"
              class="scroll-mt-28"
            >
              <h2 class="font-yb-bold text-lg text-text-tertiary md:text-xl">
                {{ section.title }}
              </h2>
              <div class="mt-4 space-y-4 text-sm leading-8 text-text-passive">
                <p
                  v-for="(paragraph, index) in section.paragraphs"
                  :key="index"
                >
                  {{ paragraph }}
                </p>
                <ul
                  v-if="section.items?.length"
                  class="list-disc space-y-2 pr-5"
                >
                  <li v-for="(item, index) in section.items" :key="index">
                    {{ item }}
                  </li>
                </ul>
                <p
                  v-for="(paragraph, index) in section.afterParagraphs"
                  :key="`after-${index}`"
                >
                  {{ paragraph }}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
type TermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
  afterParagraphs?: string[];
};

const sections: TermsSection[] = [
  {
    id: "services",
    title: "۱. نحوه ارائه خدمات",
    paragraphs: [
      "های‌حساب صرفاً بستر ارتباط میان متقاضی و مشاوران مالیاتی تأییدشده را فراهم می‌کند و ارائه خدمات تخصصی توسط مشاور انجام می‌شود.",
    ],
  },
  {
    id: "information",
    title: "۲. اطلاعات ثبت‌شده",
    paragraphs: [
      "متقاضی موظف است اطلاعات اولیه وارد شده در فرم درخواست را صحیح و کامل ثبت کند. بررسی جزئیات پرونده، دریافت مدارک و اطلاعات تکمیلی پس از اتصال، توسط مشاور انجام خواهد شد.",
    ],
  },
  {
    id: "request-fee",
    title: "۳. هزینه ثبت درخواست",
    paragraphs: [
      "برای ثبت درخواست و شروع فرآیند هماهنگی با مشاور، مبلغ مشخصی به‌عنوان هزینه ثبت درخواست دریافت می‌شود. این مبلغ مربوط به ثبت و پیگیری درخواست است و جزو هزینه انجام اظهارنامه محسوب نمی‌شود.",
    ],
  },
  {
    id: "service-fee",
    title: "۴. هزینه انجام اظهارنامه",
    paragraphs: [
      "بازه هزینه انجام و ارسال اظهارنامه هر مشاور در صفحه معرفی او نمایش داده می‌شود. مبلغ نهایی خدمت پس از بررسی اطلاعات کسب‌وکار و شرایط پرونده توسط مشاور اعلام خواهد شد.",
    ],
  },
  {
    id: "responsibility",
    title: "۵. مسئولیت نتیجه پرونده مالیاتی",
    paragraphs: [
      "های‌حساب نتیجه مشخصی مانند میزان مالیات، پذیرش اظهارنامه، نتیجه رسیدگی یا نتیجه پرونده مالیاتی را تضمین نمی‌کند. مسئولیت ارائه خدمات تخصصی بر عهده مشاور و صحت اطلاعات ارائه‌شده بر عهده متقاضی است.",
    ],
  },
  {
    id: "consultant-contact",
    title: "۶. ارتباط با مشاور",
    paragraphs: [
      "پس از ثبت درخواست، تیم پشتیبانی های‌حساب برای هماهنگی ادامه فرآیند با متقاضی و مشاور در ارتباط خواهد بود.",
    ],
  },
];

const activeSection = ref(sections[0]?.id ?? "");

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  activeSection.value = id;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

onMounted(() => {
  const hash = window.location.hash.replace("#", "");
  if (hash && sections.some((section) => section.id === hash)) {
    nextTick(() => scrollToSection(hash));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]?.target.id) {
        activeSection.value = visible[0].target.id;
      }
    },
    {
      rootMargin: "-120px 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 1],
    },
  );

  sections.forEach((section) => {
    const element = document.getElementById(section.id);
    if (element) observer.observe(element);
  });

  onUnmounted(() => observer.disconnect());
});

useSeoMeta({
  title: "شرایط ثبت درخواست خدمات مالیاتی | های‌حساب",
  description:
    "شرایط ثبت درخواست خدمات مالیاتی در های‌حساب؛ نحوه ارائه خدمات، هزینه ثبت درخواست، هزینه انجام اظهارنامه و مسئولیت نتیجه پرونده مالیاتی.",
});
</script>
