<template>
  <div id="section-software" class="scroll-mt-24 bg-white p-4 rounded-2xl mt-8">
    <div class="flex justify-between items-center">
      <p class="font-yb-bold text-xl">
        <span class="text-primary-500">-</span> نرم‌افزار حسابداری
      </p>
      <Icon v-if="programsItems.length == 0" name="svg:info" />
      <ProgramModal v-else label="افزودن" :programs @item="addSoftware" />
    </div>
    <div
      v-if="programsItems.length === 0"
      class="flex flex-col items-center justify-center gap-4 py-10"
    >
      <div class="text-center">
        <img src="/images/no-details.png" alt="" class="w-41" />
        <p class="font-yb-bold -mt-14">نرم‌افزار حسابداری</p>
      </div>
      <p class="text-text-passive text-sm">
        شما هنوز نرم افزار حسابداری خود را تکمیل نکرده‌اید.
      </p>
      <p class="text-text-passive text-sm">
        با افزودن حداقل یک نرم افزار حسابداری، شانس شما برای استخدام افزایش پیدا
        می‌کند.
      </p>
      <ProgramModal
        label="افزودن نرم‌افزار حسابداری"
        :programs
        @item="addSoftware"
      />
    </div>
    <div v-else class="mt-4 space-y-4" :class="{ 'select-none': draggingIndex != null }">
      <div
        v-for="(item, index) in programsItems"
        :key="item.id ?? index"
        :data-cv-sort-index="index"
        class="p-4 border-2 border-dashed border-gray-default rounded-lg flex justify-between"
        :class="itemClass(index)"
      >
        <div>
          <p class="text-text-primay font-semibold">
            {{
              programs.find(
                (x) => String(x.value) === String(item.programName),
              )?.label
            }}
          </p>
          <template v-if="itemHasSubsystems(item)">
            <p class="text-text-passive text-sm mt-2">
              میزان تسلط به زیر سیستم‌ها:
            </p>
            <div class="mt-2 flex items-center flex-wrap gap-x-12 gap-y-2">
              <p class="text-text-passive text-sm">
                انبار: <span class="text-text-primay">{{ item.slider1 }}</span>
              </p>
              <p class="text-text-passive text-sm">
                مالی: <span class="text-text-primay">{{ item.slider2 }}</span>
              </p>
              <p class="text-text-passive text-sm">
                حقوق: <span class="text-text-primay">{{ item.slider3 }}</span>
              </p>
              <p class="text-text-passive text-sm">
                فروش: <span class="text-text-primay">{{ item.slider4 }}</span>
              </p>
              <p class="text-text-passive text-sm">
                نقد و بانک:
                <span class="text-text-primay">{{ item.slider5 }}</span>
              </p>
            </div>
          </template>
          <p v-else class="text-text-passive text-sm mt-2">
            میزان تسلط به نرم‌افزار:
            <span class="text-text-primay">{{ item.generalSkill }}</span>
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <ProgramModal
            :programs
            :edit-mode="true"
            :item-to-edit="item"
            @item="updateSoftware(index, $event)"
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
            @click="requestRemoveSoftware(index, item.id)"
          >
            <Icon name="svg:trash" />
          </button>
        </div>
      </div>
    </div>

    <RemoveItemModal
      ref="removeModalRef"
      title="حذف نرم‌افزار حسابداری"
      subtitle="آیا از حذف این نرم‌افزار حسابداری مطمئن هستید؟"
      description="پس از حذف، این مورد از رزومه شما پاک می‌شود و قابل بازیابی نخواهد بود."
      confirm-text="حذف"
      cancel-text="انصراف"
      icon="svg:delete"
      :loading="removing"
      @confirm="confirmRemoveSoftware"
      @cancel="handleRemoveCancel"
    />
  </div>
</template>

<script setup lang="ts">
import type { ISelectItem } from "~/types/select-item";
import type { UserResumeSoftware } from "~/types/user-resume";
import ProgramModal from "./ProgramModal.vue";
import RemoveItemModal from "~/components/M/RemoveItemModal.vue";
import { getApiErrorMessage } from "~/utils/api-error";

