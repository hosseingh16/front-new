export default defineNuxtPlugin(async () => {
  const { ensure } = useSettings()
  await ensure()
})
