<template>
  <div class="overflow-hidden rounded-full bg-[#8EA0B5]">
    <img
      :src="avatar || DEFAULT_AVATAR_SRC"
      alt=""
      class="h-full w-full object-cover"
    />
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_AVATAR_SRC } from "~/libs/utils";

const { avatar } = useCurrentUser();
</script>
