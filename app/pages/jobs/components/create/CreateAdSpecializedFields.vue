<template>
  <section class="overflow-visible rounded-2xl border border-gray-default bg-white p-4">
    <Titr>فیلدهای تخصصی</Titr>

    <m-select2-multi
      class="relative z-10 mt-6"
      v-model="form.company_software"
      label="نرم‌افزار حسابداری مورد استفاده در مجموعه:"
      :options="softwareOptions"
      placeholder="نرم‌افزار را انتخاب کنید"
      search
    />

    <div class="my-4 mt-8 grid gap-x-4 gap-y-12 lg:grid-cols-2">
      <CreateAdSkillSlider
        v-for="skill in skillFields"
        :key="skill.key"
        v-model="form[skill.key]"
        :label="skill.label"
        :proficiencies="proficiencies"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import type { CreateAdFormModel } from '~/types/create-ad-form'
import type { ISelectItem } from '~/types/select-item'
import CreateAdSkillSlider from './CreateAdSkillSlider.vue'

const props = defineProps<{
  form: CreateAdFormModel
  accountingPrograms: ISelectItem[]
  proficiencies: ISelectItem[]
}>()

const softwareOptions = computed(() => {
  if (props.accountingPrograms.length) return props.accountingPrograms
  return [
    { label: 'سپیدار', value: 'سپیدار' },
    { label: 'هلو', value: 'هلو' },
    { label: 'پارسیان', value: 'پارسیان' },
    { label: 'راهکاران', value: 'راهکاران' },
  ]
})

const skillFields = [
  {
    key: 'excel_skill' as const,
    label: 'سطح مورد نیاز به آشنایی به آفیس:',
  },
  {
    key: 'maliat_skill' as const,
    label: 'سطح مورد نیاز به آشنایی به مالیات:',
  },
  {
    key: 'bimeh_skill' as const,
    label: 'سطح مورد نیاز به آشنایی به بیمه:',
  },
  {
    key: 'baha_skill' as const,
    label: 'سطح مورد نیاز به آشنایی به نرم‌افزار حسابداری:',
  },
]
</script>
