<template>
  <footer class="py-5 px-5 min-1000:px-40 bg-[#031C30] text-white">
    <p class="text-[24px] font-semibold">
      استخدام با معتبرترین سایت کاریابی و استخدامی ایران
    </p>
    <p class="mt-5">
      های‌حساب کنار شماست تا کسب و کارها، مطمئن و با حق انتخاب زیاد بتونن بهترین حسابدار
      رو انتخاب کنند و حسابدار ها هم بتوانند تخصص و توانایی هاشون رو به بازار عرضه کنند
      .های‌حساب نقطه نیاز به حسابدار و تخصص موجود در بازار هست جایی که بهترین کسب و کارها
      بهترین حسابدار ها رو پیدا می کنند .
    </p>
    <div class="mt-10 grid max-md:hidden md:grid-cols-6 gap-10">
      <div>
        <p class="font-semibold">لینک‌های مفید</p>
        <FooterLinks class="mt-3" />
      </div>
      <div>
        <p class="font-semibold">درباره های‌حساب</p>
        <FooterAbout class="mt-3" />
      </div>
      <div>
        <p class="font-semibold">راه‌های ارتباطی</p>
        <FooterPhone class="mt-3" />
      </div>
      <div class="md:col-span-2">
        <p class="font-semibold">شبکه‌های اجتماعی</p>
        <FooterSocials class="mt-3" />
      </div>
    </div>
    <div class="md:hidden rounded-lg mt-5 grid gap-4">
      <div
        v-for="(item, index) in items"
        :tabindex="index"
        class="collapse bg-[#191D33] rounded-lg"
      >
        <div class="text-sm collapse-title flex justify-between items-center px-6">
          {{ item.title }}
          <Icon name="mdi:chevron-down" />
        </div>
        <div class="collapse-content text-sm leading-8">
          <component :is="item.comp" />
        </div>
      </div>
    </div>
    <div class="flex flex-wrap gap-5 justify-center md:justify-between items-end mt-8">
      <p>دارای مجوز رسمی کاریابی الکترونیکی از وزارت کار، تعاون و رفاه اجتماعی</p>
      <div class="flex gap-3 flex-wrap justify-center">
        <NuxtImg src="/images/footer-img-1.png" />
        <NuxtImg src="/images/footer-img-2.png" />
        <NuxtImg src="/images/footer-img-3.png" />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { OldFooterAbout, OldFooterLinks, OldFooterPhone, OldFooterSocials } from '#components';

// Variables
const items = [
  { title: 'لینک‌های مفید', comp: OldFooterLinks },
  { title: 'درباره های‌حساب', comp: OldFooterAbout },
  { title: 'راه‌های ارتباطی', comp: OldFooterPhone },
  { title: 'شبکه‌های اجتماعی', comp: OldFooterSocials },
];
</script>
