<template>
  <dialog
    ref="dialogRef"
    class="modal"
    dir="rtl"
    aria-labelledby="tax-return-request-title"
    @click="onBackdropClick"
  >
    <div
      class="modal-box relative w-full max-w-120 overflow-visible rounded-2xl p-6"
      @click.stop
    >
      <button
        type="button"
        class="absolute left-4 top-4 flex h-8 w-8 items-center justify-center text-text-passive transition-opacity hover:opacity-70"
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

      <form v-else class="space-y-8 pt-4" @submit.prevent="onSubmit">
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
            <m-select2
              v-model="form.activityType"
              label="نوع فعالیت"
              required
              :options="activityOptions"
              placeholder="نوع فعالیت خود را انتخاب کنید"
              :error="Boolean(errors.activityType)"
            />
            <div>
              <m-text-field
                v-model="form.desc"
                multiline
                label="شرح فعالیت:"
                required
                placeholder="شرح فعالیت خود را وارد کنید"
                :error="Boolean(errors.desc)"
              />
              <p class="mt-1 text-left text-xs text-text-passive">
                {{ form.desc.length }} / {{ taxReturnDescMaxLength }}
              </p>
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

          <div class="mt-4">
            <m-text-field
              v-model="form.cellphone"
              label="شماره تماس همراه"
              required
              placeholder="۰۹۱۲۳۴۵۶۷۸"
              :error="Boolean(errors.cellphone)"
            />
          </div>
        </div>

        <div>
          <label
            class="flex cursor-pointer items-center justify-center gap-2 text-xs text-text-passive"
          >
            <input
              v-model="form.acceptedTerms"
              type="checkbox"
              class="checkbox checkbox-primary checkbox-sm rounded"
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
          <p
            v-if="errors.acceptedTerms"
            class="mt-1 text-left text-xs text-error"
          >
            {{ errors.acceptedTerms }}
          </p>

          <button
            type="submit"
            class="btn btn-primary mt-4 h-12 w-full gap-2 rounded-xl font-yb-bold"
            :disabled="submitting"
          >
            <Icon name="lucide:pen-line" size="18" class="text-white" />
            <span v-if="submitting">در حال ثبت...</span>
            <span v-else>ثبت درخواست و دریافت راهنمایی</span>
          </button>
          <p class="mt-3 text-center text-xs leading-6 text-text-passive">
            ثبت درخواست اولیه رایگان است و به‌معنای شروع قطعی یا پرداخت هزینه
            نیست
          </p>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const dialogRef = ref<HTMLDialogElement | null>(null);
const submitted = ref(false);

const {
  form,
  errors,
  submitting,
  activityOptions,
  taxReturnDescMaxLength,
  prefillFromUser,
  submit,
} = useTaxReturnLeadForm();

function showModal() {
  submitted.value = false;
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

async function onSubmit() {
  const result = await submit({ requireTerms: true });
  if (result === "success") submitted.value = true;
}

defineExpose({
  showModal,
  closeModal,
});
</script>
