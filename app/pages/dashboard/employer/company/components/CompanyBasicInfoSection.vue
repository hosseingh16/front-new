<template>
  <section id="section-basic" class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>اطلاعات پایه</Titr>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="lg:col-span-2">
        <p class="mb-2 text-base">لوگو سازمان:</p>
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
          :max-size="2"
          :accept="['jpg', 'jpeg', 'png', 'webp', 'gif']"
          @select="(file) => emit('upload-logo', file)"
        />
      </div>

      <div class="lg:col-span-2">
        <m-text-field
          v-model="form.name"
          label="نام شرکت:"
          required
          placeholder="نام شرکت را وارد کنید"
          :error="Boolean(errors.name)"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.name }}
        </p>
      </div>

      <div>
        <m-select2
          v-model="form.activity"
          label="نوع فعالیت:"
          required
          search
          :options="activityOptions"
          placeholder="نوع فعالیت را انتخاب کنید"
          :error="Boolean(errors.activity)"
        />
        <p v-if="errors.activity" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.activity }}
        </p>
      </div>

      <div>
        <m-select2
          v-model="form.size"
          label="تعداد پرسنل:"
          required
          :options="sizeOptions"
          placeholder="تعداد پرسنل را انتخاب کنید"
          :error="Boolean(errors.size)"
        />
        <p v-if="errors.size" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.size }}
        </p>
      </div>

      <div>
        <m-text-field
          v-model="form.website"
          label="وب‌سایت شرکت:"
          placeholder="مثال: www.example.com"
        />
      </div>

      <div>
        <m-text-field
          v-model="form.tel"
          label="شماره تماس:"
          placeholder="شماره تماس شرکت را وارد کنید"
        />
      </div>

      <div class="lg:col-span-2 flex items-center justify-between rounded-lg bg-surface-50 p-3">
        <span class="text-sm text-text-secondary">نمایش شماره تماس در آگهی‌ها</span>
        <input
          v-model="form.is_tell_public"
          type="checkbox"
          class="toggle toggle-primary"
        />
      </div>
    </div>

    <CompanySectionActions
      :saving="saving"
      @save="emit('save')"
      @cancel="emit('cancel')"
    />
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import CompanyImageUpload from './CompanyImageUpload.vue'
import CompanySectionActions from './CompanySectionActions.vue'
import type {
  CompanyProfileFormErrors,
  CompanyProfileFormModel,
} from '~/types/company-profile-form'
import type { ISelectItem } from '~/types/select-item'

defineProps<{
  form: CompanyProfileFormModel
  errors: CompanyProfileFormErrors
  activityOptions: ISelectItem[]
  sizeOptions: ISelectItem[]
  saving?: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  'upload-logo': [file: File]
}>()
</script>
