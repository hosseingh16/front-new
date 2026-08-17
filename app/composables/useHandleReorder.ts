import type { Ref } from "vue";

export function useHandleReorder<T>(
  items: Ref<T[]>,
  onReorder?: (items: T[]) => boolean | void | Promise<boolean | void>,
) {
  const draggingIndex = ref<number | null>(null);

  function itemClass(index: number) {
    return draggingIndex.value === index ? "opacity-50" : undefined;
  }

  function onHandlePointerDown(index: number, event: PointerEvent) {
    if (event.button !== 0 || items.value.length < 2) return;

    event.preventDefault();
    event.stopPropagation();

    const snapshot = items.value.slice();
    draggingIndex.value = index;
    let from = index;
    let changed = false;

    const onMove = (ev: PointerEvent) => {
      const target = document
        .elementFromPoint(ev.clientX, ev.clientY)
        ?.closest<HTMLElement>("[data-cv-sort-index]");
      if (!target) return;

      const to = Number(target.dataset.cvSortIndex);
      if (!Number.isFinite(to) || to === from) return;

      const rect = target.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      if (from < to && ev.clientY < midY) return;
      if (from > to && ev.clientY > midY) return;

      const next = items.value.slice();
      const [moved] = next.splice(from, 1);
      if (moved === undefined) return;

      next.splice(to, 0, moved);
      items.value = next;
      from = to;
      draggingIndex.value = to;
      changed = true;
    };

    const onUp = async () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      draggingIndex.value = null;

      if (!changed) return;

      const result = await onReorder?.(items.value);
      if (result === false) {
        items.value = snapshot;
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  return {
    draggingIndex,
    itemClass,
    onHandlePointerDown,
  };
}
