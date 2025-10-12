<template>
  <div>
    <div class="grid 440:grid-cols-3 gap-2">
      <div
        v-for="item in items"
        class="max-md:px-1 py-2 rounded-2xl border border-gray-300 bg-gray-100 flex flex-col items-center"
      >
        <Icon :name="`svg:${item.icon}`" class="mt-4" size="40" />
        <p class="text-xs md:text-14 text-gray-700">{{ item.title }}</p>
        <p class="font-bold text-gray-800 -mt-1">{{ item.value }}</p>
      </div>
    </div>

    <div class="md:hidden flex flex-col justify-between relative mt-8 mb-8">
      <NuxtImg
        src="/images/map.png"
        class="w-full h-full rounded-2xl border-2 border-[rgba(200,205,212,1)]"
      />
      <div
        class="absolute bottom-0 w-full bg-[rgba(245,246,248,1)] rounded-b-2xl p-5 border-2 border-[rgba(200,205,212,1)] border-t-0"
      >
        <div class="flex gap-2 items-start">
          <Icon name="svg:location-4" size="20" class="mt-1" />
          <div>
            <p class="font-bold text-gray-800">موقعیت مکانی</p>
            <p class="font-semibold text-14 text-[rgba(219,39,119,1)]">
              دفتر مرکزی خانومی
            </p>
            <p class="text-gray-700 text-14 font-normal">
              تهران - خیابان ولی‌عصر-ساختمان کیان، پلاک ۲۵۵۱
            </p>
          </div>
        </div>
      </div>
    </div>

    <divider title="مزایای شرکت خانومی" icon="buildings-2" />
    <divider title="فرهنگ کاری شرکت خانومی" icon="buildings-2" />
    <m-read-more
      text="ما در خانومی بر چند اصل مهم تاکید داریم و این اصول روابط کاری ما با هم دیگر را
          شکل می دهد.<br />پذیرش مسئولیت تام وظایفی که به عهده ماست در کنار گفتگو و تعامل
          سازنده و ایجاد شفافیت در فرآیندهای کاری، به ما در پیش برد امور کمک میکند.<br />ما
          در خانومی، اعتقاد به رشد و توسعه یکدیگر داریم و سعی میکنیم با ارائه فیدبک شفاف،
          به رشد هم کمک کنیم.<br />در خانومی همه مجاز به اشتباه کردن هستیم اما مسئولیت
          داریم تا از یک اشتباه یاد بگیریم و تکرار دوباره یک اشتباه برای هیچ یک از ما مجاز
          نیست.<br />ما بر این باوریم که خلق دستاوردهای بزرگ و تحقق رویاهای متعالیمان،
          بدون همراهی افرادی که با ما اهداف و ارزشهای همسو دارند، ممکن نیست و برای داشتن
          تیمی همراه و همسو هواره تلاش می کنیم. در خانومی همه مجاز به اشتباه کردن هستیم
          اما مسئولیت"
    />
  </div>
</template>

<script setup lang="ts">
import Divider from './Divider.vue';

// Variables
const items = [
  { title: 'تعداد پرسنل خانومی', value: '250 نفر', icon: 'people' },
  { title: 'سال تأسیس', value: '1368', icon: 'award' },
  { title: 'نوع مالکیت', value: 'خصوصی', icon: 'buildings' },
];
</script>
