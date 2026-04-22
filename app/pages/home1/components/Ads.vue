<template>
  <div class="px-5 md:px-[12%] hd:pt-8 pb-16">
    <div
      class="flex flex-wrap gap-6 justify-center min-[1220px]:justify-between items-center px-5 md:px-20 py-10 text-white relative bg-[url('/images/bg-2.png')] bg-cover bg-center rounded-t-[50px] rounded-br-[50px] rounded-bl-[16px]"
    >
      <div class="max-[1220px]:text-center">
        <div class="flex max-[1220px]:justify-center">
          <div class="w-28 text-center rounded-lg p-[2px] cls-1">
            <div class="text-black rounded-lg text-xs p-1 cls-2">استخدام بهترین‌ها</div>
          </div>
        </div>
        <p class="font-bold text-2xl mt-4">
          کارفرمای محترم ، های‌حساب دستیار استخدامی شماست
        </p>
        <p class="text-[#DEDEDE] mt-2">
          حساب کارفرمایی خود را بسازید ، اکنون ویترین
          <span class="bg-[#304295]">بهترین حسابدارها</span> پیش روی شما قرار دارد
        </p>
      </div>
      <button class="btn text-white bg-[#1B213B] border-0 shadow-none">
        <span>ایجاد اولین آگهی</span>
        <Icon name="svg:arrow-left" size="10" class="mr-2" />
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.cls-1 {
  background: linear-gradient(90deg, #c7d2fecc 0%, #d2e4ff 100%);
}

.cls-2 {
  background: linear-gradient(
    90deg,
    rgba(218, 226, 255, 0.4) 0%,
    rgba(199, 210, 254, 0.8) 49.52%,
    rgba(218, 226, 255, 0.4) 100%
  );
}
</style>
