<template>
  <dialog
    ref="dialogRef"
    class="modal"
    @cancel.prevent
    @click="onBackdropClick"
  >
    <div
      class="modal-box w-full max-w-[min(100vw-1rem,850px)] rounded-2xl bg-white p-6"
      @click.stop
    >
      <Titr with-icon>اطلاعات پایه</Titr>

      <div
        v-if="showAlert"
        class="mt-4 flex items-start gap-2.5 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3"
      >
        <Icon
          name="lucide:triangle-alert"
          size="18"
          class="mt-0.5 shrink-0 text-warning-500"
        />
        <p class="flex-1 text-sm leading-7 text-text-secondary">
          برای نمایش بهتر آگهی و جذب بیشتر حسابدار، تکمیل اطلاعات پایه
          سازمان را وارد کنید
        </p>
        <button
          type="button"
          class="shrink-0 text-text-passive transition-colors hover:text-text-secondary"
          aria-label="بستن"
          @click="showAlert = false"
        >
          <Icon name="material-symbols:close" size="18" />
        </button>
      </div>

      <div
        v-if="loading"
        class="mt-6 h-72 animate-pulse rounded-2xl bg-surface-200"
      />

      <form v-else class="mt-6 space-y-5" @submit.prevent="submit">
        <div>
          <p class="mb-2 text-base text-text-secondary">
            لوگو:
            <span class="text-danger-500">*</span>
          </p>

          <div v-if="form.logo?.url" class="mb-3 flex items-center gap-4">
            <img
              :src="form.logo.url"
              alt=""
              class="h-20 w-20 rounded-2xl border border-gray-default object-cover"
            />
            <button
              type="button"
              class="btn btn-error btn-outline h-9 text-sm"
              @click="form.logo = null"
            >
              حذف لوگو
            </button>
          </div>

          <CompanyImageUpload
            v-else
            :max-size="10"
            :accept="['jpg', 'jpeg', 'png']"
            @select="onUploadLogo"
          />

          <p v-if="localErrors.logo" class="mt-1 text-xs text-danger-500">
            {{ localErrors.logo }}
          </p>
        </div>

        <div>
          <m-text-field
            v-model="form.name"
            label="نام شرکت:"
            required
            placeholder="نام شرکت را وارد کنید"
            :error="Boolean(localErrors.name)"
          />
          <p v-if="localErrors.name" class="mt-1 text-xs text-danger-500">
            {{ localErrors.name }}
          </p>
        </div>

        <m-select2
          v-model="form.activity"
          label="نوع فعالیت:"
          search
          :options="activityOptions"
          placeholder="نوع فعالیت سازمان را انتخاب کنید"
        />

        <m-text-field
          v-model="form.tel"
          label="شماره تماس شرکت:"
          placeholder="شماره تماس شرکت را وارد کنید"
        />

        <label
          class="flex cursor-pointer items-center justify-end gap-2 text-sm text-text-secondary"
        >
          <span>نمایش شماره تماس در آگهی‌ها</span>
          <input
            v-model="form.is_tell_public"
            type="checkbox"
            class="checkbox checkbox-primary checkbox-sm rounded"
          />
        </label>

        <button
          type="submit"
          class="btn btn-primary mt-2 h-11 w-full rounded-xl text-sm font-yb-bold disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="saving || uploading"
        >
          <Icon name="svg:user-plus-white" size="20" />
          <span v-if="saving">در حال ذخیره...</span>
          <span v-else>تایید اطلاعات سازمان</span>
        </button>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import CompanyImageUpload from './CompanyImageUpload.vue'
import type { ApiResponse } from '~/types/api'
import type { Company } from '~/types/company'
import { toMediaPayload } from '~/types/company-profile-form'
import {
  needsCompanyBasicInfoModal,
  validateCompanyBasicInfoModal,
} from '~/utils/company-basic-info'

const emit = defineEmits<{
  completed: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const showAlert = ref(true)
const saving = ref(false)
const localErrors = ref<{ name?: string; logo?: string }>({})

const { $toast } = useNuxtApp()
const api = useApi()
const { refreshUser } = useCurrentUser()

const {
  form,
  loading,
  uploading,
  activityOptions,
  uploadImage,
  reload,
} = useCompanyProfileForm()

async function onUploadLogo(file: File) {
  localErrors.value.logo = undefined
  await uploadImage('logo', file)
}

async function submit() {
  localErrors.value = validateCompanyBasicInfoModal(form.value)

  if (Object.keys(localErrors.value).length) {
    $toast.error('لطفا فیلدهای الزامی را تکمیل کنید')
    return
  }

  saving.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      activity: form.value.activity || null,
      tel: form.value.tel.trim() || null,
      is_tell_public: form.value.is_tell_public,
      logo: toMediaPayload(form.value.logo),
    }

    if (form.value.id) {
      await api.put<ApiResponse<Company>>(
        `/companies/${form.value.id}`,
        payload,
      )
    } else {
      await api.post<ApiResponse<Company>>('/companies', payload)
    }

    await reload()
    await refreshUser()
    $toast.success('اطلاعات سازمان با موفقیت ثبت شد')
    dialogRef.value?.close()
    emit('completed')
  } catch (err: unknown) {
    const message =
      err && typeof err === 'object' && 'message' in err
        ? String((err as { message?: string }).message)
        : 'ثبت اطلاعات سازمان با خطا مواجه شد'
    $toast.error(message)
  } finally {
    saving.value = false
  }
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    event.preventDefault()
  }
}

async function checkAndOpen(): Promise<boolean> {
  if (loading.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        loading,
        (value) => {
          if (!value) {
            stop()
            resolve()
          }
        },
        { immediate: true },
      )
    })
  }

  if (!needsCompanyBasicInfoModal(form.value)) return false

  showAlert.value = true
  localErrors.value = {}
  await nextTick()
  dialogRef.value?.showModal()
  return true
}

defineExpose({
  checkAndOpen,
})
</script>
