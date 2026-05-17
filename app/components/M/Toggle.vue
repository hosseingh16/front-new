<template>
  <!-- FORM MODE -->
  <Field v-if="name" :name="name" v-slot="{ value, setValue, errorMessage }">
    <div
      class="gap-1 bg-surface-100 p-1 rounded-xl [&>.btn]:text-sm [&>.btn]:h-8"
      :class="sameWidth ? 'grid' : 'flex'"
      :style="sameWidth ? gridStyle : ''"
    >
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        class="btn btn-ghost text-caption"
        :class="
          value === item.value
            ? 'bg-white text-text-primary'
            : 'bg-surface-100 text-text-passive'
        "
        @click="setValue(item.value)"
      >
        {{ item.title }}
      </button>
    </div>

    <div v-if="errorMessage" class="text-xs text-red-500 mt-1">
      {{ errorMessage }}
    </div>
  </Field>

  <!-- STANDALONE MODE -->
  <div
    v-else
    class="gap-1 bg-surface-100 p-1 rounded-xl [&>.btn]:text-sm [&>.btn]:h-8"
    :class="sameWidth ? 'grid' : 'flex'"
    :style="sameWidth ? gridStyle : ''"
  >
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="btn btn-ghost text-caption"
      :class="
        model === item.value
          ? 'bg-white text-text-primary'
          : 'bg-surface-100 text-text-passive'
      "
      @click="model = item.value"
    >
      {{ item.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Field } from 'vee-validate';

const model = defineModel<string | number>();

const props = defineProps({
  name: String, // if exists => form mode
  items: {
    type: Array as () => { title: string; value: number | string }[],
    required: true,
  },
  sameWidth: Boolean,
});

const gridStyle = computed(() =>
  props.sameWidth ? `grid-template-columns: repeat(${props.items.length}, 1fr)` : '',
);
</script>
