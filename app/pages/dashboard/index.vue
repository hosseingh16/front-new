<template>
  <div>
    <p>پیشخوان</p>
    <button class="btn btn-primary mt-4" @click="notify">show toast</button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const notify = () => {
  const { $toast } = useNuxtApp();
  $toast.error('سلام، خوبی');
};
</script>
