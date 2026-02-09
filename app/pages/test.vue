<template>
  <div>
    {{ res }}
  </div>
</template>

<script setup>
const res = await $fetch("http://api.hihesab.local/api/ping", {});
console.log(res);
</script>

<style lang="scss" scoped></style>
