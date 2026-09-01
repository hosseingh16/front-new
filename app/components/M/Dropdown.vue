<template>
  <div
    ref="rootRef"
    class="dropdown ml-1"
    :class="{
      'dropdown-hover': hover,
      'dropdown-top': resolvedPlacement === 'top',
      'dropdown-start': align === 'start',
      'dropdown-end': align === 'end',
    }"
    @pointerdown="updatePlacement"
    @mouseenter="updatePlacement"
    @focusin="updatePlacement"
  >
    <div :tabindex="Math.round(1)">
      <slot name="btn" />
    </div>
    <div
      ref="contentRef"
      class="dropdown-content z-1100 min-w-62 w-fit max-w-[calc(100vw-2rem)] rounded-xl border-3 border-gray-default bg-surface-50 p-0 font-semibold shadow-sm"
      :class="[contentOffsetClass, alignClass]"
    >
      <Icon
        name="tabler:triangle-filled"
        size="12"
        class="absolute text-surface-200"
        :class="[
          resolvedPlacement === 'top' ? '-bottom-3 rotate-180' : '-top-3',
          align === 'end' ? 'right-5' : 'left-5',
        ]"
      />
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    hover?: boolean;
    placement?: "bottom" | "top" | "auto";
    align?: "start" | "end";
  }>(),
  {
    hover: false,
    placement: "bottom",
    align: "start",
  },
);

const rootRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const autoPlacement = ref<"top" | "bottom">("bottom");

const resolvedPlacement = computed(() =>
  props.placement === "auto" ? autoPlacement.value : props.placement,
);

const contentOffsetClass = computed(() => {
  if (resolvedPlacement.value === "top") return props.hover ? "mb-0" : "mb-2";
  return props.hover ? "mt-0" : "mt-2";
});

const alignClass = computed(() =>
  props.align === "end" ? "!right-0 left-auto" : "-left-1.25",
);

const HEADER_HEIGHT = 64;
const BOTTOM_NAV_HEIGHT = 72;
const FALLBACK_MENU_HEIGHT = 220;

function updatePlacement() {
  if (props.placement !== "auto" || !import.meta.client) return;

  const trigger = rootRef.value;
  if (!trigger) return;

  const rect = trigger.getBoundingClientRect();
  const menuHeight = Math.max(
    contentRef.value?.offsetHeight ?? 0,
    FALLBACK_MENU_HEIGHT,
  );
  const hasBottomNav = window.matchMedia("(max-width: 1023px)").matches;
  const spaceBelow =
    window.innerHeight - rect.bottom - (hasBottomNav ? BOTTOM_NAV_HEIGHT : 8);
  const spaceAbove = rect.top - HEADER_HEIGHT;

  autoPlacement.value =
    spaceBelow < menuHeight && spaceAbove > spaceBelow ? "top" : "bottom";
}

function closeOnScroll() {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return;
  if (!rootRef.value?.contains(active)) return;
  active.blur();
}

onMounted(() => {
  if (!import.meta.client) return;
  window.addEventListener("scroll", closeOnScroll, true);
});

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  window.removeEventListener("scroll", closeOnScroll, true);
});
</script>
