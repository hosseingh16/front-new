<template>
  <div dir="rtl" class="min-h-screen bg-surface-100 py-6 px-4 md:py-10">
    <div
      class="mx-auto flex max-w-[920px] flex-col overflow-hidden rounded-xl bg-white shadow-sm md:flex-row md:min-h-[1100px]"
    >
      <!-- Sidebar -->
      <aside class="flex w-full shrink-0 flex-col bg-surface-soft p-4 md:w-[300px] border-l border-l-surface-200">
        <div
          class="mx-auto h-[92px] w-[92px] overflow-hidden rounded-2xl bg-[#b8d4f0]"
        >
          <img
            class="flex h-full w-full items-end justify-center bg-gradient-to-b from-[#c5dff5] to-[#9ec5e8]"
            src="/assets/vectors/example-avatar.svg"
            alt="علی مرادزاده"
          />
        </div>

        <h1 class="mt-5 text-center font-yb-bold text-xl text-text-tertiary">
          علی مرادزاده
        </h1>

        <section class="mt-6">
          <h2 class="font-yb-bold text-sm text-text-tertiary">مشخصات فردی</h2>
          <ul class="mt-3 space-y-2 text-sm leading-7 text-text-tertiary">
            <li v-for="item in personalInfo" :key="item.label" class="flex justify-between align-middle">
              <span class="text-text-tertiary">{{ item.label }}:</span>
              {{ item.value }}
            </li>
          </ul>
        </section>

        <section class="mt-6">
          <h2 class="font-yb-bold text-sm text-text-tertiary">اطلاعات تماس</h2>
          <ul class="mt-3 space-y-2 text-sm leading-7 text-text-tertiary">
            <li v-for="item in contactInfo" :key="item.label" class="flex justify-between align-middle">
              <span class="text-text-tertiary">{{ item.label }}:</span>
              {{ item.value }}
            </li>
          </ul>
        </section>

        <section class="mt-6">
          <h2 class="font-yb-bold text-sm text-text-tertiary">حقوق و سابقه کاری</h2>
          <ul class="mt-3 space-y-2 text-sm leading-7 text-text-tertiary">
            <li v-for="item in salaryInfo" :key="item.label" class="flex justify-between align-middle">
              <span class="text-text-tertiary">{{ item.label }}:</span>
              {{ item.value }}
            </li>
          </ul>
        </section>

        <div class="mt-auto pt-10 text-center text-xs leading-6 text-text-passive">
          <p class="text-text-tertiary">ساخته شده توسط های‌حساب</p>
          <p>رزومه‌ساز تخصصی حسابداران</p>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-6 md:p-8">
        <p class="text-left text-xs text-text-passive">
          بروز رسانی رزومه : ۱۴۰۴/۰۲/۲۴
        </p>

        <ResumeSection title="سوابق شغلی" :divider="false">
          <div
            v-for="(job, index) in workExperience"
            :key="index"
            class="py-4 flex justify-between align-middle"
          >
            <p class="font-semibold text-sm text-text-tertiary">
              {{ job.title }}
              <span class="font-normal text-text-tertiary">· {{ job.type }}</span>
            </p>
            <p class="text-sm text-text-passive">
              {{ job.company }} · {{ job.period }}
            </p>
          </div>
        </ResumeSection>

        <ResumeSection title="اطلاعات تحصیلی">
          <div
            v-for="(edu, index) in education"
            :key="index"
            class="py-4 flex justify-between align-middle"
          >
            <p class="font-semibold text-sm text-text-tertiary">
              {{ edu.degree }}
              <span class="font-normal text-text-tertiary">· {{ edu.field }}</span>
            </p>
            <p class="mt-1 text-sm text-text-passive">
              {{ edu.university }} · {{ edu.period }}
            </p>
          </div>
        </ResumeSection>

        <ResumeSection title="نرم افزار حسابداری">
          <div
            v-for="(software, index) in accountingSoftware"
            :key="index"
            class="py-4"
          >
            <div class="flex items-center gap-2">
              <div
                class="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-xs font-semibold text-primary-500"
              >
                {{ software.name.charAt(0) }}
              </div>
              <span class="font-semibold text-sm text-text-tertiary">{{ software.name }}</span>
            </div>
            <p class="mt-3 text-sm text-text-passive">میزان تسلط به زیر سیستم‌ها:</p>
            <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-text-passive text-sm justify-between">
              <span v-for="sub in software.subsystems" :key="sub.label">
                {{ sub.label }}:
                <span class="font-semibold text-text-tertiary">{{ sub.value }}</span>
              </span>
            </div>
          </div>
        </ResumeSection>

        <ResumeSection title="مهارت ها">
          <div class="space-y-5 py-2">
            <ResumeSkillBar
              v-for="skill in skills"
              :key="skill.label"
              :label="skill.label"
              :percent="skill.percent"
              color="primary"
            />
          </div>
        </ResumeSection>

        <ResumeSection title="ارزیابی بیمه ای و مالیاتی">
          <div class="space-y-5 py-2">
            <ResumeSkillBar
              v-for="skill in taxSkills"
              :key="skill.label"
              :label="skill.label"
              :percent="skill.percent"
              color="accent"
            />
          </div>
        </ResumeSection>
      </main>
    </div>
    <div class="flex justify-center mt-8">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs text-text-tertiary-300"
      >
        بازگشت به صفحه اصلی
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useSeoMeta({
  title: 'رزومه علی مرادزاده',
  robots: 'noindex, nofollow',
});

