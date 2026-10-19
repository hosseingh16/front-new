<template>
  <div>
    <section class="bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-8">
      <div class="custom-pad flex flex-col items-center pt-16 md:pt-24">
        <h1 class="text-center text-2xl font-yb-bold text-text-tertiary">
          درباره ما
        </h1>
        <p
          class="mt-4 max-w-3xl text-center text-[18px] leading-8 text-text-tertiary"
        >
          های‌حساب؛ اولین شبکه تخصصی حسابداران ایران
        </p>
      </div>
    </section>

    <section class="custom-pad pb-16">
      <div
        class="mx-auto max-w-3xl space-y-6 text-sm leading-8 text-text-tertiary"
      >
        <p>
          های‌حساب فراتر از یک سایت استخدام، فضایی برای شکل‌گیری هویت حرفه‌ای
          حسابداران و همکاری‌های تخصصی با کسب‌وکارهاست. جایی که سوابق و تخصص
          حسابداران دیده می‌شود و کسب‌وکارها نیروی متناسب با نیاز خود را پیدا
          می‌کنند؛ شبکه‌ای که با حضور هر عضو، فرصت‌های بیشتری برای همه شکل
          می‌گیرد.
        </p>
        <p>
          های‌حساب یک پلتفرم تخصصی حوزه حسابداری است که امکان ارتباط میان
          کارجویان، کسب‌وکارها، کارفرمایان، متقاضیان پروژه‌های حسابداری و
          مشاوران مالی و مالیاتی را فراهم می‌کند.
        </p>
        <p>
          برای آشنایی با خدمات،
          <NuxtLink to="/jobs" class="text-primary-500">فرصت‌های شغلی</NuxtLink>،
          <NuxtLink to="/resume-builder" class="text-primary-500"
            >رزومه‌ساز</NuxtLink
          >
          و
          <NuxtLink to="/employers" class="text-primary-500">بخش کسب‌وکار</NuxtLink>
          را ببینید. اگر پرسشی دارید، از
          <NuxtLink to="/faq" class="text-primary-500">سوالات متداول</NuxtLink>
          یا
          <NuxtLink to="/contact" class="text-primary-500">تماس با ما</NuxtLink>
          استفاده کنید.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "درباره ما",
  description:
    "های‌حساب اولین شبکه تخصصی حسابداران ایران است؛ جایی برای دیده شدن تخصص حسابداران و پیدا کردن نیروی متناسب برای کسب‌وکارها.",
});
</script>
