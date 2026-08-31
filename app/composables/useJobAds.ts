import type { Ref } from "vue";
import type { ApiResponse } from "~/types/api";
import type { JobFiltersModel } from "~/types/job-filters";
import type { Opportunity } from "~/types/opportunity";
import type { AdsSort } from "~/utils/ads-filters-query";
import { buildAdsQueryFromFilters } from "~/utils/build-ads-query";

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: string }).message);
  }
  return "خطا در دریافت فرصت‌های شغلی";
}

function cloneFilters(filters: JobFiltersModel): JobFiltersModel {
  return {
    jobTypes: [...filters.jobTypes],
    titleSearch: filters.titleSearch,
    jobGroups: [...filters.jobGroups],
    provinces: [...filters.provinces],
    salaries: [...filters.salaries],
    workHistory: [...filters.workHistory],
    contractTypes: [...filters.contractTypes],
    benefits: [...filters.benefits],
  };
}

type JobOpportunitiesResult = {
  opportunities: Opportunity[];
  currentPage: number;
  lastPage: number;
  total: number;
};

function buildOpportunitiesQuery(
  filters: JobFiltersModel,
  page: number,
  sort: AdsSort = "newest",
): Record<string, string | number> {
  const query = buildAdsQueryFromFilters(filters);
  const jobTypes = filters.jobTypes.map(String);
  const hasProject = jobTypes.includes("project");
  const employmentTypes = [
    ...new Set([
      ...jobTypes.filter((type) => type !== "project"),
      ...filters.contractTypes.map(String),
    ]),
  ];

  if (employmentTypes.length) {
    query.employment_type = employmentTypes.join(",");
  } else {
    delete query.employment_type;
  }

  if (hasProject && !employmentTypes.length) {
    query.type = "project";
  }

  return {
    ...query,
    page,
    sort,
  };
}

export function useJobAds(
  filters: Ref<JobFiltersModel>,
  page: Ref<number>,
  sort?: Ref<AdsSort>,
) {
  const api = useApi();
  const debouncedFilters = ref<JobFiltersModel>(cloneFilters(filters.value));

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const opportunitiesQuery = computed(() =>
    buildOpportunitiesQuery(
      debouncedFilters.value,
      page.value,
      sort?.value ?? "newest",
    ),
  );

  const {
    data,
    pending,
    error: fetchError,
    status,
  } = useAsyncData(
    "jobs-opportunities",
    () =>
      api
        .get<ApiResponse<Opportunity[]>>("/opportunities", {
          query: opportunitiesQuery.value,
        })
        .then(
          (result): JobOpportunitiesResult => ({
            opportunities: result.data ?? [],
            currentPage: result.meta?.current_page ?? page.value,
            lastPage: result.meta?.last_page ?? 1,
            total: result.meta?.total ?? result.data?.length ?? 0,
          }),
        ),
    {
      default: (): JobOpportunitiesResult => ({
        opportunities: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
      }),
      watch: sort ? [page, debouncedFilters, sort] : [page, debouncedFilters],
    },
  );

  watch(
    filters,
    (value) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debouncedFilters.value = cloneFilters(value);
      }, 300);
    },
    { deep: true },
  );

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });

  const opportunities = computed(() => data.value?.opportunities ?? []);
  const currentPage = computed(() => data.value?.currentPage ?? page.value);
  const lastPage = computed(() => data.value?.lastPage ?? 1);
  const total = computed(() => data.value?.total ?? 0);

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  );

  const initialized = computed(
    () => status.value === "success" || status.value === "error",
  );

  return {
    opportunities,
    currentPage,
    lastPage,
    total,
    loading: pending,
    initialized,
    error,
  };
}
