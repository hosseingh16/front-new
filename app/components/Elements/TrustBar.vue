<template>
  <section class="bg-surface-100 py-12">
    <div class="custom-pad flex flex-col items-center text-center">
      <h2 class="font-yb-bold text-xl text-text-tertiary md:text-2xl">
        {{ title }}
      </h2>
      <p class="mt-3 max-w-3xl text-sm font-semibold leading-8 text-text-passive md:text-base">
        {{ subtitle }}
      </p>
    </div>

    <div
      class="mt-10 flex flex-col min-[1220px]:flex-row justify-around items-center gap-6 min-[1220px]:gap-2 leading-10"
    >
      <div
        ref="statsRef"
        class="px-5 min-[1220px]:pr-37.5 flex flex-wrap justify-center min-[1220px]:justify-end gap-6"
      >
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="relative mx-4 min-w-[220px] rounded-lg border border-[#E8E8E8] px-6 py-4"
        >
          <div class="text-center">
            <p class="font-yb-bold text-[28px] leading-none text-[#009F65]">
              +{{ toPersianDigits(displayValues[index] ?? 0) }}
            </p>
            <p class="mt-3 text-sm font-semibold text-text-tertiary">
              {{ stat.label }}
            </p>
          </div>
          <img
            :src="arrowUp"
            alt=""
            class="absolute top-1/2 -right-8 h-16 w-16 -translate-y-1/2"
          />
        </div>
      </div>

      <div
        v-if="showBanks"
        class="pr-5 min-[1220px]:pl-37.5 flex gap-12 overflow-x-auto no-scrollbar max-[450px]:w-full"
      >
        <div
          v-for="item in banks"
          :key="item.image"
          class="flex shrink-0 flex-col items-center leading-4"
        >
          <img :src="`/images/${item.image}`" alt="" class="h-12 w-12" />
          <span class="mt-4 text-[10px] font-semibold">{{ item.title }}</span>
          <span class="text-[10px] font-semibold text-gray-600">{{ item.subtitle }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import arrowUp from '~/assets/vectors/arrowup.svg'

export interface TrustBarStat {
  value: number
  label: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    stats?: TrustBarStat[]
    showBanks?: boolean
  }>(),
  {
    title: 'به جمع بیش از دو میلیون کسب و کار در های‌حساب بپیوندید',
    subtitle:
      'های‌حساب، مورد اعتماد بهترین سازمان‌ها همراه شما در جذب حرفه‌ای‌ترین نیروها',
    stats: () => [
      { value: 24000, label: 'متخصص و حسابدار' },
      { value: 24000, label: 'پروژه و آگهی' },
    ],
    showBanks: true,
  },
)

const statsRef = ref<HTMLElement | null>(null)
const displayValues = useCountUp(
  () => props.stats.map((stat) => stat.value),
  { root: statsRef },
)

const banks = [
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank1.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank2.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank3.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank4.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank5.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank6.png' },
]
</script>
