<template>
  <div>
    <search />
    <recruitments />
    <ads />
    <m-divider orange />
    <presentation />
    <m-divider orange />
    <posts />
    <banner />
  </div>
</template>

<script setup lang="ts">
import Search from "./home/Search.vue";
import Recruitments from "./home/Recruitments.vue";
import Ads from "./home/Ads.vue";
import Presentation from "./home/Presentation.vue";
import Posts from "./home/Posts.vue";
import Banner from "./home/Banner.vue";
</script>
