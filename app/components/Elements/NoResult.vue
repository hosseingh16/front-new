<template>
  <div class="py-12 text-center" :class="wrapperClass">
    <Icon name="svg:no-result" :size="iconSize" />
    <h5 class="font-yb-bold text-lg text-text-tertiary">{{ title }}</h5>
    <span class="text-sm text-text-passive">{{ description }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    iconSize?: number
    wrapperClass?: string
  }>(),
  {
    title: 'فرصت شغلی موجود نیست',
    description: 'متاسفانه هیچ فرصت شغلی جهت نمایش موجود نیست!',
    iconSize: 240,
    wrapperClass: '',
  },
)
</script>
