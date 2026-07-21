<template>
  <div :class="{ 'pointer-events-none opacity-50': disabled }">
    <p v-if="label" class="relative mb-2 text-base">
      {{ label }}
      <span v-if="required" class="absolute -top-2 mb-4 text-red-400">*</span>
    </p>
    <div v-if="isClient" ref="dropDownRef" class="relative inline-block w-full">
      <div
        class="box-border flex h-10 max-h-10 min-h-10 w-full items-center gap-2 overflow-hidden rounded-lg border border-gray-default bg-white pr-2 pl-2"
        :style="`border-color:${error ? 'var(--color-danger-200)' : borderColor}`"
        @click="focusInput"
      >
        <div
          class="scrollbar-none flex h-6 min-w-0 flex-1 items-center gap-1 overflow-x-auto overflow-y-hidden"
        >
          <span
            v-for="item in selectedItems"
            :key="item.value"
            class="inline-flex h-6 max-h-6 shrink-0 items-center gap-1 rounded-md bg-surface-50 px-1.5 text-xs leading-none text-gray-700"
          >
            <span class="max-w-32 truncate">{{ item.label }}</span>
            <button
              type="button"
              class="flex h-4 w-4 shrink-0 items-center justify-center"
              :disabled="disabled"
              @click.stop="removeItem(item.value)"
            >
              <Icon name="svg:close" class="size-3" />
            </button>
          </span>

          <input
            ref="inputRef"
            :value="open && search ? keyword : ''"
            :readonly="!open || !search"
            :placeholder="inputPlaceholder"
            class="h-6 min-h-0 shrink-0 border-0 bg-transparent py-0 text-sm leading-5 font-normal outline-none placeholder:text-text-muted"
            :class="
              selectedItems.length && !open
                ? 'w-px min-w-0 max-w-px opacity-0'
                : 'min-w-12 flex-1'
            "
            @focus="openDropdown"
            @click.stop="openDropdown"
            @input="onSearchInput"
          />
        </div>

        <button
          type="button"
          class="flex shrink-0 items-center self-center"
          :disabled="disabled"
          @click.stop="toggleDropdown"
        >
          <icons-chevron-down
            color="#4864E1"
            class="transition-transform duration-200"
            :class="{ 'rotate-180': open }"
          />
        </button>
      </div>

      <div
        v-if="open"
        class="menu absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white p-0 shadow-sm"
      >
        <div class="max-h-50 overflow-y-auto">
          <div v-if="filteredOptions.length > 0" class="mx-2 space-y-1 py-2">
            <label
              v-for="item in filteredOptions"
              :key="item.value"
              class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              :class="{ 'bg-gray-100 font-semibold': isSelected(item) }"
            >
              <input
                v-model="model"
                type="checkbox"
                class="checkbox checkbox-primary p-1.5"
                :value="item.value"
              />
              <span>{{ item.label }}</span>
            </label>
          </div>
          <div
            v-else
            class="flex min-h-20 items-center justify-center px-3 py-2 text-sm text-gray-700"
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

const model = defineModel<Array<string | number>>({ default: () => [] });

const props = defineProps({
  label: { type: String },
  placeholder: { type: String },
  required: Boolean,
  options: {
    type: Array as () => ISelectItem[],
    default: () => [],
  },
  borderColor: { type: String, default: "var(--color-gray-default)" },
  error: { type: Boolean },
  disabled: { type: Boolean },
  search: { type: Boolean, default: true },
});

const open = ref(false);
const isClient = ref(false);
const allOptions = ref<ISelectItem[]>([]);
const keyword = ref("");
const dropDownRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const selectedItems = computed(() =>
  model.value.map((value) => ({
    value,
    label: getItemLabel(value),
  })),
);

const filteredOptions = computed(() => {
  if (!props.search || !keyword.value.trim()) return allOptions.value;
  return allOptions.value.filter((item) => item.label.includes(keyword.value));
});

const inputPlaceholder = computed(() => {
  if (open.value && props.search) return "جستجو";
  if (!model.value.length) return props.placeholder || "انتخاب کنید";
  return "";
});

watch(
  () => props.options,
  (options) => {
    allOptions.value = options;
  },
  { immediate: true },
);

function getItemLabel(value: string | number) {
  const match = props.options.find(
    (item) => String(item.value) === String(value),
  );
  return match?.label ?? String(value);
}

function isSelected(item: ISelectItem) {
  return model.value.some((value) => String(value) === String(item.value));
}

function removeItem(value: string | number) {
  if (props.disabled) return;
  model.value = model.value.filter((item) => String(item) !== String(value));
}

function focusInput() {
  if (props.disabled) return;
  inputRef.value?.focus();
  openDropdown();
}

function openDropdown() {
  if (props.disabled) return;
  if (!open.value) {
    open.value = true;
    keyword.value = "";
  }
  nextTick(() => inputRef.value?.focus());
}

function toggleDropdown() {
  if (props.disabled) return;

  if (open.value) {
    closeDropdown();
    return;
  }

  openDropdown();
}

function closeDropdown() {
  open.value = false;
  keyword.value = "";
}

function onSearchInput(event: Event) {
  if (!props.search || !open.value) return;
  keyword.value = (event.target as HTMLInputElement).value;
}

function handleClickOutside(e: MouseEvent) {
  if (!open.value) return;

  const target = e.target as Node;
  if (dropDownRef.value && !dropDownRef.value.contains(target)) {
    closeDropdown();
  }
}

onMounted(() => {
  isClient.value = true;
  document.addEventListener("click", handleClickOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside, true);
});
</script>
