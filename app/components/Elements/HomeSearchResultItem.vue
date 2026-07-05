<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-right transition-colors"
    :class="active ? 'bg-[#F6F8FE]' : 'hover:bg-surface-50'"
    @click="emit('select', item)"
  >
    <div
      class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#ECF4D9]"
    >
      <img
        v-if="item.image"
        :src="item.image"
        alt=""
        class="h-full w-full object-cover"
      />
      <Icon
        v-else
        :name="iconName"
        size="18"
        class="text-text-passive"
      />
    </div>

    <p class="min-w-0 flex-1 text-sm leading-6 text-text-tertiary">
      <span class="font-semibold">{{ item.title }}</span>
      <span v-if="item.detailValue" class="text-text-passive">
        . {{ item.detailLabel }}:
        <span class="text-text-tertiary">{{ item.detailValue }}</span>
      </span>
    </p>

    <icons-chevron
      v-if="active"
      class="-rotate-90 shrink-0 max-md:hidden"
      color="#4864e1"
      :size="14"
    />
  </button>
</template>

<script setup lang="ts">
import type { HomeSearchItem } from '~/types/home-search'
import { HOME_SEARCH_ITEM_ICONS } from '~/types/home-search'

const props = defineProps<{
  item: HomeSearchItem
  active?: boolean
}>()

const emit = defineEmits<{
  select: [item: HomeSearchItem]
}>()

const iconName = computed(() => HOME_SEARCH_ITEM_ICONS[props.item.tab])
</script>
