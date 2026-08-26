<template>
  <div class="flex w-full items-center justify-start gap-1.5">
    <div
      class="flex size-9 shrink-0 items-center justify-center rounded-md bg-[rgba(72,100,225,0.08)] text-primary-500"
    >
      <img
        v-if="iconSrc"
        :src="iconSrc"
        alt=""
        width="16"
        height="16"
        class="size-4"
        draggable="false"
      />
      <Icon
        v-else
        :name="icon"
        mode="svg"
        size="16"
        class="size-4 shrink-0"
      />
    </div>
    <div class="min-w-0 text-right leading-snug">
      <p class="text-[11px] text-text-passive">{{ label }}</p>
      <p class="text-xs font-semibold text-text-secondary">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import userSearchIcon from "~/assets/vectors/ad-req-user-search.svg?url";
import fileTextIcon from "~/assets/vectors/ad-req-file-text.svg?url";
import walletIcon from "~/assets/vectors/ad-req-wallet.svg?url";
import workHistoryIcon from "~/assets/vectors/ad-req-work-history.svg?url";
import certificateIcon from "~/assets/vectors/ad-req-certificate.svg?url";
import userIcon from "~/assets/vectors/ad-req-user.svg?url";

const ICON_SRC: Record<string, string> = {
  "ad-req-user-search": userSearchIcon,
  "ad-req-file-text": fileTextIcon,
  "ad-req-wallet": walletIcon,
  "ad-req-work-history": workHistoryIcon,
  "ad-req-certificate": certificateIcon,
  "ad-req-user": userIcon,
};

const props = defineProps<{
  label: string;
  value: string;
  icon: string;
}>();

const iconSrc = computed(() => {
  const key = props.icon.replace(/^svg:/, "");
  return ICON_SRC[key] ?? null;
});
</script>
