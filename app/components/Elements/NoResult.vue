<template>
  <div class="py-12 text-center" :class="wrapperClass">
    <img
      v-if="iconSrc"
      :src="iconSrc"
      alt=""
      class="mx-auto block object-contain"
      :width="iconSize"
      :height="iconSize"
    />
    <Icon v-else :name="icon" :size="iconSize" />
    <h5 :class="['font-yb-bold text-lg text-text-tertiary', { '-mt-[70px]': !!iconSize && iconSize >= 160 }]">
      {{ title }}
    </h5>
    <p v-if="description" class="mx-auto mt-2 max-w-lg text-sm text-text-passive">
      {{ description }}
    </p>

    <div
      v-if="hasLinkActions"
      class="mt-6 grid grid-cols-1 gap-3 sm:mx-auto sm:max-w-lg"
      :class="hasSecondaryAction ? 'sm:grid-cols-2' : 'sm:max-w-xs'"
    >
      <NuxtLink
        v-if="secondaryActionLabel && secondaryActionTo"
        :to="secondaryActionTo"
        class="btn order-2 h-11 rounded-lg border-none bg-surface-100 font-yb-bold text-text-tertiary hover:bg-surface-200 sm:order-1"
      >
        {{ secondaryActionLabel }}
      </NuxtLink>
      <NuxtLink
        v-if="actionLabel && actionTo"
        :to="actionTo"
        class="btn btn-success order-1 h-11 gap-2 rounded-lg px-8 font-yb-bold sm:order-2"
      >
        <Icon
          v-if="actionIcon"
          :name="actionIcon"
          :size="actionIconSize"
          class="shrink-0 brightness-0 invert"
        />
        {{ actionLabel }}
      </NuxtLink>
    </div>
    <button
      v-else-if="actionLabel"
      type="button"
      class="btn btn-success mt-6 h-11 gap-2 px-8"
      @click="emit('action')"
    >
      <Icon
        v-if="actionIcon"
        :name="actionIcon"
        :size="actionIconSize"
        class="shrink-0 brightness-0 invert"
      />
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    iconSize?: number
    wrapperClass?: string
    icon?: string
    iconSrc?: string
    actionLabel?: string
    actionTo?: string
    secondaryActionLabel?: string
    secondaryActionTo?: string
    actionIcon?: string
    actionIconSize?: number | string
  }>(),
  {
    title: 'فرصت شغلی موجود نیست',
    description: 'متاسفانه هیچ فرصت شغلی جهت نمایش موجود نیست!',
    iconSize: 240,
    wrapperClass: '',
    icon: 'svg:no-result',
    iconSrc: '',
    actionLabel: '',
    actionTo: '',
    secondaryActionLabel: '',
    secondaryActionTo: '',
    actionIcon: '',
    actionIconSize: 16,
  },
)

const emit = defineEmits<{
  action: []
}>()

const hasSecondaryAction = computed(
  () => Boolean(props.secondaryActionLabel && props.secondaryActionTo),
)

const hasLinkActions = computed(
  () => Boolean(props.actionLabel && props.actionTo) || hasSecondaryAction.value,
)
</script>
