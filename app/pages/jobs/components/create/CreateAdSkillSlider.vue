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

const sliderValue = computed({
  get() {
    const level = getProficiencyLevel(model.value, props.proficiencies)
    if (level == null) return 0

    const stepCount = proficiencyItems.value.length || 1
    return Math.max(1, Math.round((level / stepCount) * 10))
  },
  set(value: number) {
    if (value <= 0) {
      model.value = null
      return
    }

    const steps = proficiencyItems.value
    if (!steps.length) {
      model.value = null
      return
    }

    const index = Math.min(
      steps.length - 1,
      Math.max(0, Math.ceil((value / 10) * steps.length) - 1),
    )
    model.value = String(steps[index]?.value ?? '') || null
  },
})
</script>
