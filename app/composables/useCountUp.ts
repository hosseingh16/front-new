export function useCountUp(
  targets: MaybeRefOrGetter<number[]>,
  options?: { duration?: number; root?: Ref<HTMLElement | null> },
) {
  const { duration = 2000, root } = options ?? {}
  const values = ref(toValue(targets).map(() => 0))
  let hasStarted = false

  function animate() {
    if (hasStarted) return
    hasStarted = true

    const endValues = toValue(targets)
    const startTime = performance.now()

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      values.value = endValues.map((target) => Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
      else values.value = [...endValues]
    }

    requestAnimationFrame(tick)
  }

  onMounted(() => {
    const el = root?.value
    if (!el) {
      animate()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          animate()
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    onUnmounted(() => observer.disconnect())
  })

  return values
}

export function toPersianDigits(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]!)
}
