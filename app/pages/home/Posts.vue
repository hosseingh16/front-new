<template>
  <div class="px-5 md:px-[10%]">
    <m-titr class="text-center"
      >وبلاگ <span class="text-primary-900">های‌حساب</span></m-titr
    >
    <p class="text-gray-500 mt-2 text-center">
      از جدید ترین اخبار حسابداری با خبر شوید
    </p>
    <div class="mt-10 grid md:grid-cols-3 gap-10">
      <div v-for="post in posts" class="bg-gray-200 p-4 rounded-2xl">
        <NuxtImg :src="`/images/${post.img}`" class="w-full" />
        <h1 class="text-sm font-semibold mt-1">{{ post.title }}</h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Parameters
const posts = [
  { title: "آینده حسابداری در ایران ; فرصت ها و چالش ها", img: "blog-1.png" },
  { title: "همه چیز درباره حد نصاب معاملات در حسابداری", img: "blog-2.png" },
  {
    title: "راهنمای کامل برای موفقیت در مصاحبه شغلی حسابداری",
    img: "blog-3.png",
  },
];
</script>
