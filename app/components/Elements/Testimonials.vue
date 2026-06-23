<template>
  <section
    class="flex flex-col items-center px-5 1000:px-37.5"
    :class="sectionClass"
  >
    <div
      class="flex items-center justify-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
      :class="badgeClass"
    >
      {{ badge }}
    </div>
    <p class="mt-6 text-center font-yb-bold text-2xl text-text-tertiary">
      {{ title }}
    </p>
    <p class="mt-4 text-center text-[18px] font-semibold text-text-tertiary">
      {{ subtitle }}
    </p>
    <div
      class="mt-8 flex gap-4 p-2 no-scrollbar max-[1000px]:w-full max-[1000px]:overflow-x-auto"
    >
      <div
        v-for="(testimonial, index) in testimonials"
        :key="testimonial.name"
        class="relative mt-5 w-[80%] shrink-0 600:w-1/2 1000:w-1/3"
      >
        <div
          class="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-b from-[#67EEC7] to-primary-500 font-yb-bold text-[22px] text-white"
        >
          {{ index + 1 }}
        </div>
        <div class="rounded-3xl rounded-br-none p-10 shadow-[0px_0px_10px_0px_#00000024]">
          <p class="mb-12 text-center text-caption text-text-tertiary">
            «{{ testimonial.text }}»
          </p>
        </div>
        <div class="-mt-15 flex flex-col items-center">
          <div
            class="h-32 w-32 rounded-full bg-surface-50 p-2 shadow-[0px_4px_10px_0px_#0000001A]"
          >
            <div
              class="h-full w-full rounded-full border-2 border-dashed border-primary-500 p-4"
            >
              <div
                class="flex h-full w-full items-center justify-center rounded-full bg-linear-to-b from-50% to-100%"
                :class="testimonial.avatarClass"
              >
                <img
                  :src="`/images/${testimonial.image}`"
                  alt=""
                  :class="testimonial.imageClass"
                />
              </div>
            </div>
          </div>
          <div class="mt-5 w-full text-center">
            <p class="text-sm font-semibold">{{ testimonial.name }}</p>
            <p class="mt-2 w-full text-caption text-primary-500">
              {{ testimonial.role }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface Testimonial {
  text: string
  name: string
  role: string
  image: string
  avatarClass: string
  imageClass?: string
}

withDefaults(
  defineProps<{
    badge: string
    title: string
    subtitle: string
    testimonials: Testimonial[]
    badgeClass?: string
    sectionClass?: string
  }>(),
  {
    badgeClass: '',
    sectionClass: '',
  },
)
</script>
