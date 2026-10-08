<template>
  <div class="bg-surface-50">
    <section
      class="bg-[url('/images/bg-6.png')] md:bg-[url('/images/bg-5.png')] bg-no-repeat bg-top md:bg-position-[center_-150px] pb-10"
    >
      <div class="custom-pad pt-6">
        <nav class="text-sm text-text-passive">
          <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
            صفحه اصلی
          </NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/jobs" class="hover:text-primary-500 transition-colors">
            فرصت های شغلی
          </NuxtLink>
          <template v-if="breadcrumbLabel">
            <span class="mx-2">/</span>
            <span class="text-text-tertiary">{{ breadcrumbLabel }}</span>
          </template>
        </nav>
      </div>
      <div class="custom-pad flex flex-col items-center gap-4 pt-8 md:pt-12">
        <div
          class="text-primary-500 font-semibold text-sm flex justify-center items-center p-2 bg-[#4864E114] rounded-xl"
        >
          فرصت های شغلی حسابداری
        </div>
        <h1 class="font-yb-bold text-[23px] lg:text-h1 text-center">
          {{ heading }}
        </h1>
        <h2 class="text-center">
          {{ subheading }}
        </h2>
      </div>
    </section>

    <div class="custom-pad grid md:grid-cols-7 gap-4 items-start">
      <JobFiltersSidebar
        v-model="jobFilters"
        class="col-span-full md:col-span-2"
      />

      <div
        id="jobs-results"
        class="col-span-full md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <template v-if="loading">
          <ItemBox
            v-for="n in 12"
            :key="`skeleton-${n}`"
            variant="ad"
            loading
          />
        </template>

        <p
          v-else-if="error"
          class="col-span-full py-12 text-center text-sm text-error"
        >
          {{ error }}
        </p>

        <NoResult
          v-else-if="initialized && !opportunities.length"
          wrapper-class="col-span-full"
        />

        <template v-else>
          <ItemBox
            v-for="opportunity in opportunities"
            :key="`${opportunity.type}-${opportunity.item.id}`"
            :variant="opportunity.type === 'project' ? 'project' : 'ad'"
            :item="opportunity.item"
          />

          <div class="col-span-full mt-4 flex justify-center">
            <Pagination
              :current-page="page"
              :last-page="lastPage"
              @update:current-page="onPageChange"
            />
          </div>
        </template>
      </div>
    </div>

    <FaqSection
      class="custom-pad mt-12"
      :categories="faqCategories"
      :items="faqs"
    />
  </div>
</template>

<script setup lang="ts">
import ItemBox from "~/components/Elements/item-box.vue";
import JobFiltersSidebar from "~/components/Elements/JobFiltersSidebar.vue";
import NoResult from "~/components/Elements/NoResult.vue";
import Pagination from "~/components/Elements/Pagination.vue";
import FaqSection from "~/components/Elements/FaqSection.vue";
import { FAQ_TYPE, faqCategoriesByType, faqsByType } from "~/data/faqs";
import {
  areRouteQueriesEqual,
  jobFiltersToRouteQuery,
  routeQueryToJobFilters,
} from "~/utils/job-filters-query";
import { getCityAdsListSeoMeta } from "~/utils/ad-seo";
import {
  findJobCategoryLabel,
  getJobCategorySeoMeta,
  jobCategoryPath,
  normalizeJobCategorySlug,
} from "~/utils/job-category";
import {
  findJobCityLabel,
  jobCityPath,
  normalizeJobCitySlug,
  resolveJobCityProvinceIds,
} from "~/utils/job-city";
import {
  useJobFilterProvinceOptions,
  useResolveProvinceFiltersFromRoute,
} from "~/composables/useJobFilterProvinceOptions";
import { paths } from "~/routes";
import {
  JOB_FILTERS_LOOKUP_KEYS,
  type JobFiltersModel,
} from "~/types/job-filters";
import { provinceIdsToQueryValue } from "~/utils/province-filter-query";

const props = defineProps<{
  categorySlug?: string;
  citySlug?: string;
}>();

