<template>
  <div id="section-education" class="scroll-mt-24 bg-white p-4 rounded-2xl mt-5">
    <div class="flex justify-between items-center">
      <p class="font-yb-bold text-xl">
        <span class="text-primary-500">-</span> اطلاعات تحصیلی
      </p>
      <Icon v-if="educationItems.length == 0" name="svg:info" />
      <EducationModal
        v-else
        label="افزودن"
        :levels
        :years
        @item="addEducation"
      />
    </div>
    <div
      v-if="educationItems.length === 0"
      class="flex flex-col items-center justify-center gap-4 py-10"
    >
      <div class="text-center">
        <img src="/images/no-details.png" alt="" class="w-41" />
        <p class="font-yb-bold -mt-14">اطلاعات تحصیلی</p>
      </div>
      <p class="text-text-passive text-sm">
        شما هنوز اطلاعات تحصیلی خود را تکمیل نکرده‌اید.
      </p>
      <p class="text-text-passive text-sm">
        با افزودن حداقل یک سابقه تحصیلی، شانس شما برای استخدام افزایش پیدا
        می‌کند.
      </p>
      <EducationModal
        label="افزودن اطلاعات تحصیلی"
        :levels
        :years
        @item="addEducation"
      />
    </div>
    <div v-else class="mt-4 space-y-4" :class="{ 'select-none': draggingIndex != null }">
      <div
        v-for="(item, index) in educationItems"
        :key="item.id ?? `${item.degree}-${item.major}-${index}`"
        :data-cv-sort-index="index"
        class="p-4 border-2 border-dashed border-gray-default rounded-lg flex justify-between"
        :class="itemClass(index)"
      >
        <div class="flex items-start gap-4">
          <Icon name="svg:edu-item" size="28" />
          <div class="space-y-3">
            <p class="text-text-primay font-semibold">
              {{ levels.find((x) => x.value === item.degree)?.label }} .
              {{ item.major }}
            </p>
            <p class="text-text-passive text-sm">
              {{ item.university }} .
              <span v-if="!item.inStudy">{{
                years.find((x) => x.value === item.enddate)?.label
              }}</span>
              <span v-if="item.inStudy">مشغول به تحصیل</span>
            </p>
            <p v-if="item.description" class="text-text-passive text-sm">
              {{ item.description }}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <EducationModal
            :levels
            :years
            :edit-mode="true"
            :item-to-edit="item"
            @item="updateEducation(index, $event)"
          />
          <button
            type="button"
            class="btn-cv-action cursor-grab! touch-none active:cursor-grabbing!"
            aria-label="جابه‌جایی"
            @pointerdown="onHandlePointerDown(index, $event)"
          >
            <Icon name="svg:dots" />
          </button>
          <button
            class="btn-cv-action"
            @click="requestRemoveEducation(index)"
          >
            <Icon name="svg:trash" />
          </button>
        </div>
      </div>
    </div>

    <RemoveItemModal
      ref="removeModalRef"
      title="حذف اطلاعات تحصیلی"
      subtitle="آیا از حذف این مورد تحصیلی مطمئن هستید؟"
      description="پس از حذف، این مورد از رزومه شما پاک می‌شود و قابل بازیابی نخواهد بود."
      confirm-text="حذف"
      cancel-text="انصراف"
      icon="svg:delete"
      :loading="removing"
      @confirm="confirmRemoveEducation"
      @cancel="handleRemoveCancel"
    />
  </div>
</template>

<script setup lang="ts">
import EducationModal from "./EducationModal.vue";
import RemoveItemModal from "~/components/M/RemoveItemModal.vue";
import { getApiErrorMessage } from "~/utils/api-error";

const { cvMaxEducations } = useSettings();

// Variabels
const educationItems = ref<any[]>([]);
const api = useApi();
const { $toast } = useNuxtApp();
const { refreshUser } = useCurrentUser();
const { items: lookupItems } = useLookups(
  "education_levels,graduation_years",
);
const levels = lookupItems("education_levels");
const years = lookupItems("graduation_years");
const removeModalRef = ref<InstanceType<typeof RemoveItemModal> | null>(null);
const removingIndex = ref<number | null>(null);
const removing = ref(false);

async function addEducation(item: any) {
  if (educationItems.value.length >= cvMaxEducations.value) {
    $toast.error(
      `نمی‌توانید بیش از ${cvMaxEducations.value} سابقه تحصیلی ثبت کنید.`,
    );
    return;
  }

  educationItems.value.push(item);
  const synced = await syncEducation();
  if (!synced) {
    educationItems.value.pop();
  }
}

async function updateEducation(index: number, item: any) {
  const previous = educationItems.value[index];
  educationItems.value[index] = item;
  const synced = await syncEducation();
  if (!synced) {
    educationItems.value[index] = previous;
  }
}

function requestRemoveEducation(index: number) {
  if (!import.meta.client) return;
  removingIndex.value = index;
  removeModalRef.value?.showModal();
}

async function confirmRemoveEducation() {
  if (removingIndex.value == null) return;

  removing.value = true;
  const index = removingIndex.value;
  const removedItem = educationItems.value[index];

  try {
    educationItems.value.splice(index, 1);
    const synced = await syncEducation("remove");
    if (synced) {
      removeModalRef.value?.closeModal();
    } else {
      educationItems.value.splice(index, 0, removedItem);
    }
  } finally {
    removing.value = false;
    removingIndex.value = null;
  }
}

function handleRemoveCancel() {
  removingIndex.value = null;
}

async function syncEducation(action: "save" | "remove" | "reorder" = "save") {
  try {
    await api.post("cv/sync-education", {
      education_items: educationItems.value,
    });
    if (action !== "reorder") {
      $toast.success(
        action === "remove"
          ? "اطلاعات تحصیلی با موفقیت حذف شد"
          : "اطلاعات تحصیلی با موفقیت ذخیره شد",
      );
    }
    await refreshUser();
    return true;
  } catch (error) {
    console.error("Sync failed:", error);
    $toast.error(
      getApiErrorMessage(
        error,
        action === "remove"
          ? "خطا در حذف اطلاعات تحصیلی"
          : "خطا در ذخیره اطلاعات تحصیلی",
      ),
    );
    return false;
  }
}

const { draggingIndex, itemClass, onHandlePointerDown } = useHandleReorder(
  educationItems,
  () => syncEducation("reorder"),
);

onMounted(async () => {
  //Load user data
  const currentUser = useSanctumUser<any>();

  educationItems.value = (currentUser.value.data?.resume_educations ?? []).map(
    (item: any) => ({
      id: item.id,
      degree: item.degree,
      major: item.major,
      university: item.university,
      enddate: item.enddate ?? "",
      stillbusy: Boolean(item.stillbusy),
      inStudy: Boolean(item.stillbusy),
      description: item.description ?? "",
    }),
  );
});
</script>
