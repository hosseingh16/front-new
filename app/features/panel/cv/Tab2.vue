<template>
  <div>
    <EducationSection />

    <ExperienceSection />

    <ProgramSection />

    <div id="section-skills" class="scroll-mt-24 bg-white p-4 rounded-2xl mt-8">
      <Titr>مهارت‌ها</Titr>
      <div class="my-4 grid lg:grid-cols-2 gap-x-4 gap-y-12">
        <Slider
          v-model="skills.excelScore"
          label="میزان آشنایی به نرم افزار اکسل:"
        />
        <Slider
          v-model="skills.flatCost"
          label="میزان آشنایی به حسابداری بهای تمام شده:"
        />
        <Slider
          v-model="skills.contractAccounting"
          label="میزان تجربه شما در حوزه حسابداری پیمان:"
        />
        <Slider
          v-model="skills.standardStatements"
          label="میزان آشنایی با تهیه صورت مالی استاندارد:"
        />
      </div>
      <div class="mt-6 flex items-center justify-end gap-2">
        <button
          class="btn btn-ghost h-10 rounded-lg text-sm text-text-passive"
          type="button"
          @click="resetSkills"
        >
          <Icon name="lucide:rotate-ccw" size="16" class="shrink-0" />
          بازگردانی تغییرات
        </button>
        <m-button
          class="btn-primary h-10 rounded-lg px-6 text-sm"
          type="button"
          :loading="savingSkills"
          @click="saveSkills"
        >
          <Icon name="svg:check-check" size="18" />
          ذخیره
        </m-button>
      </div>
    </div>

    <div id="section-potential" class="scroll-mt-24 bg-white p-4 rounded-2xl mt-8">
      <Titr>ارزیابی بیمه ای و مالیاتی</Titr>
      <div class="mt-4 grid lg:grid-cols-2 gap-x-4 gap-y-12">
        <Slider
          v-model="potential.valueAddedTaxScore"
          label="میزان آشنایی با مالیات ارزش افزوده:"
        />
        <Slider
          v-model="potential.performanceTaxScore"
          label="میزان آشنایی به مالیات عملکرد:"
        />
        <Slider
          v-model="potential.personalInsuranceScore"
          label="میزان آشنایی به بیمه های پرسنلی و قراردادی:"
        />
        <Slider
          v-model="potential.terminals"
          label="میزان آشنایی به سامانه مودیان و پایانه های فروشگاهی:"
        />
      </div>
      <div class="mt-6 flex items-center justify-end gap-2">
        <button
          class="btn btn-ghost h-10 rounded-lg text-sm text-text-passive"
          type="button"
          @click="resetPotential"
        >
          <Icon name="lucide:rotate-ccw" size="16" class="shrink-0" />
          بازگردانی تغییرات
        </button>
        <m-button
          class="btn-primary h-10 rounded-lg px-6 text-sm"
          type="button"
          :loading="savingPotential"
          @click="savePotential"
        >
          <Icon name="svg:check-check" size="18" />
          ذخیره
        </m-button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl mt-8">
      <Titr>فایل ضمیمه</Titr>
      <div class="mt-5 flex gap-1 items-center">
        <icons-check color="#009F65" />
        <span class="text-text-passive text-sm">
          در صورتی که فایل رزومه یا توضیحات جداگانه دارید میتوانید آن را اپلود
          کنید. این فایل برای کارفرمایان قابل مشاهده است.
        </span>
      </div>
      <div class="mt-4">
        <m-upload-box
          title="برای آپلود فایل کلیک کنید"
          subtitle="یا فایل را بکشید و در این محل رها کنید"
          :max-size="50"
          :accept="['pdf', 'doc']"
          svg-icon-name="uploading"
          :is-image="false"
        />
      </div>
      <div class="mt-6 flex items-center justify-end gap-2">
        <button class="btn btn-ghost h-10 rounded-lg text-sm text-text-passive">
          <Icon name="svg:close" size="16" />
          انصراف
        </button>
        <m-button class="btn-primary h-10 rounded-lg px-6 text-sm">
          <Icon name="svg:check-check" size="18" />
          ذخیره
        </m-button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl mt-8">
      <Titr :with-icon="false">قابل رویت برای همه</Titr>
      <div class="mt-4 flex items-center gap-2">
        <button
          type="button"
          class="shrink-0 p-1 w-14 h-8 rounded-full relative transition-colors"
          :class="[
            cvVisibility ? 'bg-primary-500' : 'bg-gray-300',
            savingVisibility
              ? 'cursor-wait opacity-60'
              : 'cursor-pointer',
          ]"
          :disabled="savingVisibility"
          :aria-pressed="cvVisibility"
          aria-label="قابل رویت برای همه"
          @click="toggleVisibility"
        >
          <div
            class="bg-white p-2 w-[60%] h-[80%] rounded-full flex justify-center items-center absolute top-[3.5px] transition-[left,right]"
            :class="cvVisibility ? 'left-1' : 'right-1'"
          >
            <icons-check
              v-if="cvVisibility"
              color="#4864E1"
            />
          </div>
        </button>
        <p class="text-text-primay leading-8">
          در صورت فعال بودن، رزومه شما در نتیجه جستجوی کارفرمایان قابل ‌رویت
          خواهد بود.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Slider from "./Slider.vue";