const personalInfo = [
  { label: 'عنوان شغلی', value: 'مشاور مالی' },
  { label: 'مدرک تحصیلی', value: 'لیسانس' },
  { label: 'موقعیت مکانی', value: 'مشهد، وکیل آباد' },
  { label: 'سن', value: '۳۶ سال' },
  { label: 'جنسیت', value: 'آقا' },
  { label: 'وضعیت تاهل', value: 'متاهل' },
];

const contactInfo = [
  { label: 'شماره همراه', value: '۰۹۰۲۰۱۲۴۰۲۰' },
  { label: 'پست الکترونیکی', value: 'Nezhadeh@Gmail.Com' },
];

const salaryInfo = [
  { label: 'حقوق درخواستی', value: '۲۰ تا ۲۵ میلیون تومان' },
  { label: 'سابقه کار', value: 'بین ۳ تا ۴ سال' },
];

const workExperience = [
  {
    title: 'حسابدار مالیاتی',
    type: 'تمام وقت',
    company: 'شرکت آریا گستر زمانه',
    period: 'از ۱۴۰۲ تا ۱۴۰۳',
  },
  {
    title: 'حسابدار مالیاتی',
    type: 'تمام وقت',
    company: 'شرکت آریا گستر زمانه',
    period: 'از ۱۴۰۲ تا ۱۴۰۳',
  },
];

const education = [
  {
    degree: 'کارشناسی',
    field: 'حسابداری',
    university: 'دانشگاه آزاد بوهمن',
    period: 'از ۱۳۹۶ تا ۱۴۰۰',
  },
  {
    degree: 'کارشناسی',
    field: 'حسابداری',
    university: 'دانشگاه آزاد بوهمن',
    period: 'از ۱۳۹۶ تا ۱۴۰۰',
  },
];

const accountingSoftware = [
  {
    name: 'اخوان',
    subsystems: [
      { label: 'انبار', value: '۶۰' },
      { label: 'مالی', value: '۸۰' },
      { label: 'حقوق', value: '۲۰' },
      { label: 'فروش', value: '۶۰' },
      { label: 'نقد و بانک', value: '۱۰۰' },
    ],
  },
  {
    name: 'اخوان',
    subsystems: [
      { label: 'انبار', value: '۶۰' },
      { label: 'مالی', value: '۸۰' },
      { label: 'حقوق', value: '۲۰' },
      { label: 'فروش', value: '۶۰' },
      { label: 'نقد و بانک', value: '۱۰۰' },
    ],
  },
];

const skills = [
  { label: 'میزان تسلط به اکسل', percent: 50 },
  { label: 'میزان تجربه در حوزه حسابداری پیمان', percent: 50 },
  { label: 'میزان آشنایی به حسابداری بهای تمام شده', percent: 50 },
  { label: 'میزان آشنایی به تهیه صورت مالی استاندارد', percent: 50 },
];

const taxSkills = [
  { label: 'میزان آشنایی با مالیات ارزش افزوده', percent: 50 },
  { label: 'میزان آشنایی به بیمه‌های پرسنلی و قراردادی', percent: 50 },
  { label: 'میزان آشنایی به مالیات عملکرد', percent: 50 },
  { label: 'میزان آشنایی به سامانه مودیان و پایانه‌های فروشگاهی', percent: 50 },
];
</script>
