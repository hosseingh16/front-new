<template>
  <div>
    <template v-if="loading">
      <div class="h-8 w-40 animate-pulse rounded bg-surface-200" />
      <div class="mt-6 space-y-4">
        <div
          v-for="n in 3"
          :key="`skeleton-${n}`"
          class="h-48 animate-pulse rounded-2xl bg-surface-200"
        />
      </div>
    </template>

    <p v-else-if="error" class="py-12 text-center text-sm text-error">
      {{ error }}
    </p>

    <NoResult
      v-else-if="initialized && !projects.length"
      title="ایجاد پروژه جدید"
      description="در حال حاضر هیچ پروژه‌ای جهت نمایش نیست. جهت ثبت اولین پروژه خود کلیک کنید."
      icon="svg:projects"
      action-label="پروژه جدید"
      action-icon="svg:projects"
      action-to="/dashboard/employer/projects/create"
    />

    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <h1 class="font-yb-bold text-lg text-text-tertiary">پروژه‌های من</h1>
          <span
            class="rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-text-passive"
          >
            {{ projects.length }} پروژه
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn btn-ghost h-10 w-10 p-0"
            aria-label="جستجو"
            @click="showSearch = !showSearch"
          >
            <Icon name="svg:search-1" size="20" />
          </button>
          <NuxtLink
            to="/dashboard/employer/projects/create"
            class="btn btn-success h-10 gap-2 px-4"
          >
            <Icon name="svg:projects" size="16" class="text-white" />
            پروژه جدید
          </NuxtLink>
        </div>
      </div>

      <div v-if="showSearch" class="mt-4">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="جستجو در پروژه‌ها..."
          class="h-10 w-full rounded-lg border border-gray-default bg-white px-3 text-sm outline-none focus:border-primary-500"
        />
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-6 border-b border-gray-default">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          class="flex cursor-pointer items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition-colors"
          :class="
            activeFilter === tab.id
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-text-passive hover:text-text-secondary'
          "
          @click="activeFilter = tab.id"
        >
          <Icon v-if="tab.icon" :name="tab.icon" size="16" />
          {{ tab.label }}
          <span
            v-if="tab.count != null && tab.count > 0"
            class="rounded-full bg-surface-100 px-2 py-0.5 text-xs"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <div v-if="filteredProjects.length" class="mt-6 space-y-4">
        <EmployerProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @delete="confirmDeleteProject"
        />
      </div>

      <NoResult
        v-else
        title="پروژه‌ای یافت نشد"
        description="با فیلتر یا عبارت جستجوی دیگری دوباره امتحان کنید."
        icon="svg:no-result"
        :icon-size="180"
      />
    </template>

    <ConfirmDialog
      ref="confirmDialogRef"
      title="حذف پروژه"
      subtitle="آیا از حذف این پروژه مطمئن هستید؟"
      description="پس از حذف، اطلاعات این پروژه از پروفایل شما پاک می‌شود و قابل بازیابی نخواهد بود."
      confirm-text="حذف پروژه"
      cancel-text="نادیده گرفتن"
      icon="svg:delete"
      @confirm="handleDeleteProjectConfirm"
      @cancel="handleDeleteProjectCancel"
    />
  </div>
</template>

<script setup lang="ts">
import NoResult from "~/components/Elements/NoResult.vue";
import ConfirmDialog from "~/components/M/ConfirmDialog.vue";
import EmployerProjectCard from "~/components/Elements/EmployerProjectCard.vue";
import type { EmployerProjectFilter } from "~/types/employer-project";
import {
  countEmployerProjectsByFilter,
  getEmployerProjectTitle,
  getEmployerProjectsByFilter,
} from "../utils/employer-project";

definePageMeta({
  layout: "dashboard",
});

const {
  projectGroups,
  projects,
  loading,
  initialized,
  error,
  deleteProject,
} = useEmployerProjects();
const { $toast } = useNuxtApp();

const activeFilter = ref<EmployerProjectFilter>("all");
const searchQuery = ref("");
const showSearch = ref(false);
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const deletingProjectId = ref<number | null>(null);

const filterTabs = computed(() => [
  { id: "all" as const, label: "همه", icon: "", count: null },
  {
    id: "active" as const,
    label: "پروژه‌های فعال",
    icon: "lucide:briefcase",
    count: countEmployerProjectsByFilter(projectGroups.value, "active"),
  },
  {
    id: "draft" as const,
    label: "پیش‌نویس",
    icon: "lucide:pen-line",
    count: countEmployerProjectsByFilter(projectGroups.value, "draft"),
  },
  {
    id: "expired" as const,
    label: "منقضی شده‌ها",
    icon: "material-symbols:cancel-outline",
    count: countEmployerProjectsByFilter(projectGroups.value, "expired"),
  },
]);

const filteredProjects = computed(() => {
  const byFilter = getEmployerProjectsByFilter(
    projectGroups.value,
    activeFilter.value,
  );
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) return byFilter;

  return byFilter.filter((project) =>
    getEmployerProjectTitle(project).toLowerCase().includes(query),
  );
});

function confirmDeleteProject(id: number) {
  if (!import.meta.client) return;
  deletingProjectId.value = id;
  confirmDialogRef.value?.showModal();
}

async function handleDeleteProjectConfirm() {
  if (deletingProjectId.value == null) return;
  try {
    await deleteProject(deletingProjectId.value);
    $toast.success("پروژه با موفقیت حذف شد");
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message?: string }).message)
        : "حذف پروژه با خطا مواجه شد";
    $toast.error(message);
  } finally {
    deletingProjectId.value = null;
    confirmDialogRef.value?.closeModal();
  }
}

function handleDeleteProjectCancel() {
  deletingProjectId.value = null;
}

useSeoMeta({
  title: "پروژه‌های من",
});
</script>
