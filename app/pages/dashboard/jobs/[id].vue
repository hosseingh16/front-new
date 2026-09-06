<script setup lang="ts">
import { paths } from "~/routes";

definePageMeta({
  layout: "dashboard",
});

const route = useRoute();
const adId = computed(() => String(route.params.id ?? ""));

await navigateTo(paths.jobs.detail(adId.value), { replace: true });
</script>
