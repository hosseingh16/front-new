<template>
  <div class="overflow-hidden rounded-full bg-[#8EA0B5]">
    <img
      :src="avatarSrc"
      alt=""
      class="h-full w-full object-cover"
    />
  </div>
</template>

<script setup lang="ts">
import {
  DEFAULT_AVATAR_SRC,
  DEFAULT_COMPANY_LOGO_SRC,
} from "~/libs/utils";

const { avatar, isEmployer } = useCurrentUser();

const avatarSrc = computed(
  () =>
    avatar.value ||
    (isEmployer.value ? DEFAULT_COMPANY_LOGO_SRC : DEFAULT_AVATAR_SRC),
);
</script>
