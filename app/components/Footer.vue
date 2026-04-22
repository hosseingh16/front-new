<template>
  <footer
    class="custom-pad bg-surface-100 pt-12 text-sm font-semibold flex flex-col md:flex-row flex-wrap items-center md:items-start justify-between gap-12 pb-20"
  >
    <div class="flex flex-col gap-4 max-md:hidden">
      <NuxtLink to="/">حسابدار</NuxtLink>
      <NuxtLink to="/">رزومه‌ساز</NuxtLink>
      <NuxtLink to="/">جست‌وجوی فرصت‌های‌ شغلی</NuxtLink>
      <NuxtLink to="/">ایجاد پروژه حسابداری</NuxtLink>
      <NuxtLink to="/">سوالات متداول</NuxtLink>
    </div>

    <div class="flex flex-col gap-4 max-md:hidden">
      <NuxtLink to="/">کسب و کار</NuxtLink>
      <NuxtLink to="/">ایجاد آگهی استخدام</NuxtLink>
      <NuxtLink to="/">ایجاد پروژه حسابداری</NuxtLink>
      <NuxtLink to="/">سوالات متداول</NuxtLink>
    </div>

    <div class="flex flex-col gap-4 max-md:hidden">
      <NuxtLink to="/">درباره ما</NuxtLink>
      <NuxtLink to="/">سوالات متداول</NuxtLink>
      <NuxtLink to="/">قوانین و مقررات</NuxtLink>
      <NuxtLink to="/">درباره ما</NuxtLink>
      <NuxtLink to="/">تماس ما</NuxtLink>
    </div>

    <div class="flex flex-col gap-4 max-md:hidden">
      <p>راه های ارتباطی</p>
      <p>(051)91012030</p>
      <p>(021)91300708</p>
    </div>

    <div class="flex flex-col gap-4">
      <p>شبکه های اجتماعی</p>
      <div class="flex justify-center items-center gap-1">
        <NuxtLink
          v-for="item in ['telegram', 'linkedin', 'instagram']"
          class="h-8 w-8 flex justify-center items-center bg-white rounded-lg"
        >
          <Icon :name="`svg:${item}`" />
        </NuxtLink>
      </div>
    </div>

    <div class="flex gap-3 flex-wrap justify-center">
      <NuxtImg src="/images/footer-img-1.png" />
      <NuxtImg src="/images/footer-img-2.png" />
      <NuxtImg src="/images/footer-img-3.png" />
    </div>
  </footer>
</template>
