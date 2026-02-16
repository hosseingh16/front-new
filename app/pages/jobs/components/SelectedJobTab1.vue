<template>
  <div>
    <p class="font-yb-bold text-gray-800 mb-2">بررسی اجمالی شغل</p>
    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        class="max-md:px-1 py-2 rounded-2xl border border-gray-300 bg-gray-100 flex flex-col items-center"
      >
        <Icon :name="`svg:${item.icon}`" class="mt-4" size="40" />
        <p class="text-center text-xs md:text-sm text-gray-700 font-semibold">{{ item.title }}</p>
      </div>
    </div>

    <p class="font-yb-bold text-gray-800 mt-4">شرح شغل</p>
    <div>
      لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان
      گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و
      برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی
      می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و
      متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی
      الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید
      داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان
      مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود
      طراحی اساسا مورد استفاده قرار گیرد.
    </div>

    <p class="font-yb-bold text-gray-800 mt-4">مزایای سازمانی</p>
    <div
      v-for="item in benefits"
      class="text-sm font-semibold text-gray-800 flex items-center gap-2"
    >
      <div
        class="p-1 w-4 h-4 bg-[rgba(109,215,168,0.4)] rounded flex justify-center items-center"
      >
        <Icon name="svg:tick-1" />
      </div>
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Parameters
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
