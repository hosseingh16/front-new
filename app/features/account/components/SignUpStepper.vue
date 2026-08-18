<template>
  <nav aria-label="مراحل ثبت‌نام" class="flex w-full justify-center">
    <ol class="flex items-center">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        class="flex items-center"
      >
        <div class="flex items-center gap-2">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-xl"
            :class="
              isReached(index)
                ? 'bg-[#4864E114] text-primary-500'
                : 'bg-surface-100 text-text-passive'
            "
          >
            <Icon :name="item.icon" size="20" class="size-5" />
          </div>
          <span
            class="whitespace-nowrap text-sm"
            :class="
              isReached(index) ? 'text-primary-500' : 'text-text-passive'
            "
          >
            {{ item.label }}
          </span>
        </div>
        <span
          v-if="index < items.length - 1"
          aria-hidden="true"
          class="mx-3 w-8 shrink-0 border-t-2 border-dotted"
          :class="
            isReached(index + 1) ? 'border-gray-600' : 'border-gray-300'
          "
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  current: number;
}>();

const items = [
  { id: 1, label: "شروع استفاده", icon: "lucide:user-round-check" },
  { id: 2, label: "انتخاب درخواست", icon: "lucide:pointer" },
  { id: 3, label: "تکمیل حساب کاربری", icon: "lucide:newspaper" },
] as const;

function isReached(index: number) {
  return index + 1 <= props.current;
}
</script>
