<template>
  <div class="bg-surface-50">
    <SiteTopBanner />
    <div class="w-full border-b border-[#e8e8e8] bg-white">
      <div class="m-auto w-full max-w-384">
        <Header />
      </div>
    </div>
    <slot />
    <Footer />
  </div>
</template>

<script setup lang="ts">
const { setForcedTheme } = useAppTheme();

setForcedTheme("light");

onUnmounted(() => {
  setForcedTheme(null);
});
</script>