const route = useRoute();
const router = useRouter();
const { ensure: ensureFilterLookups } = useLookups(JOB_FILTERS_LOOKUP_KEYS);
const provinceOptions = useJobFilterProvinceOptions();
const { items: lookupItems } = useLookups("job_titles");
const jobTitles = lookupItems("job_titles");

const routeCategorySlug = computed(() =>
  normalizeJobCategorySlug(
    props.categorySlug ??
      (typeof route.params.slug === "string" &&
      route.path.startsWith("/jobs/category/")
        ? route.params.slug
        : ""),
  ),
);

const routeCitySlug = computed(() =>
  normalizeJobCitySlug(
    props.citySlug ??
      (typeof route.params.slug === "string" &&
      route.path.startsWith("/jobs/city/")
        ? route.params.slug
        : ""),
  ),
);

function filtersFromRoute(
  query: typeof route.query,
  categorySlug: string,
  citySlug: string,
): { filters: JobFiltersModel; page: number } {
  const next = routeQueryToJobFilters(query, provinceOptions.value);

  if (categorySlug) {
    next.filters.jobGroups = [categorySlug];
  }

  if (citySlug) {
    const provinceIds = resolveJobCityProvinceIds(
      citySlug,
      provinceOptions.value,
    );
    if (provinceIds.length) {
      next.filters.provinces = provinceIds;
    }
  }

  return next;
}

// Province slugs in the path need lookup labels before the first /opportunities fetch.
if (routeCitySlug.value) {
  await ensureFilterLookups();
}

const initialState = filtersFromRoute(
  route.query,
  routeCategorySlug.value,
  routeCitySlug.value,
);
const jobFilters = ref(initialState.filters);
const page = ref(initialState.page);

useResolveProvinceFiltersFromRoute(
  jobFilters,
  provinceOptions,
  (query, provinces) => routeQueryToJobFilters(query, provinces).filters,
);

watch(
  provinceOptions,
  (options) => {
    if (!routeCitySlug.value || !options.length) return;

    const provinceIds = resolveJobCityProvinceIds(routeCitySlug.value, options);
    if (
      !provinceIds.length ||
      JSON.stringify(provinceIds) === JSON.stringify(jobFilters.value.provinces)
    ) {
      return;
    }

    jobFilters.value = {
      ...jobFilters.value,
      provinces: provinceIds,
    };
  },
  { immediate: true },
);

const { opportunities, lastPage, loading, initialized, error } = useJobAds(
  jobFilters,
  page,
);

const categoryLabel = computed(() =>
  findJobCategoryLabel(routeCategorySlug.value, jobTitles.value),
);

const cityLabel = computed(() =>
  findJobCityLabel(routeCitySlug.value, provinceOptions.value),
);

const breadcrumbLabel = computed(
  () => categoryLabel.value || cityLabel.value || "",
);

const heading = computed(() => {
  if (categoryLabel.value) return `استخدام ${categoryLabel.value}`;
  if (cityLabel.value) return `استخدام حسابدار در ${cityLabel.value}`;
  return "جدیدترین فرصت های شغلی حسابداری";
});

const subheading = computed(() => {
  if (categoryLabel.value) {
    return `آگهی‌های استخدام ${categoryLabel.value} را مشاهده کنید و رزومه خود را برای شرکت‌ها ارسال کنید`;
  }
  if (cityLabel.value) {
    return `جدیدترین فرصت‌های شغلی حسابداری در ${cityLabel.value} را مشاهده کنید و رزومه خود را ارسال کنید`;
  }
  return "پروژه های مالی و آگهی های استخدام حسابدار را مشاهده کنید و رزومه خود را برای شرکت ها ارسال کنید";
});

let urlSyncTimer: ReturnType<typeof setTimeout> | null = null;
let syncingFromRoute = false;

