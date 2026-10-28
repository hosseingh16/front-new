<template>
  <div :class="embedded ? 'pb-10' : 'bg-surface-50 pb-12'">
    <section
      class="relative"
      :class="embedded ? 'overflow-hidden rounded-2xl' : ''"
    >
      <img
        :src="coverImage"
        alt=""
        fetchpriority="high"
        loading="eager"
        class="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="relative"
        :class="embedded ? 'px-4 pt-4 pb-10' : 'custom-pad pt-6 pb-12'"
      >
        <nav class="text-sm text-text-passive">
          <NuxtLink
            :to="embedded ? '/dashboard' : '/'"
            class="transition-colors hover:text-primary-500"
          >
            <Icon name="svg:home" size="16" />
          </NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink
            :to="projectsListPath"
            class="transition-colors hover:text-primary-500"
          >
            پروژه‌ها
          </NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-text-tertiary">{{ projectTitle }}</span>
        </nav>
      </div>

      <div
        class="relative"
        :class="embedded ? 'sm:px-4 pb-0' : 'custom-pad pb-0 sm:px-5 sm:pt-5'"
      >
        <div
          v-if="loading && !project"
          class="animate-pulse rounded-t-2xl bg-surface-50 p-6"
          :class="embedded ? '' : 'mt-4'"
        >
          <div class="h-20 rounded-xl bg-surface-200" />
          <div class="mt-6 h-10 rounded bg-surface-200" />
        </div>

        <div
          v-else-if="project"
          class="relative z-10 rounded-t-2xl bg-surface-50"
          :class="embedded ? '' : 'mt-4'"
        >
          <div
            class="flex flex-wrap items-start justify-between gap-4 p-5 md:p-6"
          >
            <div class="flex min-w-0 items-center gap-4">
              <NuxtLink
                v-if="project.company?.slug"
                :to="`/companies/${project.company.slug}`"
                class="flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#ECF4D9]"
                tabindex="-1"
                :aria-label="project.company_name"
              >
                <img
                  :ref="bindLogoImg"
                  :src="companyLogoSrc"
                  alt=""
                  class="h-[66px] w-[66px] object-cover"
                  @error="onLogoError"
                />
              </NuxtLink>
              <div
                v-else
                class="flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#ECF4D9]"
              >
                <img
                  :ref="bindLogoImg"
                  :src="companyLogoSrc"
                  alt=""
                  class="h-[66px] w-[66px] object-cover"
                  @error="onLogoError"
                />
              </div>
              <div class="min-w-0">
                <p class="text-sm text-text-passive">
                  {{ project.company_name }}
                </p>
                <h1
                  class="mt-1 font-yb-bold text-xl text-text-primay md:text-2xl"
                >
                  {{ projectTitle }}
                </h1>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <p v-if="publishDateLabel" class="text-sm text-text-passive">
                تاریخ انتشار:
                <span class="text-text-passive">{{ publishDateLabel }}</span>
              </p>

              <button
                type="button"
                class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-default bg-white transition-opacity hover:opacity-80"
                aria-label="اشتراک‌گذاری"
                @click="shareProject"
              >
                <Icon name="lucide:share-2" size="18" />
              </button>
              <BookmarkToggleButton
                v-if="project?.id"
                :target-id="project.id"
                type="projects"
                label="نشان کردن"
                :icon-only="isMobile"
                :initial-bookmarked="Boolean(project.is_bookmarked)"
                @update:bookmarked="
                  (value) => {
                    if (project) project.is_bookmarked = value;
                  }
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div :class="embedded ? '' : 'custom-pad'">
      <p v-if="error" class="mt-8 py-12 text-center text-sm text-error">
        {{ error }}
      </p>

      <template v-else-if="project">
        <ProjectDetailContent
          :project="project"
          @apply="showApplyModal"
          @report-issue="showReportModal"
        />

        <section v-if="loadingSimilar || similarProjects.length" class="mt-10">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-1">
              <span
                class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                aria-hidden="true"
              />
              <h2 class="font-yb-bold text-base text-text-primay">
                پروژه‌های مشابه
              </h2>
            </div>
            <NuxtLink
              :to="projectsListPath"
              class="text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
            >
              مشاهده بیشتر
            </NuxtLink>
          </div>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <template v-if="loadingSimilar">
              <ItemBox
                v-for="n in 6"
                :key="`similar-skeleton-${n}`"
                variant="project"
                loading
              />
            </template>
            <template v-else>
              <ItemBox
                v-for="opportunity in similarProjects"
                :key="opportunity.item.id"
                variant="project"
                :item="opportunity.item"
              />
            </template>
          </div>
        </section>
      </template>
    </div>

    <FastLoginModal
      ref="fastLoginRef"
      :project-id="project?.id ?? projectId"
      @applied="showSuccessModal"
      @apply-failed="onApplyFailedAfterLogin"
      @resume-incomplete="onResumeIncompleteAfterLogin"
    />

    <AdResumeIncompleteModal ref="incompleteModalRef" />

    <dialog
      ref="successDialogRef"
      id="project-apply-success-modal"
      class="modal"
      @close="markApplied"
      @click="handleSuccessBackdropClick"
    >
      <div
        class="modal-box relative w-full max-w-105 rounded-2xl p-6 pt-10 text-center"
        @click.stop
      >
        <button
          type="button"
          class="absolute left-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center text-text-passive transition-opacity hover:opacity-70"
          aria-label="بستن"
          @click="closeSuccessModal"
        >
          <icons-close color="#667085" class="h-7 w-7" />
        </button>

        <img :src="createAccountIllust" alt="" class="mx-auto h-45 w-auto" />

        <h2 class="mt-2 font-yb-bold text-xl text-text-primay md:text-2xl">
          درخواست شما با موفقیت ارسال شد
        </h2>
        <p class="mt-3 text-sm leading-7 text-text-passive">
          درخواست شما برای این پروژه ثبت شد. می‌توانید وضعیت بررسی را در داشبورد
          دنبال کنید.
        </p>

        <button
          type="button"
          class="btn btn-primary mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-xl"
          @click="goToMyRequests"
        >
          <Icon name="svg:breifcase-recieve" size="18" />
          <span>درخواست‌های من</span>
        </button>
      </div>
    </dialog>

    <ReportIssueModal
      ref="reportIssueModalRef"
      :target-id="project?.id ?? projectId"
      type="projects"
    />
  </div>
