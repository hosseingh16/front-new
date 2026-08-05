<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>فیلدهای عمومی</Titr>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="lg:col-span-2">
        <m-select2
          v-model="form.title"
          label="عنوان شغلی:"
          required
          :options="jobTitles"
          placeholder="عنوان شغلی را انتخاب کنید"
          :error="Boolean(errors.title)"
        />
        <p v-if="errors.title" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.title }}
        </p>
      </div>

      <div class="lg:col-span-2">
        <p class="mb-2 text-base">آدرس:</p>

        <div class="grid gap-6 lg:grid-cols-2">
          <div>
            <m-select2
              v-model="selectedProvince"
              label="استان:"
              required
              search
              :options="provinceOptions"
              placeholder="استان را انتخاب کنید"
              :error="Boolean(errors.province)"
            />
            <p v-if="errors.province" class="mt-1 text-xs text-[#EF4035]">
              {{ errors.province }}
            </p>
          </div>

          <div>
            <m-select2
              v-model="selectedCity"
              label="شهر:"
              required
              :options="cityOptions"
              search
              placeholder="شهر را انتخاب کنید"
              :disabled="!form.province || citiesLoading"
              :error="Boolean(errors.city)"
            />
            <p v-if="errors.city" class="mt-1 text-xs text-[#EF4035]">
              {{ errors.city }}
            </p>
          </div>

          <m-select2
            v-model="selectedRegion"
            label="منطقه:"
            :options="regionOptions"
            search
            placeholder="منطقه را انتخاب کنید"
            :disabled="!form.city || regionsLoading || !hasRegions"
          />
        </div>

        <div
          v-if="paidCityName"
          class="mt-3 flex items-start gap-2 text-sm text-[#B95C04]"
        >
          <Icon
            name="lucide:triangle-alert"
            class="mt-0.5 shrink-0"
            size="18"
          />
          <span>
            ثبت آگهی در شهر «{{ paidCityName }}» شامل هزینه می‌باشد.
          </span>
        </div>
      </div>

      <div>
        <m-select2
          v-model="form.employment_type"
          label="نوع همکاری:"
          required
          :options="employmentTypes"
          placeholder="نوع همکاری را انتخاب کنید"
          :error="Boolean(errors.employment_type)"
        />
        <p v-if="errors.employment_type" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.employment_type }}
        </p>
      </div>

      <div>
        <p class="mb-2 text-base">جنسیت:</p>
        <m-toggle v-model="form.gender" same-width :items="genderItems" />
      </div>

      <div v-if="isPartTime" class="lg:col-span-2">
        <CreateAdPartTimeSection :form="form" :errors="errors" />
      </div>

      <div>
        <m-select2
          v-model="form.minimum_work_experience"
          label="سابقه کار:"
          required
          :options="experienceLevels"
          placeholder="سابقه کار را انتخاب کنید"
        />
      </div>

      <div>
        <m-select2
          v-model="form.salary_range"
          label="حقوق:"
          :options="salaryRanges"
          placeholder="محدوده حقوق را انتخاب کنید"
        />
      </div>

      <div>
        <m-select2
          v-model="form.minimum_degree"
          label="حداقل مدرک تحصیلی:"
          :options="educationLevels"
          placeholder="مدرک تحصیلی را انتخاب کنید"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import CreateAdPartTimeSection from "./CreateAdPartTimeSection.vue";
import { provinces } from "~/feeders/provinces";
import { findPaidAdCityName } from "~/pages/dashboard/employer/ads/utils/paid-ad-cities";
import type {
  CreateAdFormErrors,
  CreateAdFormModel,
} from "~/types/create-ad-form";
import type { ISelectItem } from "~/types/select-item";

const props = defineProps<{
  form: CreateAdFormModel;
  errors: CreateAdFormErrors;
  isPartTime: boolean;
  jobTitles: ISelectItem[];
  employmentTypes: ISelectItem[];
  experienceLevels: ISelectItem[];
  salaryRanges: ISelectItem[];
  educationLevels: ISelectItem[];
  genders: ISelectItem[];
  cityOptions: ISelectItem[];
  regionOptions: ISelectItem[];
  citiesLoading: boolean;
  regionsLoading: boolean;
  loadCities: (provinceId: number) => Promise<void>;
  loadRegions: (cityId: number) => Promise<void>;
}>();

const provinceOptions = provinces;
const hasRegions = computed(() => props.regionOptions.length > 0);

const paidCityName = computed(() =>
  findPaidAdCityName(props.form.city_name),
);

function clearRegionFields() {
  props.form.region = null;
  props.form.region_name = "";
}

const genderItems = computed(() => {
  if (props.genders.length) {
    return props.genders.map((item) => ({
      title: item.label,
      value: String(item.value),
    }));
  }

  return [
    { title: "زن", value: "زن" },
    { title: "مرد", value: "مرد" },
    { title: "در هر دو حالت", value: "مهم نیست" },
  ];
});

const selectedProvince = computed({
  get: () => props.form.province ?? undefined,
  set: async (value: string | number | undefined) => {
    const provinceId = value == null ? null : Number(value);
    props.form.province = provinceId;
    props.form.province_name =
      provinceOptions.find((item) => item.value === provinceId)?.label ?? "";
    props.form.city = null;
    props.form.city_name = "";
    clearRegionFields();
    if (provinceId) await props.loadCities(provinceId);
  },
});

const selectedCity = computed({
  get: () => props.form.city ?? undefined,
  set: async (value: string | number | undefined) => {
    const cityId = value == null ? null : Number(value);
    props.form.city = cityId;
    props.form.city_name =
      props.cityOptions.find((item) => item.value === cityId)?.label ?? "";
    clearRegionFields();
    if (cityId) await props.loadRegions(cityId);
  },
});

const selectedRegion = computed({
  get: () => props.form.region ?? undefined,
  set: (value: string | number | undefined) => {
    const regionId = value == null ? null : Number(value);
    props.form.region = regionId;
    props.form.region_name =
      props.regionOptions.find((item) => item.value === regionId)?.label ?? "";
  },
});

watch(
  () => props.genders,
  (genders) => {
    const currentInOptions = genders.some(
      (item) => String(item.value) === String(props.form.gender),
    );
    if (props.form.gender && currentInOptions) return;

    const defaultOption =
      genders.find((item) => String(item.value) === "any") ??
      genders.find((item) => /هر دو|مهم/.test(item.label)) ??
      genderItems.value.find((item) => /هر دو|مهم/.test(item.title));

    props.form.gender = defaultOption
      ? String(defaultOption.value)
      : "مهم نیست";
  },
  { immediate: true },
);
</script>
