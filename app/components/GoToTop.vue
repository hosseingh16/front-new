<template>
  <Teleport to="body">
    <button
      type="button"
      class="go-to-top-btn"
      :class="{ 'is-visible': visible }"
      aria-label="بازگشت به بالا"
      :tabindex="visible ? 0 : -1"
      @click="scrollToTop"
    >
      <Icon name="heroicons:arrow-up-solid" size="22" class="shrink-0" />
    </button>
  </Teleport>
</template>

<script setup lang="ts">
const VISIBLE_AFTER = 120;

const visible = ref(false);

function getScrollTop() {
  if (!import.meta.client) return 0;
  return Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
  );
}

function updateVisibility() {
  visible.value = getScrollTop() > VISIBLE_AFTER;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  nextTick(updateVisibility);
  window.addEventListener("scroll", updateVisibility, { passive: true });
  document.addEventListener("scroll", updateVisibility, {
    passive: true,
    capture: true,
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateVisibility);
  document.removeEventListener("scroll", updateVisibility, true);
});
</script>

<style scoped>
.go-to-top-btn {
  position: fixed;
  z-index: 9999;
  left: 1.25rem;
  bottom: 2.25rem;
  display: flex;
  width: 3rem;
  height: 3rem;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 1rem;
  background: #4864e1;
  color: #fff;
  box-shadow: 0 10px 30px rgba(72, 100, 225, 0.28);
  opacity: 0;
  pointer-events: none;
  transform: translateY(0.75rem);
  transition: opacity 0.25s ease, transform 0.25s ease,
    background-color 0.2s ease, box-shadow 0.2s ease;
}

.go-to-top-btn.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.go-to-top-btn:hover {
  background: rgb(58, 84, 201);
  box-shadow: 0 14px 34px rgba(72, 100, 225, 0.34);
  transform: translateY(-2px);
}

@media (min-width: 640px) {
  .go-to-top-btn {
    left: 1.5rem;
    bottom: 2rem;
  }
}
</style>