function buildJobsLocation(filters: JobFiltersModel, currentPage: number) {
  const query = jobFiltersToRouteQuery(
    filters,
    currentPage,
    provinceOptions.value,
  );
  const groups = filters.jobGroups
    .map((group) => normalizeJobCategorySlug(group))
    .filter(Boolean);
  const provinceSlugs = (
    provinceIdsToQueryValue(filters.provinces, provinceOptions.value) ?? ""
  )
    .split(",")
    .map((slug) => normalizeJobCitySlug(slug))
    .filter(Boolean);

  if (groups.length === 1) {
    const { position: _position, job_group: _jobGroup, ...rest } = query;
    return {
      path: jobCategoryPath(groups[0]!),
      query: rest,
    };
  }

  if (provinceSlugs.length === 1) {
    const { province: _province, ...rest } = query;
    return {
      path: jobCityPath(provinceSlugs[0]!),
      query: rest,
    };
  }

  return {
    path: paths.jobs.root,
    query,
  };
}

function syncRoute() {
  if (syncingFromRoute) return;

  const next = buildJobsLocation(jobFilters.value, page.value);
  const samePath = route.path === next.path;
  const sameQuery = areRouteQueriesEqual(route.query, next.query);
  if (samePath && sameQuery) return;

  syncingFromRoute = true;
  router.replace(next);
}

function onPageChange(nextPage: number) {
  page.value = nextPage;
}

watch(page, () => {
  syncRoute();
  nextTick(() => {
    const el = document.getElementById("jobs-results");
    if (!el) return;
    const yOffset = -100;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

watch(
  jobFilters,
  (value, oldValue) => {
    if (
      !syncingFromRoute &&
      JSON.stringify(value) !== JSON.stringify(oldValue) &&
      page.value !== 1
    ) {
      page.value = 1;
    }

    if (urlSyncTimer) clearTimeout(urlSyncTimer);
    urlSyncTimer = setTimeout(syncRoute, 300);
  },
  { deep: true },
);

watch(
  () =>
    [
      route.path,
      route.query,
      route.params.slug,
      routeCategorySlug.value,
      routeCitySlug.value,
    ] as const,
  () => {
    if (syncingFromRoute) {
      syncingFromRoute = false;
      return;
    }

    const next = filtersFromRoute(
      route.query,
      routeCategorySlug.value,
      routeCitySlug.value,
    );
    const filtersJson = JSON.stringify(next.filters);
    const currentJson = JSON.stringify(jobFilters.value);

    if (filtersJson === currentJson && next.page === page.value) return;

    syncingFromRoute = true;
    jobFilters.value = next.filters;
    page.value = next.page;
    nextTick(() => {
      syncingFromRoute = false;
    });
  },
);

onMounted(() => {
  // Avoid stripping /jobs/city/:slug before province filters are applied.
  if (routeCitySlug.value && !jobFilters.value.provinces.length) return;

  // Canonicalize query filters into path routes when possible:
  // `/jobs?position=accountant` → `/jobs/category/accountant`
  // `/jobs?province=تهران` → `/jobs/city/تهران`
  syncRoute();
});

onUnmounted(() => {
  if (urlSyncTimer) clearTimeout(urlSyncTimer);
});

const faqCategories = faqCategoriesByType(FAQ_TYPE.resume, FAQ_TYPE.hiring);
const faqs = faqsByType(FAQ_TYPE.resume, FAQ_TYPE.hiring);

const selectedLocationName = useAdsListLocationLabel(jobFilters);

const jobsListSeo = computed(() => {
  if (categoryLabel.value) {
    return getJobCategorySeoMeta(categoryLabel.value);
  }

  return getCityAdsListSeoMeta(cityLabel.value || selectedLocationName.value, {
    title: "فرصت های شغلی حسابداری | آگهی استخدام حسابدار در شرکت‌های معتبر",
    description:
      "جدیدترین فرصت های شغلی حسابداری و آگهی‌های استخدام حسابدار تمام‌وقت، پاره‌وقت و پروژه‌ای را در های‌حساب ببینید و سریع‌تر موقعیت شغلی مناسب خود را پیدا کنید.",
  });
});

useSeoMeta({
  title: () => jobsListSeo.value.title,
  description: () => jobsListSeo.value.description,
});
</script>
