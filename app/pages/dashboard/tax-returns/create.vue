<script setup lang="ts">
import { paths } from "~/routes";

definePageMeta({
  layout: "dashboard",
});

await navigateTo(paths.taxReturn.consultants, { replace: true });
</script>
