<template>
  <div>
    <NuxtLink
      v-if="!item.disabled && !item.children?.length"
      :to="item.to"
      class="flex"
    >
      <span
        class="btn btn-block btn-ghost flex"
        :class="itemButtonClass"
      >
        <div class="flex items-center justify-start">
          <Icon
            :name="`${item.icon}`"
            class="size-5 shrink-0 text-text-passive"
            size="20"
          />
          <span class="mr-2 text-text-secondary">
            {{ item.label }}
          </span>
        </div>
      </span>
    </NuxtLink>

    <div
      v-else
      class="flex"
      @click="onItemClick"
    >
      <button
        type="button"
        class="btn btn-block btn-ghost flex"
        :class="itemButtonClass"
        :disabled="item.disabled"
      >
        <div class="flex items-center justify-start">
          <Icon
            :name="`${item.icon}`"
            class="size-5 shrink-0 text-text-passive"
            size="20"
            :class="{ 'opacity-50': item.disabled }"
          />
          <span
            class="mr-2 text-text-secondary"
            :class="{ 'opacity-50': item.disabled }"
          >
            {{ item.label }}
          </span>
        </div>
        <icons-chevron
          v-if="item.children?.length"
          class="transition-all duration-300"
          :class="{ 'rotate-180': open, 'opacity-50': item.disabled }"
        />
      </button>
    </div>

    <Transition name="accordion">
      <div v-if="item.children?.length && open" class="mr-6 flex text-sm">
        <div
          class="mb-4 w-3 rounded-br-full border-b-2 border-r-2 border-dotted border-[#cccccc] dark:border-surface-200"
        >
          <div
            class="mt-4 h-2 w-2 border-b-2 border-dotted border-[#cccccc] dark:border-surface-200"
          />
          <div
            v-for="n in Math.max(item.children.length - 2, 0)"
            :key="n"
            class="mt-8 h-2 w-2 border-b-2 border-dotted border-[#cccccc] dark:border-surface-200"
          />
        </div>
        <div class="w-full">
          <template v-for="child in item.children" :key="child.key ?? child.to">
            <NuxtLink v-if="!child.disabled" :to="child.to">
              <span
                class="btn btn-block btn-ghost my-2 flex justify-start pr-2"
                :class="childButtonClass(child)"
              >
                <div class="flex items-center justify-start">
                  <Icon
                    :name="`${child.icon}`"
                    size="20"
                    class="size-5 shrink-0 text-text-passive"
                  />
                  <span class="mr-2 text-text-secondary">
                    {{ child.label }}
                  </span>
                </div>
              </span>
            </NuxtLink>
            <button
              v-else
              type="button"
              class="btn btn-block btn-ghost my-2 flex justify-start pr-2"
              :class="childButtonClass(child)"
              disabled
            >
              <div class="flex items-center justify-start">
                <Icon
                  :name="`${child.icon}`"
                  size="20"
                  class="size-5 shrink-0 text-text-passive opacity-50"
                />
                <span class="mr-2 text-text-secondary opacity-50">
                  {{ child.label }}
                </span>
              </div>
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/types/panel-config";

const props = defineProps<{
  item: MenuItem;
  activePath: string;
  open?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const itemButtonClass = computed(() => [
  props.item.children ? "items-center justify-between" : "justify-start",
  { "bg-primary-50": !props.item.disabled && props.activePath === props.item.to },
  props.item.disabled
    ? "cursor-not-allowed opacity-55 hover:bg-transparent"
    : props.activePath !== props.item.to
      ? "hover:bg-gray-100 dark:hover:bg-surface-200"
      : "hover:bg-primary-50",
]);

function childButtonClass(child: MenuItem) {
  return [
    { "bg-primary-50": !child.disabled && props.activePath === child.to },
    child.disabled
      ? "cursor-not-allowed opacity-55 hover:bg-transparent"
      : props.activePath !== child.to
        ? "hover:bg-gray-100 dark:hover:bg-surface-200"
        : "hover:bg-primary-50",
  ];
}

function onItemClick() {
  if (props.item.disabled) return;
  if (props.item.children?.length) emit("toggle");
}
</script>
