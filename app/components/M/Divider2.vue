<template>
  <div class="text-center">
    <Icon v-if="orange" name="svg:divider-3" size="30" />
    <Icon v-else-if="blue" name="svg:divider-2" size="30" />
    <Icon v-else-if="blue2" name="svg:divider-4" size="30" />
    <Icon v-else name="svg:divider-1" size="30" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  blue: Boolean,
  blue2: Boolean,
  orange: Boolean,
})
</script>
