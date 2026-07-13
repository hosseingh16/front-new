<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-110 flex items-center justify-center p-4"
      dir="rtl"
      @keydown.escape="handleClose"
    >
      <div class="modal-backdrop absolute inset-0" @click="handleClose" />

      <div
        class="relative w-full max-w-[420px] overflow-visible rounded-2xl border border-gray-default bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.stop
      >
        <div
          class="flex flex-row-reverse items-center justify-between border-b border-gray-default px-4 py-4"
        >
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-opacity hover:opacity-80"
            aria-label="بستن"
            :disabled="loading"
            @click="handleClose"
          >
            <Icon name="svg:close" size="20" />
          </button>
          <h2 :id="titleId" class="font-yb-bold text-base text-text-tertiary">
            {{ title }}
          </h2>
        </div>

        <div class="relative overflow-hidden">
          <img
            :src="asidePattern"
            alt=""
            class="ad-request-action-modal-pattern pointer-events-none absolute -top-5 left-0 w-full origin-top"
            aria-hidden="true"
          />

          <div class="ad-request-action-modal-profile relative z-10 px-4 py-10">
            <div class="flex justify-center">
              <div
                class="flex h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#ECF4D9]"
              >
                <img
                  v-if="avatar"
                  :src="avatar"
                  :alt="name"
                  class="h-full w-full object-cover"
                />
                <span v-else class="font-yb-bold text-xl text-text-tertiary">
                  {{ userInitial }}
                </span>
              </div>
            </div>

            <h3
              class="mt-2 text-center font-yb-bold text-xl text-text-tertiary"
            >
              {{ name }}
            </h3>
          </div>
        </div>

        <div class="relative z-20 overflow-visible px-4 pb-5">
          <div class="relative z-30">
            <slot />
          </div>

          <div class="relative z-10 mt-5 grid grid-cols-2 gap-3">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import asidePattern from "~/assets/vectors/aside-pattern.svg?url";
import type { EmployerAdRequest } from "~/types/employer-ad-request";

const props = defineProps<{
  open: boolean;
  title: string;
  titleId: string;
  request: EmployerAdRequest | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const name = computed(() => props.request?.user?.name || "—");
const avatar = computed(() => props.request?.user?.avatar || null);
const userInitial = computed(() => {
  const value = name.value.trim();
  if (!value || value === "—") return "؟";
  return value.charAt(0);
});

function handleClose() {
  if (props.loading) return;
  emit("update:open", false);
}
</script>

<style scoped>
.ad-request-action-modal-profile::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 35% 60% at 50% 38%,
    rgb(255 255 255 / 0) 45%,
    rgb(255 255 255 / 35%) 52%,
    rgb(255 255 255 / 82%) 78%,
    #fff 100%
  );
}

.ad-request-action-modal-profile > * {
  position: relative;
  z-index: 1;
}

.ad-request-action-modal-pattern {
  mask-image: linear-gradient(
    to top,
    transparent 0%,
    rgb(0 0 0 / 40%) 50%,
    rgb(0 0 0 / 85%) 56%,
    #000 60%,
    #000 90%,
    rgb(0 0 0 / 60%) 97%,
    transparent 100%
  );

  -webkit-mask-image: linear-gradient(
    to top,
    transparent 0%,
    rgb(0 0 0 / 40%) 50%,
    rgb(0 0 0 / 85%) 56%,
    #000 60%,
    #000 90%,
    rgb(0 0 0 / 60%) 97%,
    transparent 100%
  );
}
</style>
