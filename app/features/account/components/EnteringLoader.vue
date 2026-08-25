<template>
  <div
    class="entering-loader flex flex-col items-center"
    role="status"
    aria-live="polite"
    aria-label="در حال بارگذاری"
  >
    <div class="relative flex h-20 w-20 items-center justify-center">
      <span
        class="entering-loader__glow absolute inset-0 rounded-full bg-primary-100/60"
        aria-hidden="true"
      />
      <span
        class="entering-loader__pulse absolute inset-1 rounded-full border border-primary-200/80"
        aria-hidden="true"
      />

      <svg
        class="entering-loader__ring absolute inset-0 h-full w-full"
        viewBox="0 0 88 88"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="44"
          cy="44"
          r="38"
          stroke="currentColor"
          stroke-width="3"
          class="text-primary-100"
        />
        <circle
          cx="44"
          cy="44"
          r="38"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          class="text-primary-500 entering-loader__arc"
        />
      </svg>

      <NuxtImg
        src="/images/logo.png"
        alt=""
        class="entering-loader__logo relative h-11 w-11"
      />
    </div>

    <div class="mt-5 flex items-center gap-1.5" aria-hidden="true">
      <span
        v-for="index in 3"
        :key="index"
        class="entering-loader__dot size-2 rounded-full bg-primary-500"
        :style="{ animationDelay: `${(index - 1) * 0.16}s` }"
      />
    </div>
  </div>
</template>

<style scoped>
.entering-loader__glow {
  animation: entering-glow 2.4s ease-in-out infinite;
}

.entering-loader__pulse {
  animation: entering-pulse 2.4s ease-in-out infinite;
}

.entering-loader__ring {
  animation: entering-spin 1.4s linear infinite;
}

.entering-loader__arc {
  stroke-dasharray: 72 167;
  stroke-dashoffset: 0;
}

.entering-loader__logo {
  animation: entering-logo 2.4s ease-in-out infinite;
}

.entering-loader__dot {
  animation: entering-dot 1.1s ease-in-out infinite;
}

@keyframes entering-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes entering-glow {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.45;
  }

  50% {
    transform: scale(1);
    opacity: 0.85;
  }
}

@keyframes entering-pulse {
  0%,
  100% {
    transform: scale(0.96);
    opacity: 0.55;
  }

  50% {
    transform: scale(1.04);
    opacity: 1;
  }
}

@keyframes entering-logo {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.04);
  }
}

@keyframes entering-dot {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.35;
  }

  40% {
    transform: translateY(-5px);
    opacity: 1;
  }
}
</style>
