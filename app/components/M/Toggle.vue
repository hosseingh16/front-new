<template>
  <!-- FORM MODE -->
  <Field v-if="name" :name="name" v-slot="{ value, setValue, errorMessage }">
    <div
      class="gap-1 rounded-xl border border-gray-default bg-surface-soft p-1 [&>.btn]:h-8 [&>.btn]:text-sm"
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
            ? 'border border-gray-default bg-white text-text-tertiary shadow-sm'
            : 'text-text-passive hover:text-text-secondary'
        "
        @click="setValue(item.value)"
      >
        {{ item.title }}
      </button>
    </div>

    <!-- <div v-if="errorMessage" class="text-xs text-red-500 mt-1">
      {{ errorMessage }}
    </div> -->
    <ErrorMessage :name="name" v-slot="{ message }">
      <div class="mt-1 flex items-center text-xs text-text-passive">
        <icons-close color="#EF4035" />
        <span>{{ message }}</span>
      </div>
    </ErrorMessage>
  </Field>

  <!-- STANDALONE MODE -->
  <div
    v-else
    class="gap-1 rounded-xl border border-gray-default bg-surface-soft p-1 [&>.btn]:h-8 [&>.btn]:text-sm"
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
          ? 'border border-gray-default bg-white text-text-tertiary shadow-sm'
          : 'text-text-passive hover:text-text-secondary'
      "
      @click="model = item.value"
    >
      {{ item.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ErrorMessage, Field } from 'vee-validate';

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
