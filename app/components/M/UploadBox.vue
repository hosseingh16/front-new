<template>
  <div :class="{ 'pb-12': previewSrc }">
    <input
      type="file"
      class="hidden"
      ref="imageInputRef"
      :accept="accept.map((x) => `.${x}`).join(',')"
      @change="onSelect($event)"
    />
    <div
      v-if="!previewSrc"
      class="upload-dropzone-bg mt-2 flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-default p-6 transition-colors"
      :class="isDragging ? 'border-primary-500 bg-primary-50/40' : ''"
      @click="imageInputRef?.click()"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div
        v-if="!svgIconName"
        class="h-12.5 w-12.5 shrink-0 rounded-full bg-linear-to-b from-[#3D39FF] to-white"
      ></div>
      <div v-else>
        <Icon :name="`svg:${svgIconName}`" size="56" />
      </div>
      <div>
        <div class="flex flex-wrap items-center gap-1">
          <Icon name="svg:upload" />
          <span class="text-sm font-semibold text-primary-500">{{ title }}</span>
          <span
            v-if="subtitle"
            class="max-lg:hidden text-sm text-text-tertiary"
          >
            {{ subtitle }}
          </span>
        </div>
        <p class="mt-1 text-sm text-text-muted">
          حداکثر سایز فایل: {{ maxSize }}MB، پسوند‌های مجاز:
          {{ accept.join(', ') }}
        </p>
      </div>
    </div>
    <div
      v-if="isImage && previewSrc"
      class="mt-6 flex flex-col items-center gap-4"
    >
      <img :src="previewSrc" class="h-32 w-32 rounded-full object-cover" />
      <div class="flex gap-2">
        <button
          class="btn btn-error btn-outline text-sm"
          type="button"
          @click="deleteImage"
        >
          حذف عکس
        </button>
        <button
          class="btn btn-outline text-sm"
          type="button"
          @click="selectNewImage"
        >
          بارگذاری عکس جدید
        </button>
      </div>
    </div>
    <div v-if="model && !isImage" class="mt-3">
      <p>{{ model.name }}</p>
    </div>

    <ClientOnly>
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
          <button class="btn btn-success w-30" type="button" @click="cropEnd">
            تأیید
          </button>
        </div>
      </m-dialog>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { convertImageToBase64 } from '~/libs/utils';
import type Dialog from '~/components/M/Dialog.vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

const model = defineModel({
  default: null as File | null,
});

const cropDialogRef = ref<InstanceType<typeof Dialog> | null>(null);
const cropperRef = ref<any>(null);

const props = withDefaults(
  defineProps<{
    name?: string;
    title?: string;
    subtitle?: string;
    svgIconName?: string;
    maxSize?: number;
    accept?: string[];
    isImage?: boolean;
    showError?: boolean;
    /** Existing remote/local preview when no newly cropped file yet */
    previewUrl?: string | null;
  }>(),
  {
    title: 'برای آپلود تصویر کلیک کنید',
    maxSize: 10,
    accept: () => ['png', 'jpg'],
    isImage: true,
    showError: false,
    previewUrl: null,
  },
);

const emits = defineEmits<{
  (e: 'update:base64', value: string | null): void;
  /** Fired when the user removes the preview; needed when model is already null (server-only avatar). */
  (e: 'delete'): void;
}>();

const imageInputRef = ref<HTMLInputElement | null>(null);
const selectedImageBase64 = ref<string | null>(null);
const cropedImage = ref<string | null>(null);
const isDragging = ref(false);
let dragDepth = 0;

const previewSrc = computed(
  () => cropedImage.value || props.previewUrl || null,
);

watch(
  () => props.previewUrl,
  (url) => {
    if (url && !cropedImage.value) {
      emits('update:base64', url);
    }
  },
  { immediate: true },
);

function normalizeExt(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

function isAcceptedExt(ext: string) {
  const accepted = props.accept.map((x) => x.toLowerCase());
  if (accepted.includes(ext)) return true;
  // Treat jpeg as jpg when only jpg is listed
  if (ext === 'jpeg' && accepted.includes('jpg')) return true;
  if (ext === 'jpg' && accepted.includes('jpeg')) return true;
  return false;
}

function validateFile(file: File): string | null {
  const ext = normalizeExt(file.name);
  if (!isAcceptedExt(ext)) {
    return `فقط فرمت ${props.accept.join(' و ')} مجاز است`;
  }
  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    return `حجم فایل نباید بیشتر از ${props.maxSize}MB باشد`;
  }
  return null;
}

async function processFile(file: File) {
  const error = validateFile(file);
  if (error) {
    if (props.showError) alert(error);
    return;
  }

  if (props.isImage) {
    selectedImageBase64.value = await convertImageToBase64(file);
    cropDialogRef.value?.showModal();
    return;
  }

  model.value = file;
}

async function onSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  target.value = '';
  if (file) await processFile(file);
}

function onDragEnter() {
  dragDepth += 1;
  isDragging.value = true;
}

function onDragOver() {
  isDragging.value = true;
}

function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) isDragging.value = false;
}

async function onDrop(event: DragEvent) {
  dragDepth = 0;
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) await processFile(file);
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

        if (cropedImage.value?.startsWith('blob:')) {
          URL.revokeObjectURL(cropedImage.value);
        }

        model.value = file;
        cropedImage.value = URL.createObjectURL(file);
        emits('update:base64', cropedImage.value);
        cropDialogRef.value?.closeModal();
      },
      'image/jpeg',
      0.9,
    );
}

function deleteImage() {
  if (cropedImage.value?.startsWith('blob:')) {
    URL.revokeObjectURL(cropedImage.value);
  }
  // When only a server preview is shown, model is already null so defineModel
  // won't emit update:modelValue — notify the parent explicitly.
  const hadLocalFile = model.value != null;
  cropedImage.value = null;
  selectedImageBase64.value = null;
  model.value = null;
  emits('update:base64', null);
  if (!hadLocalFile) {
    emits('delete');
  }
}

function selectNewImage() {
  imageInputRef.value?.click();
}

onBeforeUnmount(() => {
  if (cropedImage.value?.startsWith('blob:')) {
    URL.revokeObjectURL(cropedImage.value);
  }
});
</script>