</template>

<script setup lang="ts">
import ItemBox from "~/components/Elements/item-box.vue";
import BookmarkToggleButton from "~/components/Elements/BookmarkToggleButton.vue";
import FastLoginModal from "~/components/FastLoginModal.vue";
import ProjectDetailContent from "./components/ProjectDetailContent.vue";
import ReportIssueModal from "~/pages/jobs/components/ReportIssueModal.vue";
import AdResumeIncompleteModal from "~/pages/jobs/components/AdResumeIncompleteModal.vue";
import { useProject, useSimilarProjects } from "~/composables/useProject";
import { formatJalaliDate } from "~/utils/format-jalali-date";
import { getProjectDetailSeoMeta } from "~/utils/project-seo";
import { getProjectTitle } from "~/utils/project-display";
import createAccountIllust from "~/assets/vectors/illustrations/create-account.svg";
import {
  isResumeBasicInfoComplete,
  isResumeBasicInfoRequiredError,
} from "~/utils/api-error";

const route = useRoute();
const projectId = computed(() => String(route.params.id ?? ""));

if (!/^\d+$/.test(projectId.value)) {
  throw createError({ statusCode: 404, statusMessage: "پروژه یافت نشد" });
}

const { isAuthenticated } = useSanctumAuth();
const { isEmployer, user, ensureFullProfile } = useCurrentUser();
const { needsRoleSelection, ensureRoleForAction } = useRoleGate();
const { applyToProject, loading: applyLoading } = useApplyToProject();
const {
  project,
  loading,
  error,
  setHasApplied,
  refresh: refreshProject,
} = useProject(projectId);
const { similarProjects, loadingSimilar } = useSimilarProjects(projectId);

