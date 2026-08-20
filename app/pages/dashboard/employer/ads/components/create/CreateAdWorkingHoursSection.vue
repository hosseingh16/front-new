<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>ساعت کاری</Titr>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="min-w-0">
        <m-text-field
          v-model="form.work_schedule"
          label="ساعت و روز کاری:"
          placeholder="مثال: شنبه تا چهارشنبه ۸ تا ۱۶"
        />
        <div
          ref="scheduleScroller"
          class="no-scrollbar mt-2 flex cursor-grab flex-nowrap gap-2 overflow-x-auto overscroll-x-contain select-none active:cursor-grabbing"
          @pointerdown="onSchedulePointerDown"
          @pointermove="onSchedulePointerMove"
          @pointerup="onSchedulePointerUp"
          @pointercancel="onSchedulePointerUp"
          @click.capture="onScheduleClickCapture"
        >
          <button
            v-for="option in workScheduleSuggestions"
            :key="option"
            type="button"
            class="shrink-0 rounded-lg border px-3 py-1.5 text-xs whitespace-nowrap transition-colors"
            :class="
              form.work_schedule === option
                ? 'border-primary-500 bg-surface-soft text-primary-500'
                : 'border-gray-default bg-white text-text-secondary hover:border-primary-500/40'
            "
            @click="toggleSuggestion('work_schedule', option)"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div class="min-w-0">
        <m-text-field
          v-model="form.travel_need"
          label="میزان سفر کاری مورد نیاز:"
          placeholder="مثال: گاهی اوقات"
        />
        <div
          ref="travelScroller"
          class="no-scrollbar mt-2 flex cursor-grab flex-nowrap gap-2 overflow-x-auto overscroll-x-contain select-none active:cursor-grabbing"
          @pointerdown="onTravelPointerDown"
          @pointermove="onTravelPointerMove"
          @pointerup="onTravelPointerUp"
          @pointercancel="onTravelPointerUp"
          @click.capture="onTravelClickCapture"
        >
          <button
            v-for="option in travelNeedSuggestions"
            :key="option"
            type="button"
            class="shrink-0 rounded-lg border px-3 py-1.5 text-xs whitespace-nowrap transition-colors"
            :class="
              form.travel_need === option
                ? 'border-primary-500 bg-surface-soft text-primary-500'
                : 'border-gray-default bg-white text-text-secondary hover:border-primary-500/40'
            "
            @click="toggleSuggestion('travel_need', option)"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import type { CreateAdFormModel } from '~/types/create-ad-form'

const props = defineProps<{
  form: CreateAdFormModel
}>()

const workScheduleSuggestions = [
  'شنبه تا چهارشنبه ۸ تا ۱۶',
  'شنبه تا چهارشنبه ۸ تا ۱۷',
  'شنبه تا پنجشنبه ۸ تا ۱۴',
  'شنبه تا پنجشنبه ۸ تا ۱۶',
  'شناور',
  'توافقی',
]

const travelNeedSuggestions = [
  'ندارد',
  'به ندرت',
  'گاهی اوقات',
  'در حد معمول',
  'زیاد',
]

function useHorizontalDragScroll() {
  const scroller = ref<HTMLElement | null>(null)
  const DRAG_THRESHOLD = 8
  let pointerId: number | null = null
  let startX = 0
  let dragging = false
  let suppressClick = false
  let clearSuppress: number | null = null

  function clearClickSuppress() {
    suppressClick = false
    if (clearSuppress != null) {
      window.clearTimeout(clearSuppress)
      clearSuppress = null
    }
  }

  function onPointerDown(event: PointerEvent) {
    if (!scroller.value || event.button !== 0 || event.pointerType === 'touch') {
      return
    }
    pointerId = event.pointerId
    startX = event.clientX
    dragging = false
    clearClickSuppress()
  }

  function onPointerMove(event: PointerEvent) {
    if (pointerId == null || event.pointerId !== pointerId || !scroller.value) {
      return
    }

    if (!dragging) {
      if (Math.abs(event.clientX - startX) < DRAG_THRESHOLD) return
      dragging = true
      suppressClick = true
      scroller.value.setPointerCapture(event.pointerId)
    }

    scroller.value.scrollLeft -= event.movementX
  }

  function onPointerUp(event: PointerEvent) {
    if (pointerId == null || event.pointerId !== pointerId) return
    pointerId = null
    dragging = false

    if (!suppressClick) return
    clearSuppress = window.setTimeout(clearClickSuppress, 80)
  }

  function onClickCapture(event: MouseEvent) {
    if (!suppressClick) return
    event.preventDefault()
    event.stopPropagation()
    clearClickSuppress()
  }

  return {
    scroller,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onClickCapture,
  }
}

const {
  scroller: scheduleScroller,
  onPointerDown: onSchedulePointerDown,
  onPointerMove: onSchedulePointerMove,
  onPointerUp: onSchedulePointerUp,
  onClickCapture: onScheduleClickCapture,
} = useHorizontalDragScroll()

const {
  scroller: travelScroller,
  onPointerDown: onTravelPointerDown,
  onPointerMove: onTravelPointerMove,
  onPointerUp: onTravelPointerUp,
  onClickCapture: onTravelClickCapture,
} = useHorizontalDragScroll()

function toggleSuggestion(
  field: 'work_schedule' | 'travel_need',
  value: string,
) {
  props.form[field] = props.form[field] === value ? '' : value
}
</script>
