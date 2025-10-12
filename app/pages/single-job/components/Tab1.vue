<template>
  <div>
    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        class="max-md:px-1 py-2 rounded-2xl border border-gray-300 bg-gray-100 flex flex-col items-center"
      >
        <Icon :name="`svg:${item.icon}`" class="mt-4" size="40" />
        <p class="text-xs md:text-14 text-gray-700 font-semibold">{{ item.title }}</p>
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

    <divider title="شرح شغل" class="mt-6"/>
    <m-read-more
      text="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
        گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و
        برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای
        کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان
        جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه
        ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می
        توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان
        رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل
        دنیای موجود طراحی اساسا مورد استفاده قرار گیرد."
    />
    
    <divider title="شرایط احراز" />
    <p v-for="item in conditions" class="text-14 font-semibold text-gray-800">
      {{ item }}
    </p>

    <divider title="مزایای سازمانی" class="mt-6" />
    <div
      v-for="item in benefits"
      class="text-14 font-semibold text-gray-800 flex items-center gap-2"
    >
      <div
        class="p-1 w-4 h-4 bg-[rgba(109,215,168,0.4)] rounded flex justify-center items-center"
      >
        <Icon name="svg:tick-1" />
      </div>
      <span>{{ item }}</span>
    </div>

    <divider title="مهارت‌های فنی مورد نیاز" class="mt-6" />
    <div class="grid md:grid-cols-2 gap-12 pl-8">
      <div v-for="item in skils" class="text-14 font-semibold text-gray-800 leading-0!">
        <p class="p-0">{{ item.title }}</p>
        <progress
          class="progress progress-primary h-[5px] bg-gray-200"
          :value="item.value"
          max="100"
        ></progress>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Divider from './Divider.vue';

// Variables
const items = ref<any[]>([
  { title: 'نرم‌فزار: سپیدار', icon: 'single-job-1' },
  { title: 'حقوق: 25 میلیون تومان', icon: 'single-job-1' },
  { title: 'سابقه کاری: بین 3 تا 6 سال', icon: 'single-job-1' },
]);
const conditions = ref<any[]>([
  'آشنایی با نرم افزارهای حسابداری',
  'توانایی کار به صورت تیمی ',
  'آشنایی با اصول و استاندارد های حسابداری',
  'مهارت در تهیه گزارش های مالی ',
]);
const benefits = ref<any[]>([
  'محیط پویا و صمیمی',
  'فضای رشد و یادگیری',
  'آشنایی با اصول و استاندارد های حسابداری',
  'مهارت در تهیه گزارش های مالی',
]);
const skils = ref<any[]>([
  { title: 'شناخت از مالیات به ارزش افزوده', value: 20 },
  { title: 'شناخت از مالیات عملکرد', value: 20 },
  { title: 'شناخت از مالیات موضوعات بیمه پرسنلی', value: 20 },
  { title: 'شناخت از مالیات سامانه مودیان', value: 20 },
]);
</script>
