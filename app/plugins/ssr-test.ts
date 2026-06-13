export default defineNuxtPlugin(async () => {
  console.log('PLUGIN START')

  try {
    const r = await fetch('https://api.hihesab.test/api/user')
    console.log('RAW FETCH OK', await r.text())
  } catch (e) {
    console.log('RAW FETCH FAIL', e)
  }
})