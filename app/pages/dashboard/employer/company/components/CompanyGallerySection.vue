<template>
  <section id="section-gallery" class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>گالری تصاویر</Titr>

    <p class="mt-4 text-sm leading-7 text-text-passive">
      از محیط کاری، تیم و دستاوردهای سازمان خود تصویر اضافه کنید تا کارجویان
      شناخت بهتری از سازمان شما داشته باشند.
    </p>

    <div class="mt-4">
      <CompanyImageUpload
        :max-size="2"
        :accept="['jpg', 'jpeg', 'png', 'webp', 'gif']"
        @select="(file) => emit('upload', file)"
      />
    </div>

    <div v-if="form.gallery.length" class="mt-4 flex flex-wrap gap-3">
      <div
        v-for="(image, index) in form.gallery"
        :key="`${image.id ?? image.path ?? image.url}-${index}`"
        class="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-default"
      >
        <img :src="image.url" alt="" class="h-full w-full object-cover" />
        <button
          type="button"
          class="absolute left-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#EF4035] opacity-0 shadow transition-opacity group-hover:opacity-100"
          aria-label="حذف تصویر"
          @click="emit('remove', index)"
        >
          <Icon name="svg:close" size="14" />
        </button>
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
import type { CompanyProfileFormModel } from '~/types/company-profile-form'

defineProps<{
  form: CompanyProfileFormModel
  saving?: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  upload: [file: File]
  remove: [index: number]
}>()
</script>
