import { ogImageSize, resolveOgImage } from "~/utils/og-image";

export default defineNuxtPlugin(() => {
  const route = useRoute();
  const image = computed(() => resolveOgImage(route.path));

  useSeoMeta({
    ogImage: () => image.value.image,
    ogImageAlt: () => image.value.alt,
    ogImageWidth: ogImageSize.width,
    ogImageHeight: ogImageSize.height,
    ogImageType: "image/jpeg",
    twitterCard: "summary_large_image",
    twitterImage: () => image.value.image,
    twitterImageAlt: () => image.value.alt,
  });
});
