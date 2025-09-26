<template>
  <div>
    <div class="bg-[url('/images/bg-4.png')] bg-cover mt-10 px-5">
      <div class="flex flex-col items-center justify-center">
        <m-title-box class="max-md:hidden md:w-[165px]">
          <div class="flex items-center justify-between gap-1 px-1 h-[18px]">
            <m-circles :colors="['#C4D9FF', '#98BFFF', '#5599FF']" />
            <span class="leading-3">استخدام با های‌حساب</span>
          </div>
        </m-title-box>
        <h1 class="max-md:hidden font-bold text-[32px] mt-6 text-center leading-[52px]">
          <span class="text-primary-900">های‌حساب</span>
          بیش از +1000 فرصت شغلی
          <br />
          برای حسابداران حرفه‌ای
        </h1>
        <h1 class="md:hidden font-bold text-[30px] mt-6 leading-[52px]">
          جستجو کنید<br>
          بیش از
          <span class="text-primary-900">+1000 فرصت شغلی</span>
        </h1>
        <p class="mt-5 text-gray-500 max-md:text-14">های‌حساب : اولین و بزرگترین مرجع استخدام حسابدار</p>
        <div class="flex flex-col lg:flex-row justify-center gap-x-6 gap-y-2 mt-5">
          <m-select
            placeholder="انتخاب مسیر شغلی"
            icon="user-search"
            :options="[
              { title: 'مسیر1', value: 1 },
              { title: 'مسیر2', value: 2 },
              { title: 'مسیر3', value: 3 },
            ]"
          />
          <m-select
            placeholder="همه شهرها"
            icon="location"
            :options="[{ title: 'شهر1', value: 1 }]"
          />
          <button class="btn btn-primary">جستجو در مشاغل</button>
        </div>
      </div>
    </div>
    <p class="text-center mt-8 md:hidden text-xs text-[#767E89]">محبوب ترین مشاغل : حسابدار ، مشاور مالی</p>
    <div class="w-full px-5 md:px-40 mt-10">
      <div class="h-[2px] bg-[rgba(213,212,220,1)]"></div>
    </div>
  </div>
</template>
