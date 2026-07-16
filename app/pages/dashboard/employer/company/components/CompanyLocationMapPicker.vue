<template>
  <div>
    <p class="mb-2 text-base">موقعیت روی نقشه:</p>

    <ClientOnly>
      <div
        class="relative h-72 w-full overflow-hidden rounded-lg border border-gray-default"
      >
        <NeshanMap
          v-if="mapKey"
          class="h-full w-full"
          :map-key="mapKey"
          :service-key="serviceKey"
          :center="initialCenter"
          :zoom="initialZoom"
          default-type="neshan"
          :poi="false"
          :traffic="false"
          hide-layers
          hide-search-container
          :reverse-on-click="false"
          @on-init="onInit"
          @on-click="onMapClick"
        />
        <div
          v-else
          class="flex h-full items-center justify-center px-4 text-center text-sm text-text-muted"
        >
          کلید نقشه نشان تنظیم نشده است. (NUXT_PUBLIC_NESHAN_MAP_KEY)
        </div>

        <button
          v-if="mapKey"
          type="button"
          class="absolute bottom-3 right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-default bg-white text-primary-500 shadow-md transition-colors hover:bg-surface-50 disabled:cursor-wait disabled:opacity-70"
          aria-label="موقعیت فعلی من"
          title="موقعیت فعلی من"
          :disabled="locating"
          @click="locateMe()"
        >
          <span
            v-if="locating"
            class="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"
          />
          <Icon v-else name="lucide:locate-fixed" size="20" />
        </button>
      </div>

      <template #fallback>
        <div class="h-72 w-full animate-pulse rounded-lg bg-surface-200" />
      </template>
    </ClientOnly>

    <p class="mt-2 text-sm text-text-passive">
      برای انتخاب موقعیت سازمان، روی نقشه کلیک کنید.
    </p>
  </div>
</template>

<script setup lang="ts">
const NeshanMap = defineAsyncComponent(
  () => import("@neshan-maps-platform/vue3-openlayers"),
);

const props = defineProps<{
  lat: number | null;
  long: number | null;
}>();

const emit = defineEmits<{
  select: [coords: { lat: number; long: number }];
}>();

const config = useRuntimeConfig();
const mapKey = config.public.neshanMapKey as string;
const serviceKey = config.public.neshanServiceKey as string;

// Tehran as the default view when no location is set yet.
const DEFAULT_CENTER = { latitude: 35.6997, longitude: 51.338 };

const hasInitialLocation = props.lat != null && props.long != null;

const initialCenter = hasInitialLocation
  ? { latitude: props.lat as number, longitude: props.long as number }
  : DEFAULT_CENTER;

const initialZoom = hasInitialLocation ? 15 : 11;

const { $toast } = useNuxtApp();

const locating = ref(false);

let mapInstance: any = null;
let toMapCoords: ((coords: [number, number]) => unknown) | null = null;
let markerSource: any = null;
let createMarkerFeature: ((long: number, lat: number) => any) | null = null;

const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
  <path fill="#4864E1" d="M18 1C8.6 1 1 8.6 1 18c0 12.4 15.1 25.6 15.7 26.2a2 2 0 0 0 2.6 0C19.9 43.6 35 30.4 35 18 35 8.6 27.4 1 18 1Z"/>
  <circle cx="18" cy="18" r="6.5" fill="#FFFFFF"/>
</svg>`;

const PIN_ICON_SRC = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  PIN_SVG,
)}`;

async function onInit(map: any) {
  const [
    { default: Feature },
    { default: Point },
    { default: VectorLayer },
    { default: VectorSource },
    { default: Style },
    { default: Icon },
    { fromLonLat },
  ] = await Promise.all([
    import("@neshan-maps-platform/ol/Feature"),
    import("@neshan-maps-platform/ol/geom/Point"),
    import("@neshan-maps-platform/ol/layer/Vector"),
    import("@neshan-maps-platform/ol/source/Vector"),
    import("@neshan-maps-platform/ol/style/Style"),
    import("@neshan-maps-platform/ol/style/Icon"),
    import("@neshan-maps-platform/ol/proj"),
  ]);

  mapInstance = map;
  toMapCoords = (coords: [number, number]) => fromLonLat(coords);
  markerSource = new VectorSource();
  createMarkerFeature = (long: number, lat: number) =>
    new Feature(new Point(fromLonLat([long, lat])));

  const markerLayer = new VectorLayer({
    source: markerSource,
    style: new Style({
      image: new Icon({
        src: PIN_ICON_SRC,
        anchor: [0.5, 1],
        scale: 1,
      }),
    }),
  });
  markerLayer.setZIndex(50);
  map.addLayer(markerLayer);

  // Covers both a saved location and an auto-locate that resolved
  // before the map finished initializing.
  if (props.lat != null && props.long != null) {
    setMarker(props.long, props.lat);
    mapInstance.getView()?.animate({
      center: toMapCoords([props.long, props.lat]),
      zoom: 15,
      duration: 500,
    });
  }
}

function setMarker(long: number, lat: number) {
  if (!markerSource || !createMarkerFeature) return;
  markerSource.clear();
  markerSource.addFeature(createMarkerFeature(long, lat));
}

function onMapClick(payload: { coords?: [number, number] }) {
  const coords = payload?.coords;
  if (!coords) return;

  const [long, lat] = coords;
  setMarker(long, lat);
  emit("select", { lat, long });
}

function locateMe(options: { silent?: boolean } = {}) {
  if (!navigator.geolocation) {
    if (!options.silent) {
      $toast.error("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند");
    }
    return;
  }

  locating.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      locating.value = false;
      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      setMarker(long, lat);
      emit("select", { lat, long });

      if (mapInstance && toMapCoords) {
        mapInstance.getView()?.animate({
          center: toMapCoords([long, lat]),
          zoom: 16,
          duration: 700,
        });
      }
    },
    (error) => {
      locating.value = false;
      // Silent mode (initial auto-locate): keep the default view without nagging.
      if (options.silent) return;
      $toast.error(
        error.code === error.PERMISSION_DENIED
          ? "دسترسی به موقعیت مکانی رد شد. لطفا از تنظیمات مرورگر آن را فعال کنید."
          : "دریافت موقعیت فعلی با خطا مواجه شد",
      );
    },
    { enableHighAccuracy: true, timeout: 10000 },
  );
}

onMounted(() => {
  // Only auto-locate when the company has no saved location yet.
  if (props.lat == null || props.long == null) {
    locateMe({ silent: true });
  }
});
</script>

<style>
@import "@neshan-maps-platform/vue3-openlayers/dist/style.css";
</style>
