//این پلاگین دیتای اولیه رو از بک اند میگیرد
//Enums
//Rules
//Boundaries
//Configs
//etc...

import type { InitData } from '~/types';

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  const init = useState<InitData>('init');

  if (init.value) return;

  init.value = await $fetch<InitData>(
    `${config.public.baseUrl}/init`
  );
});