<template>
  <div>
    <search />
    <recruitments />
    <ads />
    <m-divider2 orange />
    <presentation />
    <m-divider2 orange />
    <posts />
    <banner />
  </div>
</template>

<script setup lang="ts">
import Search from "./components/Search.vue";
import Recruitments from "./components/Recruitments.vue";
import Ads from "./components/Ads.vue";
import Presentation from "./components/Presentation.vue";
import Posts from "./components/Posts.vue";
import Banner from "./components/Banner.vue";
</script>
