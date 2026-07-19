<template>
  <div>
    <NuxtLink
      class="flex"
      :to="item.children?.length ? '' : item.to"
      @click="item.children?.length ? emit('toggle') : undefined"
    >
      <button
        class="btn btn-block btn-ghost flex"
        :class="[
          item.children ? 'items-center justify-between' : 'justify-start',
          { 'bg-primary-50': activePath === item.to },
          activePath !== item.to ? 'hover:bg-gray-100' : 'hover:bg-primary-50',
        ]"
      >
        <div class="flex items-center justify-start">
          <Icon :name="`svg:${item.icon}`" />
          <span class="mr-2 text-text-secondary">{{ item.label }}</span>
        </div>
        <icons-chevron
          v-if="item.children"
          class="transition-all duration-300"
          :class="{ 'rotate-180': open }"
        />
      </button>
    </NuxtLink>

    <Transition name="accordion">
      <div v-if="item.children?.length && open" class="mr-6 flex text-sm">
        <div
          class="mb-4 w-3 rounded-br-full border-b-2 border-r-2 border-dotted border-[#cccccc]"
        >
          <div class="mt-4 h-2 w-2 border-b-2 border-dotted border-[#cccccc]" />
          <div
            v-for="n in Math.max(item.children.length - 2, 0)"
            :key="n"
            class="mt-8 h-2 w-2 border-b-2 border-dotted border-[#cccccc]"
          />
        </div>
        <div class="w-full">
          <NuxtLink
            v-for="child in item.children"
            :key="child.key ?? child.to"
            :to="child.to"
          >
            <button
              class="btn btn-block btn-ghost flex justify-start pr-2 hover:bg-gray-100 my-2"
              :class="[
                { 'bg-primary-50': activePath === child.to },
                activePath !== child.to
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-primary-50',
              ]"
            >
              <div class="flex items-center justify-start">
                <Icon :name="`svg:${child.icon}`" />
                <span class="mr-2 text-text-secondary">{{ child.label }}</span>
              </div>
            </button>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/types/panel-config";

defineProps<{
  item: MenuItem;
  activePath: string;
  open?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();
</script>