import Titr from "./Titr.vue";
import EducationSection from "./Tab2/EducationSection.vue";
import ExperienceSection from "./Tab2/ExperienceSection.vue";
import ProgramSection from "./Tab2/ProgramSection.vue";
import { getApiErrorMessage } from "~/utils/api-error";

type SkillForm = {
  excelScore: number;
  flatCost: number;
  contractAccounting: number;
  standardStatements: number;
};

type PotentialForm = {
  valueAddedTaxScore: number;
  performanceTaxScore: number;
  personalInsuranceScore: number;
  terminals: number;
};

const api = useApi();
const { $toast } = useNuxtApp();
const { user, refreshUser, patchUser } = useCurrentUser();

const skills = reactive<SkillForm>({
  excelScore: 0,
  flatCost: 0,
  contractAccounting: 0,
  standardStatements: 0,
});

const potential = reactive<PotentialForm>({
  valueAddedTaxScore: 0,
  performanceTaxScore: 0,
  personalInsuranceScore: 0,
  terminals: 0,
});

const savedSkills = ref<SkillForm>({ ...skills });
const savedPotential = ref<PotentialForm>({ ...potential });
const savingSkills = ref(false);
const savingPotential = ref(false);
const savingVisibility = ref(false);

const cvVisibility = computed(() => Boolean(user.value?.cv_visibility ?? true));

async function toggleVisibility() {
  if (savingVisibility.value) return;

  const previousValue = cvVisibility.value;
  const nextValue = !previousValue;

  savingVisibility.value = true;
  try {
    await api.post("cv/save-visibility", {
      cv_visibility: nextValue,
    });
    patchUser({ cv_visibility: nextValue });
    $toast.success(
      nextValue
        ? "رزومه شما برای کارفرمایان قابل رویت شد"
        : "رزومه شما از نتایج جستجو پنهان شد",
    );
  } catch (error) {
    $toast.error(getApiErrorMessage(error, "خطا در ذخیره وضعیت نمایش رزومه"));
  } finally {
    savingVisibility.value = false;
  }
}

function toSliderValue(value?: string | number | null) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  if (numeric <= 10) return Math.round(numeric);
  return Math.round(Math.max(0, Math.min(100, numeric)) / 10);
}

function loadSkillsFromUser(user: any) {
  const resumeSkills = user?.resume_skills;
  Object.assign(skills, {
    excelScore: toSliderValue(resumeSkills?.excel_score),
    flatCost: toSliderValue(resumeSkills?.flat_cost),
    contractAccounting: toSliderValue(resumeSkills?.contract_accounting),
    standardStatements: toSliderValue(resumeSkills?.standard_statements),
  });
  savedSkills.value = { ...skills };
}

function loadPotentialFromUser(user: any) {
  const resumePotential = user?.resume_potential;
  Object.assign(potential, {
    valueAddedTaxScore: toSliderValue(resumePotential?.value_added_tax_score),
    performanceTaxScore: toSliderValue(resumePotential?.performance_tax_score),
    personalInsuranceScore: toSliderValue(
      resumePotential?.personal_insurance_score,
    ),
    terminals: toSliderValue(resumePotential?.terminals),
  });
  savedPotential.value = { ...potential };
}

function resetSkills() {
  Object.assign(skills, savedSkills.value);
}

function resetPotential() {
  Object.assign(potential, savedPotential.value);
}

async function saveSkills() {
  savingSkills.value = true;
  try {
    await api.post("cv/save-skills", {
      excel_score: skills.excelScore,
      flat_cost: skills.flatCost,
      contract_accounting: skills.contractAccounting,
      standard_statements: skills.standardStatements,
    });
    savedSkills.value = { ...skills };
    $toast.success("مهارت‌ها با موفقیت ذخیره شد");
    await refreshUser();
  } catch (error) {
    $toast.error(getApiErrorMessage(error, "خطا در ذخیره مهارت‌ها"));
  } finally {
    savingSkills.value = false;
  }
}

async function savePotential() {
  savingPotential.value = true;
  try {
    await api.post("cv/save-potentials", {
      value_added_tax_score: potential.valueAddedTaxScore,
      performance_tax_score: potential.performanceTaxScore,
      personal_insurance_score: potential.personalInsuranceScore,
      terminals: potential.terminals,
    });
    savedPotential.value = { ...potential };
    $toast.success("ارزیابی بیمه‌ای و مالیاتی با موفقیت ذخیره شد");
    await refreshUser();
  } catch (error) {
    $toast.error(
      getApiErrorMessage(error, "خطا در ذخیره ارزیابی بیمه‌ای و مالیاتی"),
    );
  } finally {
    savingPotential.value = false;
  }
}

onMounted(() => {
  if (!user.value) return;

  loadSkillsFromUser(user.value);
  loadPotentialFromUser(user.value);
});
</script>
