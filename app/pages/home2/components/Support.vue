<template>
  <div class="px-10 min-[1421px]:px-[20%] pt-20 pb-16 relative">
    <div class="max-[1421px]:hidden">
      <Icon name="svg:comment-1" size="40" class="absolute right-44 top-28" />
      <Icon name="svg:comment-2" size="40" class="absolute right-28 top-44" />
      <Icon name="svg:comment-2" size="40" class="absolute left-44 top-28 rotate-y-180" />
      <Icon name="svg:comment-1" size="40" class="absolute left-28 top-44" />
    </div>
    <div class="min-[1421px]:hidden">
      <Icon
        name="svg:comment-1"
        size="40"
        class="absolute right-10 bottom-10 rotate-y-180"
      />
      <Icon name="svg:comment-2" size="40" class="absolute left-10 top-12" />
    </div>
    <div
      class="flex flex-wrap justify-center min-[933px]:justify-between items-center px-20 text-white relative min-[933px]:h-[180px] bg-[url('/images/bg-2.png')] bg-cover bg-center rounded-t-[60px] rounded-br-[60px] rounded-bl-[20px] max-[933px]:pt-10"
    >
    <p class="bg-[#304295] px-1 text-sm leading-6 min-[933px]:hidden mb-5">همین حالا تماس بگیرید</p>
      <NuxtImg src="/images/person-3.png" width="200" class="max-[933px]:-mb-[31px] min-[933px]:mt-[10px] max-[933px]:order-1"/>
      <div class="min-[933px]:pl-20">
        <p class="font-bold text-2xl text-center max-[933px]:leading-12">پشتیبانی کامل تا زمان نهایی شدن استخدام</p>
        <div class="flex justify-center min-[933px]:justify-between items-center mt-3">
          <div class="flex items-center">
            <Icon name="svg:call" class="mb-2" />
            <span class="font-semibold mr-2">۹۱۰۱۲۰۳۰</span>
            <span class="text-sm mr-1">(۰۵۱)</span>
            <span class="mx-1">-</span>
            <span class="font-semibold">۹۱۳۰۰۷۰۸</span>
            <span class="text-sm mr-1">(۰۲۱)</span>
          </div>
          <p class="bg-[#304295] px-1 text-sm leading-6 max-[933px]:hidden">همین حالا تماس بگیرید</p>
        </div>
      </div>
    </div>
  </div>
</template>