const reportIssueModalRef = ref<InstanceType<typeof ReportIssueModal> | null>(
  null,
);
const fastLoginRef = ref<InstanceType<typeof FastLoginModal> | null>(null);
const incompleteModalRef = ref<InstanceType<
  typeof AdResumeIncompleteModal
> | null>(null);
const successDialogRef = ref<HTMLDialogElement | null>(null);
const applying = ref(false);
const isMobile = ref(false);

const embedded = computed(
  () => isAuthenticated.value && !needsRoleSelection.value,
);
const projectsListPath = computed(() =>
  embedded.value ? "/dashboard" : "/jobs?job_type=project_based",
);

function syncLayout(useDashboard: boolean) {
  setPageLayout(useDashboard ? "dashboard" : "default");
}

syncLayout(embedded.value);
watch(embedded, (useDashboard) => syncLayout(useDashboard));

onMounted(() => {
  const mediaQuery = window.matchMedia("(max-width: 767px)");
  const syncIsMobile = () => {
    isMobile.value = mediaQuery.matches;
  };

  syncIsMobile();
  mediaQuery.addEventListener("change", syncIsMobile);
  onUnmounted(() => mediaQuery.removeEventListener("change", syncIsMobile));
});

const {
  logoSrc: companyLogoSrc,
  onLogoError,
  bindLogoImg,
} = useCompanyLogoDisplaySrc(
  () => project.value?.company?.logo || project.value?.company_logo,
);

const coverImage = computed(
  () => project.value?.company?.cover || "/images/ad-cover-bg.webp",
);

useHead(() => ({
  link: [
    {
      rel: "preload",
      as: "image",
      href: coverImage.value,
      fetchpriority: "high",
    },
  ],
}));

const projectTitle = computed(() => getProjectTitle(project.value));

const publishDateLabel = computed(() => {
  const date = project.value?.publish_date || project.value?.created_at;
  return date ? formatJalaliDate(date) : "";
});

function markApplied() {
  setHasApplied(true);
}

function showSuccessModal() {
  if (!import.meta.client) return;
  successDialogRef.value?.showModal();
}

function closeSuccessModal() {
  successDialogRef.value?.close();
}

function handleSuccessBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeSuccessModal();
  }
}

function goToMyRequests() {
  closeSuccessModal();
  navigateTo("/dashboard/my-requests");
}

function showIncompleteResumeModal() {
  if (!import.meta.client) return;
  incompleteModalRef.value?.showModal();
}

async function onApplyFailedAfterLogin() {
  await refreshProject();
}

async function onResumeIncompleteAfterLogin() {
  await refreshProject();
  showIncompleteResumeModal();
}

async function sendRequest() {
  const id = project.value?.id ?? projectId.value;
  if (!id || project.value?.has_applied || isEmployer.value) return;

  applying.value = true;
  try {
    const assigned = await ensureRoleForAction("job_seeker");
    if (!assigned) return;

    await ensureFullProfile();
    if (!isResumeBasicInfoComplete(user.value)) {
      showIncompleteResumeModal();
      return;
    }

    await applyToProject(id);
    showSuccessModal();
  } catch (err) {
    if (isResumeBasicInfoRequiredError(err)) {
      showIncompleteResumeModal();
    }
  } finally {
    applying.value = false;
  }
}

async function showApplyModal() {
  if (!import.meta.client || applyLoading.value || applying.value) return;
  if (project.value?.has_applied || isEmployer.value) return;

  if (isAuthenticated.value) {
    await sendRequest();
    return;
  }

  fastLoginRef.value?.showModal();
}

function showReportModal() {
  reportIssueModalRef.value?.showModal();
}

async function shareProject() {
  if (!import.meta.client) return;

  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: projectTitle.value, url });
      return;
    } catch {
      // fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(url);
}

const projectSeo = computed(() => getProjectDetailSeoMeta(project.value));

useSeoMeta({
  title: () => projectSeo.value.title,
  description: () => projectSeo.value.description,
});
</script>
