<template>
  <aside
    class="fixed top-0 right-0 h-full py-5 bg-white w-72 border-l-2 border-t-2 border-gray-default flex flex-col justify-between max-lg:hidden [&_button]:text-sm [&_button]:font-normal"
  >
    <div class="flex flex-col gap-y-2 pt-16">
      <div v-for="(item, index) in sidebarMenu" class="px-4">
        <NuxtLink
          class="flex"
          :to="item.children?.length ? '' : item.to"
          @click="item.children?.length ? toggleOpenIndex(index) : null"
        >
          <button
            class="btn btn-block btn-ghost flex"
            :class="[
              item.children ? 'justify-between items-center' : 'justify-start',
              { 'bg-primary-50': route.path === item.to },
              route.path !== item.to ? 'hover:bg-gray-100' : 'hover:bg-primary-50',
            ]"
          >
            <div class="flex justify-start items-center">
              <Icon :name="`svg:${item.icon}`" />
              <span class="text-text-secondary mr-2">{{ item.label }}</span>
            </div>
            <icons-chevron
              v-if="item.children"
              class="transition-all duration-300"
              :class="{ 'rotate-180': openIndex === index }"
            />
          </button>
        </NuxtLink>
        <Transition name="accordion">
          <div
            v-if="item.children?.length && openIndex === index"
            class="text-sm mr-6 flex"
          >
            <div
              class="rounded-br-full mb-4 border-r-2 border-b-2 w-3 border-dotted border-[#cccccc]"
            >
              <div class="border-b-2 border-dotted border-[#cccccc] w-2 h-2 mt-4"></div>
              <div
                v-for="n in item.children.length - 2"
                class="border-b-2 border-dotted border-[#cccccc] w-2 h-2 mt-8"
              ></div>
            </div>
            <div class="w-full">
              <NuxtLink v-for="child in item.children" :to="child.to">
                <button
                  class="btn btn-block btn-ghost pr-2 flex justify-start hover:bg-gray-100"
                  :class="[
                    { 'bg-primary-50': route.path === child.to },
                    route.path !== child.to ? 'hover:bg-gray-100' : 'hover:bg-primary-50',
                  ]"
                >
                  <div class="flex justify-start items-center">
                    <Icon :name="`svg:${child.icon}`" />
                    <span class="text-text-secondary mr-2">{{ child.label }}</span>
                  </div>
                </button>
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
    </div>
    <div class="flex flex-col gap-y-2 border-t border-gray-default">
      <!-- <div class="border-b border-gray-default pb-4">
        <NuxtLink v-for="item in menus2" :to="item.to">
          <button class="btn btn-block btn-ghost flex justify-start">
            <Icon :name="`svg:${item.icon}`" />
            <span class="text-text-secondary">{{ item.title }}</span>
          </button>
        </NuxtLink>
      </div> -->
      <div class="flex gap-2 pt-3 px-4">
        <Avatar />
        <div class="flex flex-col gap-3">
          <span class="font-semibold">آرمان علیمرادی</span>
          <button class="flex items-center">
            <Icon name="svg:settings" />
            <span class="text-text-passive text-sm font-normal">تنظیمات</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types/panel-config';

// Props
defineProps<{
  sidebarMenu: MenuItem[];
}>();

// Variables
const openIndex = ref<number | null>(0);
const route = useRoute();

// Functions
function toggleOpenIndex(index: number) {
  openIndex.value = openIndex.value === index ? null : index;
}

// const menus1 = [
//   { title: 'پیشخوان', to: '#', icon: 'gauge-1' },
//   { title: 'رزومه‌های شغلی', to: '#', icon: 'search-briefcase', children: [] },
//   { title: 'آگهی‌ها', to: '#', icon: 'bag-3', children: [] },
// ];
// const menus2 = [
//   { title: 'نشان شده‌ها', to: '#', icon: 'bookmark-1' },
//   { title: 'رزومه من', to: '#', icon: 'work-history' },
//   { title: 'رزومه سازمان', to: '#', icon: 'buildings-5' },
// ];
</script>
