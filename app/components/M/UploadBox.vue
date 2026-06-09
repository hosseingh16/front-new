<template>
  <div :class="{ 'pb-12': cropedImage }">
    <input
      type="file"
      class="hidden"
      ref="imageInputRef"
      :accept="accept.map((x) => `.${x}`).join(',')"
      @change="onSelect($event)"
    />
    <div
      v-if="!cropedImage"
      class="mt-2 rounded-lg border-2 border-dashed border-gray-default bg-[repeating-linear-gradient(60deg,#FCFCFC_0px,#FCFCFC_35px,white_6px,white_70px)] flex items-center gap-3 p-6 cursor-pointer"
      @click="imageInputRef.click()"
    >
      <div
        v-if="!svgIconName"
        class="shrink-0 w-12.5 h-12.5 bg-linear-to-b from-[#3D39FF] to-white rounded-full"
      ></div>
      <div v-else>
        <Icon :name="`svg:${svgIconName}`" size="56" />
      </div>
      <div>
        <div class="flex items-center gap-1 flex-wrap">
          <Icon name="svg:upload" />
          <span class="font-semibold text-sm text-primary-500">{{ title }}</span>
          <span v-if="subtitle" class="max-lg:hidden text-sm text-text-tertiary">{{
            subtitle
          }}</span>
        </div>
        <p class="mt-1 text-sm text-text-muted">
          حداکثر سایز فایل: {{ maxSize }}MB، پسوند‌های مجاز: {{ accept.join(', ') }}
        </p>
      </div>
    </div>
    <div v-if="isImage && cropedImage" class="mt-6 flex flex-col items-center gap-4">
      <img :src="cropedImage" class="w-32 h-32 rounded-full" />
      <div class="flex gap-2">
        <button
          class="btn btn-error btn-outline text-sm"
          type="button"
          @click="deleteImage"
        >
          حذف عکس
        </button>
        <button class="btn btn-outline text-sm" type="button" @click="selectNewImage">
          بارگذاری عکس جدید
        </button>
      </div>
    </div>
    <div v-if="model && !isImage" class="mt-3">
      <p>{{ model.name }}</p>
    </div>

    <m-dialog ref="cropDialogRef" close-button>
      <VueCropper
        v-if="selectedImageBase64"
        ref="cropperRef"
        :src="selectedImageBase64"
        :aspect-ratio="1"
      />
      <div class="mt-4 flex justify-end gap-1">
        <button
          class="btn btn-outline w-30"
          type="button"
          @click="cropDialogRef?.closeModal()"
        >
          انصراف
        </button>
        <button class="btn btn-success w-30" type="button" @click="cropEnd">تأیید</button>
      </div>
    </m-dialog>
  </div>
</template>

<script setup lang="ts">
import { convertImageToBase64 } from '~/libs/utils';
import type Dialog from '~/components/M/Dialog.vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

// Model
const model = defineModel({
  default: null as File | null,
});

// Variables
const cropDialogRef = ref<InstanceType<typeof Dialog> | null>(null);
const cropperRef = ref<any>(null);

// Props
const props = defineProps({
  name: String,
  title: { type: String, default: 'برای آپلود تصویر کلیک کنید' },
  subtitle: { type: String },
  svgIconName: { type: String },
  maxSize: Number,
  accept: { type: Array as () => string[], default: ['jpg, png'] },
  isImage: { type: Boolean, default: true },
  showError: { type: Boolean, default: false },
});

// Emits
const emits = defineEmits<{
  (e: 'update:base64', value: string | null): void;
}>();

// Variables
const imageInputRef = ref<any>(null);
const selectedImageBase64 = ref<any>(null);
const cropedImage = ref<any>(null);

// Functions
async function onSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    if (file) {
      const ext = file.name.split('.')[file.name.split('.').length - 1];
      if (ext && !props.accept.includes(ext) && props.showError) {
        alert('پسوند غیر مجاز');
      }
      if (ext && props.accept.includes(ext)) {
        if (props.isImage) {
          selectedImageBase64.value = null;
          selectedImageBase64.value = await convertImageToBase64(file!);
          cropDialogRef.value?.showModal();
        } else {
          model.value = file!;
        }
      }
    }
  }
  target.value = '';
}

function cropEnd() {
  const cropper = cropperRef.value?.cropper;
  if (!cropper) return;

  cropper
    .getCroppedCanvas({
      width: 300,
      height: 300,
      imageSmoothingQuality: 'high',
    })
    .toBlob(
      (blob: Blob | null) => {
        if (!blob) return;

        const file = new File([blob], 'cropped-image.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        model.value = file;
        cropedImage.value = URL.createObjectURL(file);

        emits('update:base64', null);
        cropDialogRef.value?.closeModal();
      },
      'image/jpeg',
      0.9,
    );
}

function deleteImage() {
  cropedImage.value = null;
  selectedImageBase64.value = null;
}

function selectNewImage() {
  imageInputRef.value.click();
}
</script>