export type ProgramItem = {
  id?: number;
  programName: string | number;
  programType?: 0 | 1;
  generalSkill?: number;
  slider1?: number;
  slider2?: number;
  slider3?: number;
  slider4?: number;
  slider5?: number;
};

const api = useApi();
const { $toast } = useNuxtApp();
const { refreshUser } = useCurrentUser();
const { cvMaxSoftwares } = useSettings();
const programsItems = ref<ProgramItem[]>([]);
const { items: lookupItems } = useLookups("accounting_programs");
const programs = lookupItems("accounting_programs");
const removeModalRef = ref<InstanceType<typeof RemoveItemModal> | null>(null);
const removingIndex = ref<number | null>(null);
const removingSoftwareId = ref<number | null>(null);
const removing = ref(false);
const lastSubmittedItem = ref<ProgramItem | null>(null);
const { draggingIndex, itemClass, onHandlePointerDown } =
  useHandleReorder(programsItems);

function resolveProgramType(program?: ISelectItem): 0 | 1 {
  return program?.type === 0 ? 0 : 1;
}

function itemHasSubsystems(item: ProgramItem) {
  if (item.programType != null) return item.programType === 1;

  const program = programs.value.find(
    (entry) => String(entry.value) === String(item.programName),
  );
  return resolveProgramType(program) === 1;
}

function toSliderValue(value?: string | number | null) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  if (numeric <= 10) return Math.round(numeric);
  return Math.round(Math.max(0, Math.min(100, numeric)) / 10);
}

function hasApiSkillValue(value?: string | number | null) {
  return value != null && value !== "";
}

function resolveProgramName(name?: string | number | null) {
  if (name == null || name === "") return "";

  const text = String(name).trim();
  if (!text) return "";

  const byValue = programs.value.find(
    (program) => String(program.value) === text,
  );
  if (byValue) return byValue.value;

  const byLabel = programs.value.find((program) => program.label.trim() === text);
  if (byLabel) return byLabel.value;

  return name;
}

function softwareMatchesItem(
  apiItem: UserResumeSoftware,
  item: ProgramItem,
) {
  if (apiItem.id != null && item.id != null && apiItem.id === item.id) {
    return true;
  }

  const apiProgramName = resolveProgramName(apiItem.name);
  return String(apiProgramName) === String(item.programName);
}

function toCreatePayload(item: ProgramItem) {
  const payload: Record<string, unknown> = {
    name: item.programName,
    type: item.programType ?? 1,
  };

  if (item.programType === 0) {
    payload.general_skill = item.generalSkill ?? 0;
    return payload;
  }

  payload.anbar = item.slider1 ?? 0;
  payload.mali = item.slider2 ?? 0;
  payload.hoghogh = item.slider3 ?? 0;
  payload.forosh = item.slider4 ?? 0;
  payload.naghdobank = item.slider5 ?? 0;

  return payload;
}

function mapSoftware(
  item: UserResumeSoftware,
  fallback?: ProgramItem,
): ProgramItem {
  const programType =
    fallback?.programType ?? (Number(item.type) === 0 ? 0 : 1);

  const programName =
    resolveProgramName(item.name) || fallback?.programName || "";

  return {
    id: item.id ?? fallback?.id,
    programName,
    programType,
    generalSkill: hasApiSkillValue(item.general_skill)
      ? toSliderValue(item.general_skill)
      : (fallback?.generalSkill ?? 0),
    slider1: hasApiSkillValue(item.anbar)
      ? toSliderValue(item.anbar)
      : (fallback?.slider1 ?? 0),
    slider2: hasApiSkillValue(item.mali)
      ? toSliderValue(item.mali)
      : (fallback?.slider2 ?? 0),
    slider3: hasApiSkillValue(item.hoghogh)
      ? toSliderValue(item.hoghogh)
      : (fallback?.slider3 ?? 0),
    slider4: hasApiSkillValue(item.forosh)
      ? toSliderValue(item.forosh)
      : (fallback?.slider4 ?? 0),
    slider5: hasApiSkillValue(item.naghdobank)
      ? toSliderValue(item.naghdobank)
      : (fallback?.slider5 ?? 0),
  };
}

