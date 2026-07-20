<template>
  <div class="bg-surface-50">
    <div dir="rtl" class="max-w-384 w-full m-auto">
      <Header />
      <slot />
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
const { setForcedTheme } = useAppTheme()

setForcedTheme('light')

onUnmounted(() => {
  setForcedTheme(null)
})
</script>
