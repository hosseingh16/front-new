<template>
  <dialog
    ref="dialogRef"
    class="modal"
    dir="rtl"
    aria-labelledby="tax-return-request-title"
    @click="onBackdropClick"
  >
    <div
      class="modal-box relative w-full max-w-2xl overflow-y-auto rounded-2xl p-5 md:p-6"
      @click.stop
    >
      <button
        type="button"
        class="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center text-text-passive transition-opacity hover:opacity-70"
        aria-label="بستن"
        @click="closeModal"
      >
        <Icon name="svg:close" size="20" />
      </button>

      <div v-if="submitted" class="pt-6 text-center">
        <Icon name="svg:illust-consulting-user" size="200" class="mx-auto" />

        <h2 class="mt-2 font-yb-bold text-xl text-text-tertiary md:text-2xl">
          درخواست شما با موفقیت ثبت شد
        </h2>
        <p class="mt-3 text-sm leading-7 text-text-passive">
          اطلاعات شما برای بررسی اولیه ارسال شد. نتیجه و ادامه مراحل از طریق
          تماس یا پیامک به شما اطلاع داده می‌شود
        </p>

        <button
          type="button"
          class="btn btn-primary mt-8 h-11 w-full rounded-xl font-yb-bold"
          @click="closeModal"
        >
          باشه فهمیدم
        </button>
      </div>

      <form v-else class="space-y-6 pt-10" @submit.prevent="onSubmit">
        <div
          v-if="autoAssign"
          class="flex items-center justify-between gap-3 rounded-xl border border-gray-default bg-surface-50 p-3"
        >
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <span class="shrink-0 text-sm text-text-passive">مشاور:</span>
            <div
              class="inline-flex max-w-full items-center gap-2 rounded-full border border-gray-default bg-white py-1 pe-3 ps-1"
            >
              <span
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#7C5CFC] to-primary-500 text-white"
                aria-hidden="true"
              >
                <Icon name="lucide:sparkles" size="16" />
              </span>
              <span class="truncate text-sm font-semibold text-text-tertiary">
                انتخاب مشاور را به های‌حساب سپردید
              </span>
            </div>
          </div>
          <button
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 text-sm text-text-passive transition-opacity hover:opacity-80"
            @click="onChangeConsultant"
          >
            <Icon name="lucide:refresh-cw" size="14" class="shrink-0" />
            <span>تغییر</span>
          </button>
        </div>

        <div
          v-else-if="selectedConsultant"
          class="flex items-center justify-between gap-3 rounded-xl border border-gray-default bg-white p-3"
        >
          <div class="flex min-w-0 flex-wrap items-center gap-3">
            <span class="shrink-0 text-sm text-text-passive">مشاور:</span>
            <div
              class="inline-flex max-w-full items-center gap-2 rounded-full border border-gray-default bg-success-50 py-1 pe-3 ps-1"
            >
              <div
                class="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#8EA0B5]"
              >
                <img
                  :src="consultantAvatarSrc"
                  :alt="selectedConsultant.name"
                  class="h-full w-full object-cover"
                />
              </div>
              <span class="truncate text-sm font-semibold text-text-tertiary">
                {{ selectedConsultant.name }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 text-sm text-text-passive transition-opacity hover:opacity-80"
            @click="onChangeConsultant('self')"
          >
            <Icon name="lucide:refresh-cw" size="14" class="shrink-0" />
            <span>تغییر</span>
          </button>
        </div>

        <div>
          <div class="mb-2 flex items-center gap-2">
            <span
              class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
              aria-hidden="true"
            />
            <h2
              id="tax-return-request-title"
              class="font-yb-bold text-base text-text-tertiary"
            >
              نوع فعالیت
            </h2>
          </div>

          <div class="mt-5 space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <m-select2
                  v-model="form.activityType"
                  label="نوع فعالیت :"
                  required
                  :options="activityOptions"
                  placeholder="نوع فعالیت خود را انتخاب کنید"
                  :error="Boolean(errors.activityType)"
                />
                <p v-if="errors.activityType" class="mt-1 text-xs text-error">
                  {{ errors.activityType }}
                </p>
              </div>
              <div>
                <m-select2
                  v-model="form.financialTurnover"
                  label="میزان گردش مالی :"
                  required
                  :options="turnoverOptions"
                  placeholder="میزان گردش مالی را تعیین کنید"
                  :error="Boolean(errors.financialTurnover)"
                />
                <p
                  v-if="errors.financialTurnover"
                  class="mt-1 text-xs text-error"
                >
                  {{ errors.financialTurnover }}
                </p>
              </div>
            </div>

            <div>
              <m-text-field
                v-model="form.desc"
                multiline
                label="شرح فعالیت:"
                required
                placeholder="شرح فعالیت خود را وارد کنید"
                :error="Boolean(errors.desc)"
              />
              <div class="mt-1 flex items-center justify-between gap-3">
                <p v-if="errors.desc" class="text-xs text-error">
                  {{ errors.desc }}
                </p>
                <p class="ms-auto text-left text-xs text-text-passive">
                  {{ form.desc.length }} / {{ taxReturnDescMaxLength }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="mb-2 flex items-center gap-2">
            <span
              class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
              aria-hidden="true"
            />
            <h2 class="font-yb-bold text-base text-text-tertiary">
              اطلاعات هویتی و تماس
            </h2>
          </div>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <m-text-field
                v-model="form.cellphone"
                label="شماره تماس همراه :"
                required
                placeholder="0912345678"
                :error="Boolean(errors.cellphone)"
              />
              <p v-if="errors.cellphone" class="mt-1 text-xs text-error">
                {{ errors.cellphone }}
              </p>
            </div>
            <div>
              <m-select2
                v-model="form.city"
                label="شهر:"
                required
                :options="cityOptions"
                placeholder="مشهد"
                :error="Boolean(errors.city)"
              />
              <p v-if="errors.city" class="mt-1 text-xs text-error">
                {{ errors.city }}
              </p>
            </div>
          </div>

          <label
            class="mt-5 flex cursor-pointer items-start gap-2 text-xs leading-6 text-text-passive"
          >
            <input
              v-model="form.acceptedTerms"
              type="checkbox"
              class="checkbox checkbox-primary checkbox-sm mt-0.5 rounded"
            />
            <span>
              با تکمیل اطلاعات در های‌حساب،
              <NuxtLink
                to="/tax-return/terms-and-conditions"
                target="_blank"
                class="text-primary-500"
                @click.stop
              >
                شرایط و قوانین
              </NuxtLink>
              را می‌پذیرم
            </span>
          </label>
          <p v-if="errors.acceptedTerms" class="mt-1 text-xs text-error">
            {{ errors.acceptedTerms }}
          </p>
        </div>

        <div
          class="rounded-2xl border border-success-outline bg-success-soft p-4"
        >
          <p class="text-sm text-text-passive">هزینه رزرو وقت مشاور:</p>
          <p class="mt-2 font-yb-bold text-xl text-success-500">
            {{ formattedPrice }}
            <span class="text-sm font-semibold">تومان</span>
          </p>

          <button
            type="submit"
            class="btn btn-success mt-4 h-12 w-full gap-2 rounded-xl font-yb-bold"
            :disabled="submitting"
          >
            <span v-if="submitting">در حال ثبت...</span>
            <template v-else>
              <span>پرداخت و ثبت درخواست</span>
              <Icon name="lucide:chevron-left" size="18" />
            </template>
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { TaxReturnConsultant } from "~/types/tax-return-consultant";
import { resolveAvatarSrc } from "~/libs/utils";
import { formatPayablePrice } from "~/utils/tax-return-payload";
import { paths } from "~/routes";

const emit = defineEmits<{
  "change-consultant": [mode?: "self"];
}>();

const route = useRoute();
const dialogRef = ref<HTMLDialogElement | null>(null);
const submitted = ref(false);
const selectedConsultant = ref<TaxReturnConsultant | null>(null);
const autoAssign = ref(false);

const config = useRuntimeConfig();
const { taxReturnPayablePrice } = useSettings();

const {
  form,
  errors,
  submitting,
  activityOptions,
  turnoverOptions,
  cityOptions,
  taxReturnDescMaxLength,
  prefillFromUser,
  reset,
  submit,
} = useTaxReturnLeadForm();

const formattedPrice = computed(() =>
  formatPayablePrice(taxReturnPayablePrice.value),
);

const consultantAvatarSrc = computed(() =>
  resolveAvatarSrc(
    selectedConsultant.value?.avatar,
    config.public.baseUrl as string,
  ),
);

type TaxReturnRequestModalOptions = {
  consultant?: TaxReturnConsultant | null;
  autoAssign?: boolean;
};

function showModal(
  options?: TaxReturnRequestModalOptions | TaxReturnConsultant | null,
) {
  submitted.value = false;

  const normalized: TaxReturnRequestModalOptions =
    options && typeof options === "object" && "id" in options
      ? { consultant: options }
      : (options as TaxReturnRequestModalOptions | undefined) ?? {};

  autoAssign.value = Boolean(normalized.autoAssign);
  selectedConsultant.value = autoAssign.value
    ? null
    : normalized.consultant ?? null;
  form.consultantId = selectedConsultant.value?.id ?? null;

  if (selectedConsultant.value?.city_name) {
    form.city = selectedConsultant.value.city_name;
  }

  prefillFromUser();
  dialogRef.value?.showModal();
}

function closeModal() {
  dialogRef.value?.close();
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

function onChangeConsultant(mode?: "self") {
  emit("change-consultant", mode);
  closeModal();

  if (mode === "self") {
    const query =
      route.path === paths.taxReturn.consultants
        ? { ...route.query, mode: "self" }
        : { mode: "self" };

    void navigateTo({
      path: paths.taxReturn.consultants,
      query,
    });
    return;
  }

  if (route.path !== paths.taxReturn.consultants) {
    void navigateTo(paths.taxReturn.consultants);
  }
}

async function onSubmit() {
  const result = await submit({ requireTerms: true });
  if (result === "success") {
    selectedConsultant.value = null;
    autoAssign.value = false;
    submitted.value = true;
  }
}

defineExpose({
  showModal,
  closeModal,
  reset,
});
</script>
