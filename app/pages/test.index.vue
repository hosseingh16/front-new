<template>
  <div>
    <h1>This the home page</h1>
    <button @click="handleLogout"></button>
  </div>
</template>

<script setup>
definePageMeta({
 // middleware: "sanctum:auth",
});
</script>

<style lang="scss" scoped></style>
