<template>
  <aside
    class="bg-white rounded-lg border border-b-0 border-gray-default text-text-tertiary text-sm"
    :class="props.class"
  >
    <div class="flex w-full items-center justify-between px-4 py-2 mt-2">
      <span class="text-sm font-semibold text-text-passive">فیلترها</span>
      <button
        type="button"
        class="flex items-center gap-1.5 text-sm font-semibold text-[#dd4a48] transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-50 cursor-pointer"
        :disabled="activeFilterCount === 0"
        @click="clearFilters"
      >
        <span>حذف فیلترها</span>
        <span
          v-if="activeFilterCount > 0"
          class="inline-flex min-w-5 items-center justify-center rounded-md bg-[#dd4a4814] px-1.5 py-0.5 text-xs font-semibold leading-none text-[#dd4a48]"
        >
          {{ toPersianDigits(activeFilterCount) }}
        </span>
      </button>
    </div>

    <div class="join join-vertical w-full">
      <FilterCollapse
        v-for="(section, index) in JOB_FILTER_SECTIONS"
        :key="section.title"
        :expand="index === 0"
      >
        <template #title>
          <Icon :name="`svg:${section.icon}`" />
          {{ section.title }}
        </template>

        <template #content>
          <div v-if="index === 0" class="space-y-2">
            <div
              v-for="jobType in adTypeOptions"
              :key="jobType.value"
              class="flex items-center gap-2"
            >
              <input
                v-model="selectedJobTypes"
                type="checkbox"
                :value="jobType.value"
                class="checkbox checkbox-primary p-1.5"
              />
              <Icon name="svg:bag-3" />
              <span>{{ jobType.label }}</span>
            </div>
          </div>

          <div v-else-if="index === 1" class="pb-1">
            <FilterSearchField
              v-model="jobTitleSearch"
              placeholder="جستجوی عنوان شغلی و ..."
            />
          </div>

          <div v-else-if="index === 2" class="pb-1">
            <FilterSearchField
              v-model="jobGroupSearch"
              placeholder="جستجو در گروه‌های شغلی"
              wrapper-class="mb-3"
            />
            <FilterCheckboxList
              v-model="selectedJobGroups"
              :options="filteredJobGroups"
            />
          </div>

          <div v-else-if="index === 3" class="pb-1">
            <FilterSearchField
              v-model="citySearch"
              placeholder="جستجو در شهرها"
              wrapper-class="mb-3"
            />
            <div class="max-h-[280px] space-y-2 overflow-y-auto">
              <div
                v-for="item in filteredLocationTree"
                :key="item.province.value"
                class="space-y-2"
              >
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="provinceCheckState(item.province.value as number) === 'all'"
                    :ref="(el) => setProvinceIndeterminate(el, item.province.value as number)"
                    class="checkbox checkbox-primary p-1.5"
                    @change="toggleProvince(item.province.value as number)"
                  />
                  <span
                    class="flex-1 cursor-pointer"
                    @click="toggleProvinceExpand(item.province.value as number)"
                  >
                    {{ item.province.label }}
                  </span>
                  <button
                    type="button"
                    class="shrink-0 p-0.5"
                    @click="toggleProvinceExpand(item.province.value as number)"
                  >
                    <icons-chevron
                      class="transition-transform"
                      :class="{ 'rotate-180': isProvinceExpanded(item) }"
                      color="#757575"
                    />
                  </button>
                </div>
                <div v-if="isProvinceExpanded(item)" class="me-6 space-y-2">
                  <p
                    v-if="citiesLoading[item.province.value as number]"
                    class="text-xs text-text-passive"
                  >
                    در حال بارگذاری...
                  </p>
                  <div
                    v-for="city in item.cities"
                    :key="city.value"
                    class="flex items-center gap-2 px-2"
                  >
                    <input
                      type="checkbox"
                      :checked="isCitySelected(city.value)"
                      class="checkbox checkbox-primary p-1.5"
                      @change="toggleCity(city.value, item.province.value as number, $event)"
                    />
                    <span>{{ city.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FilterCheckboxList
            v-else-if="index === 4"
            v-model="selectedSalaries"
            :options="salaryRanges"
            list-class="pb-1"
          />

          <FilterCheckboxList
            v-else-if="index === 5"
            v-model="selectedWorkHistory"
            :options="experienceLevels"
            list-class="pb-1"
          />

          <FilterCheckboxList
            v-else-if="index === 6"
            v-model="selectedContractTypes"
            :options="contractTypeOptions"
            list-class="pb-1"
          />

          <FilterCheckboxList
            v-else-if="index === 7"
            v-model="selectedBenefits"
            :options="benefits"
            list-class="pb-1"
          />
        </template>
      </FilterCollapse>
    </div>
  </aside>
</template>

<script setup lang="ts">
import FilterCheckboxList from '~/components/Elements/FilterCheckboxList.vue'
import FilterSearchField from '~/components/Elements/FilterSearchField.vue'
import FilterCollapse from '~/features/home/FilterCollapse.vue'
import { toPersianDigits } from '~/composables/useCountUp'
import { useJobFilters } from '~/composables/useJobFilters'
import { JOB_FILTER_SECTIONS, type JobFiltersModel } from '~/types/job-filters'

const props = defineProps<{
  class?: string
}>()

const model = defineModel<JobFiltersModel>({ required: true })

const {
  jobTitleSearch,
  jobGroupSearch,
  citySearch,
  salaryRanges,
  experienceLevels,
  benefits,
  selectedJobTypes,
  selectedJobGroups,
  selectedSalaries,
  selectedWorkHistory,
  selectedContractTypes,
  selectedBenefits,
  selectedCities,
  citiesLoading,
  adTypeOptions,
  contractTypeOptions,
  filteredJobGroups,
  filteredLocationTree,
  activeFilterCount,
  clearFilters,
  provinceCheckState,
  setProvinceIndeterminate,
  isProvinceExpanded,
  toggleProvinceExpand,
  toggleProvince,
  toggleCity,
  isCitySelected,
} = useJobFilters(model)
</script>
