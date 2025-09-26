<template>
  <div class="md:w-28 max-md:flex max-md:justify-center">
    <div class="rounded-lg text-xs p-2 text-center leading-3 cls-1">
      <slot />
    </div>
  </div>
</template>

<style lang="css" scoped>
.cls-1 {
  background: linear-gradient(
    90deg,
    rgba(218, 226, 255, 0.4) 0%,
    rgba(199, 210, 254, 0.8) 49.52%,
    rgba(218, 226, 255, 0.4) 100%
  );
  border: 1px solid;
  border-image-source: linear-gradient(90deg, rgba(72, 100, 225, 0.1) 0%, #d2e4ff 100%);
}
</style>
