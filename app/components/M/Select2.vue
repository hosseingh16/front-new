<template>
  <div :class="{ 'opacity-50 pointer-events-none': disabled }">
    <p class="text-base relative mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400 mb-4 absolute -top-2">*</span>
    </p>
    <div v-if="isClient" ref="dropDownRef" class="relative inline-block w-full">
      <div
        role="combobox"
        :aria-expanded="open"
        :tabindex="disabled ? -1 : 0"
        class="bg-white cursor-pointer h-10 w-full rounded-lg border border-gray-300 flex justify-between items-center gap-2 pr-2 pl-2 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
        :style="`border-color:${error ? '#f7a09a' : borderColor}`"
        @click="toggleDropdown"
        @keydown="onTriggerKeydown"
      >
        <span
          class="text-sm font-normal line-clamp-1"
          :class="hasModelValue ? 'text-gray-700' : 'text-text-muted'"
        >
          {{
            options.find((x) => String(x.value) === String(model))?.label ||
            placeholder ||
            "انتخاب کنید"
          }}
        </span>
        <icons-chevron-down
          color="#4864E1"
          class="transition-transform duration-200"
          :class="{ 'rotate-180': open }"
        />
      </div>

      <div
        v-if="open"
        class="absolute mt-2 menu bg-white rounded-lg z-20 w-full p-0 shadow-sm border border-gray-200"
      >
        <div class="max-h-50 overflow-y-auto cursor-pointer">
          <div v-if="search && allOptions.length > 0" class="mb-4 mx-2">
            <m-text-field
              v-model="keyword"
              placeholder="جستجو"
              class="pr-0 placeholder:text-gray-default"
              clearable
            />
          </div>
          <div v-if="options2.length > 0" ref="optionsContainerRef" class="mx-2">
            <p
              v-for="(item, index) in options2"
              :data-index="index"
              @click="selectItem(item)"
              class="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              :class="{
                'bg-gray-200 font-semibold': String(item.value) === String(model),
                'bg-gray-100': index === highlightedIndex,
              }"
            >
              {{ item.label }}
            </p>
          </div>
          <div
            v-else
            class="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg min-h-20 flex justify-center items-center"
            @click="open = false"
          >
            موردی برای نمایش وجود ندارد
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from "~/types/select-item";

// Model
const model = defineModel<string | number>();

// Props
const props = defineProps({
  label: { type: String },
  placeholder: { type: String },
  required: Boolean,
  options: {
    type: Array as () => ISelectItem[],
    default: [],
  },
  borderColor: { type: String, default: "#E8E8E8" },
  error: { type: Boolean },
  disabled: { type: Boolean },
  search: { type: Boolean },
});

// Variables
const open = ref(false);
const isClient = ref(false);
const options2 = ref<ISelectItem[]>([]);
const allOptions = ref<ISelectItem[]>([]);
const keyword = ref("");
const dropDownRef = ref<HTMLElement | null>(null);
const optionsContainerRef = ref<HTMLElement | null>(null);
const highlightedIndex = ref(-1);

const hasModelValue = computed(
  () => model.value != null && model.value !== "",
);

// Watches
watch(
  () => props.options,
  () => {
    options2.value = props.options;
    allOptions.value = props.options;
  },
  { immediate: true },
);
watch(
  () => keyword.value,
  (val) => {
    options2.value = [...allOptions.value].filter((x) => x.label.includes(val));
    highlightedIndex.value = options2.value.length ? 0 : -1;
  },
);

watch(
  () => open.value,
  (isOpen) => {
    if (!isOpen) {
      highlightedIndex.value = -1;
      return;
    }
    const selectedIndex = options2.value.findIndex(
      (x) => String(x.value) === String(model.value),
    );
    highlightedIndex.value = selectedIndex;
  },
);

// Functions
const toggleDropdown = () => {
  if (props.disabled) return;
  open.value = !open.value;
};

const moveHighlight = (delta: number) => {
  const count = options2.value.length;
  if (!count) return;

  if (highlightedIndex.value < 0) {
    highlightedIndex.value = delta > 0 ? 0 : count - 1;
  } else {
    highlightedIndex.value = (highlightedIndex.value + delta + count) % count;
  }

  nextTick(() => {
    optionsContainerRef.value
      ?.querySelector(`[data-index="${highlightedIndex.value}"]`)
      ?.scrollIntoView({ block: "nearest" });
  });
};

const onTriggerKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return;

  switch (e.key) {
    case "Enter":
    case " ": {
      e.preventDefault();
      const highlighted = options2.value[highlightedIndex.value];
      if (open.value && highlighted) {
        selectItem(highlighted);
      } else {
        toggleDropdown();
      }
      break;
    }
    case "ArrowDown":
      e.preventDefault();
      if (!open.value) open.value = true;
      moveHighlight(1);
      break;
    case "ArrowUp":
      e.preventDefault();
      if (!open.value) open.value = true;
      moveHighlight(-1);
      break;
    case "Escape":
      open.value = false;
      keyword.value = "";
      break;
    case "Tab":
      open.value = false;
      keyword.value = "";
      break;
  }
};

const selectItem = (item: ISelectItem) => {
  if (props.disabled) return;
  model.value = item.value;
  open.value = false;
  keyword.value = "";
};

onMounted(() => {
  isClient.value = true;
  document.addEventListener("click", handleClickOutside, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside, true);
});
const handleClickOutside = (e: MouseEvent) => {
  if (!open.value) return;

  const target = e.target as Node;
  if (dropDownRef.value && !dropDownRef.value.contains(target)) {
    open.value = false;
    keyword.value = "";
  }
};
</script>
