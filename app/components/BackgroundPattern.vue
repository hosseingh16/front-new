<template>
  <div
    class="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
    aria-hidden="true"
  >
    <img
      :src="pattern"
      alt=""
      class="absolute select-none opacity-80"
      :class="sizeClass"
      :style="imageStyle"
      draggable="false"
    />
  </div>
</template>

<script setup lang="ts">
import pattern from '~/assets/vectors/pattern.png'

const props = withDefaults(
  defineProps<{
    position: 'left' | 'right'
    side?: string
    top?: string
    size?: 'small' | 'medium' | 'large'
  }>(),
  {
    side: '-3.75rem',
    top: '25%',
    size: 'medium',
  },
)

const sizeClass = computed(() => {
  const sizes = {
    small: 'w-24 md:w-32',
    medium: 'w-32 md:w-64',
    large: 'w-40 md:w-80',
  }
  return sizes[props.size]
})

const imageStyle = computed(() => ({
  top: props.top,
  left: props.position === 'left' ? props.side : undefined,
  right: props.position === 'right' ? props.side : undefined,
  transform:
    props.position === 'left'
      ? 'translateX(-25%) translateY(-50%)'
      : 'translateX(25%) translateY(-50%) scaleX(-1)',
}))
</script>