function loadProgramsFromUser() {
  const currentUser = useSanctumUser<any>();
  const softwares = currentUser.value?.data?.resume_softwares ?? [];
  const submitted = lastSubmittedItem.value;

  programsItems.value = softwares.map((item: UserResumeSoftware) => {
    const fallback =
      submitted && softwareMatchesItem(item, submitted) ? submitted : undefined;
    return mapSoftware(item, fallback);
  });
}

async function addSoftware(item: ProgramItem) {
  const exists = programsItems.value.some(
    (entry) => String(entry.programName) === String(item.programName),
  );
  if (exists) {
    $toast.error("این نرم‌افزار حسابداری قبلاً ثبت شده است.");
    return;
  }

  if (programsItems.value.length >= cvMaxSoftwares.value) {
    $toast.error(
      `نمی‌توانید بیش از ${cvMaxSoftwares.value} نرم‌افزار حسابداری ثبت کنید.`,
    );
    return;
  }

  try {
    lastSubmittedItem.value = item;
    await api.post<UserResumeSoftware>(
      "cv/create-software",
      toCreatePayload(item),
    );
    $toast.success("نرم‌افزار حسابداری با موفقیت افزوده شد");
    await refreshUser();
    loadProgramsFromUser();
  } catch (error: any) {
    if (error?.status === 422) {
      const maxSoftwares = error?.data?.max_softwares;
      $toast.error(
        maxSoftwares != null
          ? `نمی‌توانید بیش از ${maxSoftwares} نرم‌افزار حسابداری ثبت کنید.`
          : getApiErrorMessage(error, "خطا در افزودن نرم‌افزار حسابداری"),
      );
      return;
    }

    $toast.error(getApiErrorMessage(error, "خطا در افزودن نرم‌افزار حسابداری"));
  } finally {
    lastSubmittedItem.value = null;
  }
}

async function updateSoftware(index: number, item: ProgramItem) {
  if (item.id == null) return;

  try {
    const { id, ...data } = item;
    lastSubmittedItem.value = item;
    await api.patch<UserResumeSoftware>(
      `cv/update-software/${id}`,
      toCreatePayload(data),
    );
    $toast.success("نرم‌افزار حسابداری با موفقیت ویرایش شد");
    await refreshUser();
    loadProgramsFromUser();
  } catch (error) {
    $toast.error(getApiErrorMessage(error, "خطا در ویرایش نرم‌افزار حسابداری"));
  } finally {
    lastSubmittedItem.value = null;
  }
}

function requestRemoveSoftware(index: number, id?: number) {
  if (!import.meta.client || id == null) return;
  removingIndex.value = index;
  removingSoftwareId.value = id;
  removeModalRef.value?.showModal();
}

async function confirmRemoveSoftware() {
  if (removingIndex.value == null || removingSoftwareId.value == null) return;

  removing.value = true;
  const index = removingIndex.value;
  const id = removingSoftwareId.value;

  try {
    await api.delete(`cv/software/${id}`);
    programsItems.value.splice(index, 1);
    removeModalRef.value?.closeModal();
    $toast.success("نرم‌افزار حسابداری با موفقیت حذف شد");
    await refreshUser();
  } catch (error) {
    $toast.error(getApiErrorMessage(error, "خطا در حذف نرم‌افزار حسابداری"));
  } finally {
    removing.value = false;
    removingIndex.value = null;
    removingSoftwareId.value = null;
  }
}

function handleRemoveCancel() {
  removingIndex.value = null;
  removingSoftwareId.value = null;
}

watch(
  () => useSanctumUser<any>().value?.data?.resume_softwares,
  () => loadProgramsFromUser(),
  { immediate: true },
);
</script>
