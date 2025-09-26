<template>
  <div class="pt-12 pb-16 md:pt-20 grid grid-cols-1 1000:grid-cols-2 gap-20">
    <div class="px-[10%] md:pr-[10%]">
      <m-title-box>بانک اطلاعاتی</m-title-box>
      <m-titr class="mt-5">
        بانک رزومه حساب؛<br />چرا بهترین انتخاب برای<br />استخدام حسابداران است؟
      </m-titr>
      <p class="text-[#504F55] text-justify mt-5">
        در دنیای امروز که استخدام سریع و هدفمند اهمیت زیادی پیدا کرده، بانک رزومه حساب
        راهکاری حرفه‌ای، سریع و دقیق برای پیدا کردن حسابداران متخصص است. شما بدون نیاز به
        آگهی‌نویسی یا غربال کردن رزومه‌های نامرتبط، مستقیماً به رزومه‌های دسته‌بندی‌شده،
        کامل و قابل فیلتر دسترسی دارید.
      </p>
      <div class="mt-5 max-1000:text-center">
        <button class="btn btn-outline">ثبت‌نام و انتخاب حسابدار</button>
      </div>
    </div>
    <div
      class="bg-[url('@/assets/vectors/curve.svg')] bg-[top_10px_center] bg-no-repeat 1000:bg-[top_10px_right] max-1000:bg-[length:385px_335px] pr-10 max-1000:flex max-1000:justify-center"
    >
      <div>
        <cloud
          title="بدون نیاز به ثبت آگهی"
          description="مستقیم به سراغ رزومه‌های آماده برو"
        />
        <cloud
          title="جستجوی سریع و دقیق"
          description="فیلتر بر اساس تجربه، مهارت و نرم‌افزارهای تخصصی"
          is-orange
          class="mt-5"
        />
        <cloud
          title="دریافت پیشنهادات خودکار"
          description="سیستم هوشمند پیشنهاد بهترین گزینه‌ها بر اساس نیازهای شما"
          class="mt-5"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cloud from './Cloud.vue';
</script>
