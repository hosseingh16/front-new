<template>
  <div class="space-y-8">
    <section
      class="rounded-2xl border border-gray-default bg-white p-6 text-right"
    >
      <AdSectionTitle title="درباره سازمان:" />

      <div
        v-if="company?.intro"
        class="prose mt-4 max-w-none text-right text-base leading-[1.7] text-text-secondary prose-p:mb-5 prose-li:marker:text-text-secondary"
        v-html="company.intro"
      />
      <p
        v-else-if="!company?.culture && !company?.advantages"
        class="mt-4 text-sm text-text-passive"
      >
        اطلاعاتی برای نمایش ثبت نشده است.
      </p>

      <template v-if="company?.culture">
        <AdSectionTitle class="mt-8" title="فرهنگ سازمانی" />
        <div
          class="prose mt-4 max-w-none text-right text-base leading-[1.7] text-text-secondary"
          v-html="company.culture"
        />
      </template>

      <template v-if="company?.advantages">
        <AdSectionTitle class="mt-8" title="مزایای شغلی" />
        <div
          class="prose mt-4 max-w-none text-right text-base leading-[1.7] text-text-secondary"
          v-html="company.advantages"
        />
      </template>

      <div
        v-if="companyStats.length"
        class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AdRequirementStat
          v-for="item in companyStats"
          :key="item.label"
          :label="item.label"
          :value="item.value"
          :icon="item.icon"
        />
      </div>
    </section>

    <section
      v-if="fullAddress || company?.static_map"
      class="rounded-2xl border border-gray-default bg-white p-6"
    >
      <AdSectionTitle title="موقعیت مکانی" />
      <p
        v-if="fullAddress"
        class="mt-4 text-base leading-[1.7] text-text-secondary"
      >
        {{ fullAddress }}
      </p>
      <div v-if="company?.static_map" class="mt-4 overflow-hidden rounded-lg">
        <img
          :src="company.static_map"
          alt="موقعیت مکانی"
          class="h-auto w-full object-cover"
        />
      </div>
    </section>

    <section
      v-if="company?.gallery?.length"
      class="rounded-2xl border border-gray-default bg-white p-6"
    >
      <AdSectionTitle title="گالری تصاویر:" />
      <div class="mt-4 grid gap-4 sm:grid-cols-3">
        <button
          v-for="(image, index) in company.gallery"
          :key="`gallery-${index}`"
          type="button"
          class="cursor-pointer overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          @click="openGalleryImage(image, index)"
        >
          <img
            :src="image"
            :alt="`تصویر ${index + 1} ${company.name}`"
            class="h-45.5 w-full object-cover transition-opacity hover:opacity-90"
            loading="lazy"
          />
        </button>
      </div>
    </section>

    <dialog
      ref="galleryDialogRef"
      class="modal"
      @click="handleGalleryBackdropClick"
    >
      <div class="modal-box relative max-w-[min(90vw,720px)] p-3 sm:p-4">
        <button
          type="button"
          class="absolute left-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-text-passive shadow"
          aria-label="بستن"
          @click="closeGalleryImage"
        >
          <Icon name="material-symbols:close" size="18" />
        </button>
        <img
          v-if="selectedGalleryImage"
          :src="selectedGalleryImage"
          :alt="selectedGalleryAlt"
          class="max-h-[80vh] w-full rounded-lg object-contain"
        />
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import type { Ad } from "~/types/ad";
import AdSectionTitle from "./AdSectionTitle.vue";
import AdRequirementStat from "./AdRequirementStat.vue";

const props = defineProps<{
  ad: Ad;
}>();

const company = computed(() => props.ad.company);

const { items: lookupItems } = useLookups("industries,company_sizes");
const industryOptions = lookupItems("industries");
const sizeOptions = lookupItems("company_sizes");

function resolveLookupLabel(
  options: { value: string | number; label: string }[],
  value: string | null | undefined,
) {
  if (!value?.trim()) return "";
  const match = options.find((item) => String(item.value) === String(value));
  return match?.label ?? value;
}

const activityLabel = computed(() =>
  resolveLookupLabel(industryOptions.value, company.value?.activity),
);

const sizeLabel = computed(() =>
  resolveLookupLabel(sizeOptions.value, company.value?.size),
);

const isTelPublic = computed(() => Boolean(company.value?.is_tell_public));

const companyStats = computed(() => {
  const stats: { label: string; value: string; icon: string }[] = [];

  if (activityLabel.value) {
    stats.push({
      label: "نوع فعالیت:",
      value: activityLabel.value,
      icon: "lucide:building",
    });
  }

  if (sizeLabel.value) {
    stats.push({
      label: "تعداد پرسنل:",
      value: sizeLabel.value,
      icon: "lucide:users",
    });
  }

  if (company.value?.tel && isTelPublic.value) {
    stats.push({
      label: "شماره تماس شرکت:",
      value: company.value.tel,
      icon: "lucide:phone-call",
    });
  }

  return stats;
});

const fullAddress = computed(() => {
  const c = company.value;
  if (!c) return "";
  return [c.province_name, c.city_name, c.address].filter(Boolean).join("، ");
});

const galleryDialogRef = ref<HTMLDialogElement | null>(null);
const selectedGalleryImage = ref<string | null>(null);
const selectedGalleryIndex = ref(0);

const selectedGalleryAlt = computed(
  () => `تصویر ${selectedGalleryIndex.value + 1} ${company.value?.name ?? ""}`,
);

function openGalleryImage(image: string, index: number) {
  selectedGalleryImage.value = image;
  selectedGalleryIndex.value = index;
  galleryDialogRef.value?.showModal();
}

function closeGalleryImage() {
  galleryDialogRef.value?.close();
}

function handleGalleryBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeGalleryImage();
  }
}
</script>
