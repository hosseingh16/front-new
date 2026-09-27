<template>
  <div>
    <section class="bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-8">
      <div class="custom-pad flex flex-col items-center pt-16 md:pt-24">
        <h1 class="text-center text-2xl font-yb-bold text-text-tertiary">
          نمادها و مجوزها
        </h1>
        <p class="mt-4 max-w-3xl text-center text-[18px] leading-8 text-text-tertiary">
          نماد اعتماد الکترونیکی و سایر مجوزهای رسمی های‌حساب
        </p>
      </div>
    </section>

    <section class="custom-pad pb-16">
      <div
        class="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2"
      >
        <article
          class="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 text-center"
        >
          <EnamadSeal />
          <h2 class="font-yb-bold text-base text-text-tertiary">
            نماد اعتماد الکترونیکی
          </h2>
        </article>

        <article
          v-for="logo in otherLogos"
          :key="logo.src"
          class="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 text-center"
        >
          <img
            :src="logo.src"
            :alt="logo.alt"
            class="h-28 w-28 object-contain"
          />
          <h2 class="font-yb-bold text-base text-text-tertiary">
            {{ logo.alt }}
          </h2>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const otherLogos = [
  {
    src: "/images/footer-img-2.webp",
    alt: "نشان ملی ثبت رسانه‌های دیجیتال",
  },
];

useSeoMeta({
  title: "نمادها و مجوزها",
  description:
    "نماد اعتماد الکترونیکی و سایر مجوزهای رسمی های‌حساب.",
});
</script>
