<template>
  <div>
    <input type="file" class="hidden" ref="imageInputRef" @change="onSelect($event)" />
    <div
      v-if="!imageBase64"
      class="mt-2 rounded-lg border-2 border-dashed border-gray-default bg-[repeating-linear-gradient(60deg,#FCFCFC_0px,#FCFCFC_35px,white_6px,white_70px)] flex items-center gap-3 p-6 cursor-pointer"
      @click="imageInputRef.click()"
    >
      <div
        v-if="!svgIconName"
        class="w-12.5 h-12.5 bg-linear-to-b from-[#3D39FF] to-white rounded-full"
      ></div>
      <div v-else>
        <Icon :name="`svg:${svgIconName}`" size="56" />
      </div>
      <div>
        <div class="flex items-center gap-1 flex-wrap">
          <Icon name="svg:upload" />
          <span class="font-semibold text-sm text-primary-500">{{ title }}</span>
          <span v-if="subtitle" class="text-sm text-text-tertiary">{{ subtitle }}</span>
        </div>
        <p class="mt-1 text-sm text-text-muted">
          حداکثر سایز فایل: {{ maxSize }}MB، پسوند‌های مجاز: {{ accept.join(', ') }}
        </p>
      </div>
    </div>
    <div
      v-if="isImage && imageBase64"
      class="mt-6 flex justify-center"
      @click="imageInputRef.click()"
    >
      <img :src="imageBase64" class="w-24 h-24 rounded-full" />
    </div>
    <div class="mt-3" v-if="model && !isImage">
      <p>{{ model.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { convertImageToBase64 } from '~/libs/utils';

// Model
const model = defineModel({
  default: null as File | null,
});

// Props
const props = defineProps({
  title: { type: String, default: 'برای آپلود تصویر کلیک کنید' },
  subtitle: { type: String },
  svgIconName: { type: String },
  maxSize: Number,
  accept: { type: Array, default: ['jpg, png'] },
  isImage: { type: Boolean, default: true },
});

// Variables
const imageInputRef = ref<any>(null);
const imageBase64 = ref<any>(null);

// Functions
async function onSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    if (file) {
      const ext = file.name.split('.')[file.name.split('.').length - 1];
      if (!props.accept.includes(ext)) {
        alert('پسوند غیر مجاز');
      } else {
        model.value = file!;
        if (props.isImage) imageBase64.value = await convertImageToBase64(file!);
      }
    }
  }
}
</script>
