<template>
  <div class="py-10 px-[10%]">
    <m-titr class="mt-5 text-center">سوالات متداول</m-titr>
    <p class="mt-3 text-gray-500 text-center">
      با خواندن نکات مربوط به استخدام که در قسمت زیر آمده، شانس خود را برای استخدام
      حسابدار افزایش دهید.
    </p>
    <div class="mt-10 md:px-20 grid gap-y-2">
      <div
        v-for="item in items"
        tabindex="0"
        class="collapse bg-base-100 border-base-300 border"
      >
        <div class="text-14 collapse-title font-semibold flex justify-between items-center px-5">
          {{ item.question }}
          <Icon name="svg:chevron-down" size="16" />
        </div>
        <div class="collapse-content text-sm leading-8">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان
          گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و
          برای شرایط فعلی تکنولوژی مورد نیاز
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables
const items = [
  {
    question: '1 : استفاده از امکانات استخدامی سایت برای حسابدار ها هزینه دارد ؟',
    answer: '',
  },
  {
    question: '2 : نمی خواهم رزومه من در بانک اطلاعاتی به کارفرماها نشان داده شود.',
    answer: '',
  },
  {
    question:
      '3 : چگونه می توانم از بانک رزومه های‌حساب برای استخدام حسابدار استفاده کنم ؟',
    answer: '',
  },
  {
    question:
      '4 : شماره تماس و مشخصات افراد انتخاب شده از بانک رزومه  چگونه قابل مشاهده است ؟',
    answer: '',
  },
];
</script>
