<template>
  <section
    class="flex flex-col items-center px-5 1000:px-37.5"
    :class="sectionClass"
  >
    <div
      class="flex items-center justify-center rounded-full bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
      :class="badgeClass"
    >
      {{ badge }}
    </div>
    <p
      class="mt-6 max-w-4xl text-center font-yb-bold text-xl leading-10 text-text-tertiary md:text-2xl"
    >
      {{ title }}
    </p>
    <p
      v-if="subtitle"
      class="mt-4 text-center text-[18px] font-semibold text-text-tertiary"
    >
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
        <div
          class="rounded-3xl border border-[#E8E8E8] bg-white px-6 py-8 shadow-[0px_4px_24px_0px_#0000000F] md:px-8 md:py-10"
        >
          <p class="mb-12 text-center text-sm leading-7 text-[#6f6f6f]">
            «{{ testimonial.text }}»
          </p>
        </div>
        <div class="-mt-15 flex flex-col items-center">
          <div
            class="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-[#C5C9DE] p-1.5"
          >
            <div
              class="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-linear-to-b"
              :class="[
                testimonial.image ? 'from-50% to-100%' : '',
                testimonial.avatarClass,
              ]"
            >
              <img
                v-if="testimonial.image"
                :src="`/images/${testimonial.image}`"
                alt=""
                class="max-h-full max-w-full object-contain"
                :class="testimonial.imageClass"
              />
              <svg
                v-else
                viewBox="0 0 16 17"
                class="h-14 w-14"
                :class="testimonial.iconClass"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M7.99935 8.41129C9.8403 8.41129 11.3327 6.91891 11.3327 5.07796C11.3327 3.23701 9.8403 1.74463 7.99935 1.74463C6.1584 1.74463 4.66602 3.23701 4.66602 5.07796C4.66602 6.91891 6.1584 8.41129 7.99935 8.41129Z"
                />
                <path
                  d="M7.99945 10.0776C4.65945 10.0776 1.93945 12.3176 1.93945 15.0776C1.93945 15.2643 2.08612 15.411 2.27279 15.411H13.7261C13.9128 15.411 14.0595 15.2643 14.0595 15.0776C14.0595 12.3176 11.3395 10.0776 7.99945 10.0776Z"
                />
              </svg>
            </div>
          </div>
          <div class="mt-5 w-full text-center">
            <p class="text-sm font-semibold text-[#5c5c5c]">
              {{ testimonial.name }}
            </p>
            <p class="mt-2 w-full text-caption text-[#7881A2]">
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
  image?: string
  avatarClass: string
  imageClass?: string
  iconClass?: string
}

withDefaults(
  defineProps<{
    badge: string
    title: string
    subtitle?: string
    testimonials: Testimonial[]
    badgeClass?: string
    sectionClass?: string
  }>(),
  {
    subtitle: '',
    badgeClass: '',
    sectionClass: '',
  },
)
</script>
