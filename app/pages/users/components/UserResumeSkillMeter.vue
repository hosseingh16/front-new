<template>
  <div class="my-5">
    <p v-if="label" class="mb-4 text-sm text-text-passive">{{ label }}</p>
    <div class="flex items-center justify-center gap-px rounded-full bg-surface-50 px-1 py-3 select-none">
      <template v-for="(step, index) in steps" :key="step">
        <div class="relative">
          <div
            class="rounded-full"
            :class="dotSizeClass(index)"
            :style="{ backgroundColor: isActive(index) ? color : '#EBEBEB' }"
          />
          <span class="absolute -right-px top-8 text-[9px] text-text-passive">{{ step }}</span>
        </div>

        <div
          v-if="index < steps.length - 1"
          class="w-full rounded-full"
          :class="connectorSizeClass(index)"
          :style="{ backgroundColor: isConnectorActive(index) ? color : '#EBEBEB' }"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  percent: number
}>()

const steps = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100']

const activeLevel = computed(() =>
  Math.max(0, Math.min(10, Math.round(props.percent / 10))),
)

const color = computed(() => (props.percent <= 50 ? '#FFA726' : '#2E7D32'))

const dotSizes = [
  'h-1 w-1',
  'h-1.25 w-1.25',
  'h-1.5 w-1.5',
  'h-1.75 w-1.75',
  'h-2 w-2',
  'h-2.25 w-2.25',
  'h-2.5 w-2.5',
  'h-2.75 w-2.75',
  'h-3 w-3',
  'h-3.25 w-3.25',
  'h-3.5 w-3.5',
]

const connectorSizes = [
  'h-1',
  'h-1.25',
  'h-1.5',
  'h-1.75',
  'h-2',
  'h-2.25',
  'h-2.5',
  'h-2.75',
  'h-3',
  'h-3.25',
]

function isActive(index: number) {
  return index <= activeLevel.value
}

function isConnectorActive(index: number) {
  return index < activeLevel.value
}

function dotSizeClass(index: number) {
  return dotSizes[index] ?? dotSizes[dotSizes.length - 1]
}

function connectorSizeClass(index: number) {
  return connectorSizes[index] ?? connectorSizes[connectorSizes.length - 1]
}
</script>
