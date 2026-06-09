<template>
  <div class="fixed bottom-0 lg:hidden w-full h-18 bg-white border-t-2 border-gray-default py-3 z-1000">
    <div class="grid grid-cols-5 gap-2">
      <div v-for="(item, index) in menus">
        <div v-if="index !== 2" class="flex flex-col items-center">
          <Icon :name="`svg:${item.icon}`" size="24" />
          <span class="text-[11px] text-text-secondary">{{ item.title }}</span>
        </div>
        <div v-else class="flex justify-center">
          <div
            class="w-12 h-12 rounded-full flex justify-center items-center bg-primary-100 -mt-8"
          >
            <Icon name="svg:gauge" />
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center" @click="showMenuFunc">
        <Icon :name="`svg:${showMenu ? 'menu-opened' : 'menu'}`" size="24" />
        <span
          class="text-[11px]"
          :class="showMenu ? 'text-primary-500' : 'text-text-secondary'"
          >منو</span
        >
      </div>

      <div v-if="showMenu" class="fixed top-16.5 left-0 right-0 bottom-40 bg-white">
        <panel-avatar-menu />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Variables
const menus = [
  { title: 'آگهی‌ها', to: '', icon: 'bag-1' },
  { title: 'پروژه‌ها', to: '', icon: 'projects' },
  { title: '', to: '', icon: '' },
  { title: 'فرصت‌ها', to: '', icon: 'jobs' },
];
const showMenu = useState('showBottomMenu_state', () => false);
const expandedCvCompletion = useState('expandedCvCompletion_state', () => false);

// Functions
function showMenuFunc() {
  showMenu.value = !showMenu.value;
  expandedCvCompletion.value = false;
}
</script>
