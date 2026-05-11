<template>
  <div class="dropdown dropdown-start">
    <div :tabindex="Math.round(1)">
      <slot name="btn" />
    </div>
    <div
      class="dropdown-content p-0 left-0 mt-2 menu bg-base-100 rounded-xl z-1 min-w-62 w-fit border-3 border-surface-100 font-semibold"
    >
      <img src="/images/rectangle.png" class="absolute -top-2 left-5" />
      <slot name="content" />
    </div>
  </div>
</template>
