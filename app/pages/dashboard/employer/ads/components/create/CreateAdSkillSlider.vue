<template>
  <Slider v-model="sliderValue" :label="label" />
</template>

<script setup lang="ts">
import Slider from '~/features/panel/cv/Slider.vue'
import {
  getProficiencyLevel,
  PROFICIENCY_NO_NEED,
} from '~/pages/jobs/utils/ad-benefits'
import type { ISelectItem } from '~/types/select-item'

const model = defineModel<string | null>({ default: null })

const props = defineProps<{
  label: string
  proficiencies: ISelectItem[]
}>()

const proficiencyItems = computed(() =>
  props.proficiencies.filter((item) => item.value !== PROFICIENCY_NO_NEED),
)

const sliderValue = ref(0)
let syncingFromSlider = false

function proficiencyLevelToSlider(level: number, stepCount: number) {
  if (stepCount <= 1) return 10
  return Math.round(((level - 1) / (stepCount - 1)) * 10)
}

function sliderToProficiencyIndex(value: number, stepCount: number) {
  if (stepCount <= 1) return 0
  return Math.min(
    stepCount - 1,
    Math.max(0, Math.round((value / 10) * (stepCount - 1))),
  )
}

function syncSliderFromModel() {
  const level = getProficiencyLevel(model.value, props.proficiencies)
  const stepCount = proficiencyItems.value.length

  if (level == null || !stepCount) {
    sliderValue.value = 0
    return
  }

  sliderValue.value = proficiencyLevelToSlider(level, stepCount)
}

function applySliderToModel(value: number) {
  if (value <= 0) {
    model.value = null
    return
  }

  const steps = proficiencyItems.value
  if (!steps.length) {
    model.value = null
    return
  }

  const index = sliderToProficiencyIndex(value, steps.length)
  model.value = String(steps[index]?.value ?? '') || null
}

watch(
  () => [model.value, props.proficiencies] as const,
  () => {
    if (syncingFromSlider) return
    syncSliderFromModel()
  },
  { immediate: true },
)

watch(sliderValue, (value) => {
  syncingFromSlider = true
  applySliderToModel(value)
  nextTick(() => {
    syncingFromSlider = false
  })
})
</script>
