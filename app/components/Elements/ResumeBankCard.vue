<template>
  <article class="rounded-lg border border-base-300 bg-surface-card p-1">
    <div class="rounded-lg bg-surface-soft p-3">
      <div class="flex items-start justify-between">
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <div
            class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#8EA0B5]"
          >
            <img
              :src="avatarSrc"
              :alt="name"
              class="h-full w-full object-cover"
            />
          </div>

          <div class="w-full text-sm">
            <div class="flex items-center justify-between">
              <p class="truncate font-semibold text-text-tertiary">
                {{ name }}
              </p>

              <div class="flex shrink-0 items-center gap-2">
                <div
                  class="[&_button]:h-auto pl-3 [&_button]:w-auto [&_button]:border-none [&_button]:bg-transparent [&_button]:p-0"
                >
                  <BookmarkToggleButton
                    :target-id="user.id"
                    type="users"
                    :initial-bookmarked="Boolean(user.is_bookmarked)"
                    icon-only
                    @update:bookmarked="onBookmarkChange"
                  />
                </div>

                <button
                  type="button"
                  class="flex items-center gap-1.5 text-sm text-text-passive transition-opacity hover:opacity-80"
                  @click="emit('view')"
                >
                  <Icon name="lucide:eye" class="shrink-0" />
                  <span class="text-text-secondary">مشاهده رزومه</span>
                </button>
              </div>
            </div>
            <div
              class="mt-2 flex flex-wrap items-center gap-1 text-text-passive"
            >
              <Icon name="ph:suitcase-simple-light" class="shrink-0" />
              <span class="truncate">عنوان شغلی: {{ jobTitle }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 flex gap-1 overflow-x-auto text-sm no-scrollbar">
        <template v-for="item in displayItems" :key="item.key">
          <button
            v-if="item.copyable"
            type="button"
            class="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1 transition-opacity hover:opacity-80"
            title="کپی شماره تماس"
            @click="copyPhone(item.label)"
          >
            <Icon
              :name="item.icon"
              class="ma-auto shrink-0 text-text-passive"
            />
            <span class="text-text-tertiary">{{ item.label }}</span>
            <Icon
              name="svg:copy"
              size="14"
              class="shrink-0 text-text-passive"
            />
          </button>
          <div
            v-else
            class="flex shrink-0 items-center gap-2 rounded-full border border-gray-default bg-surface-50 px-3 py-1"
          >
            <Icon
              :name="item.icon"
              class="ma-auto shrink-0 text-text-passive"
            />
            <span class="text-text-tertiary">{{ item.label }}</span>
          </div>
        </template>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import BookmarkToggleButton from "~/components/Elements/BookmarkToggleButton.vue";
import type { ResumeBankUser } from "~/types/resume-bank";
import { resolveAvatarSrc } from "~/libs/utils";
import {
  getAdRequestDisplayItems,
  getAdRequestJobTitle,
} from "~/pages/dashboard/employer/utils/employer-ad-request";
import { resumeBankUserAsRequest } from "~/pages/dashboard/employer/utils/resume-bank";

const props = defineProps<{
  user: ResumeBankUser;
}>();

const { items: lookupItems } = useLookups("job_titles");
const jobTitleOptions = lookupItems("job_titles");

const emit = defineEmits<{
  view: [];
  bookmarkChange: [value: boolean];
}>();

const { $toast } = useNuxtApp();
const config = useRuntimeConfig();

const request = computed(() => resumeBankUserAsRequest(props.user));
const name = computed(() => props.user.name || "—");
const avatarSrc = computed(() =>
  resolveAvatarSrc(props.user.avatar, config.public.baseUrl as string),
);
const jobTitle = computed(() =>
  getAdRequestJobTitle(request.value, jobTitleOptions.value),
);
const displayItems = computed(() => getAdRequestDisplayItems(request.value));

async function copyPhone(value: string) {
  if (!import.meta.client || !value) return;

  try {
    await navigator.clipboard.writeText(value);
    $toast.success("شماره تماس کپی شد");
  } catch {
    $toast.error("کپی شماره تماس انجام نشد");
  }
}

function onBookmarkChange(value: boolean) {
  props.user.is_bookmarked = value;
  emit("bookmarkChange", value);
}
</script>
