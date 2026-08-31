import type { ISelectItem } from '~/types/select-item'

const inflightByProvince = new Map<number, Promise<void>>()

export function useProvinceCities() {
  const api = useApi()
  const { items, ensure } = useLookups(['provinces'])
  const provinceList = items('provinces')

  const citiesByProvince = useState<Record<number, ISelectItem[]>>(
    'cities-by-province',
    () => ({}),
  )
  const citiesLoading = useState<Record<number, boolean>>(
    'cities-by-province-loading',
    () => ({}),
  )

  async function ensureProvinceCities(provinceId: number) {
    if (citiesByProvince.value[provinceId]) return

    const inflight = inflightByProvince.get(provinceId)
    if (inflight) return inflight

    const request = (async () => {
      citiesLoading.value = { ...citiesLoading.value, [provinceId]: true }
      try {
        const cities = await api.get<ISelectItem[]>(`/cities/${provinceId}`)
        citiesByProvince.value = {
          ...citiesByProvince.value,
          [provinceId]: cities,
        }
      } finally {
        citiesLoading.value = { ...citiesLoading.value, [provinceId]: false }
        inflightByProvince.delete(provinceId)
      }
    })()

    inflightByProvince.set(provinceId, request)
    await request
  }

  async function ensureAllProvinceCities() {
    await ensure()
    await Promise.all(
      provinceList.value.map((province) =>
        ensureProvinceCities(province.value as number),
      ),
    )
  }

  return {
    citiesByProvince,
    citiesLoading,
    ensureProvinceCities,
    ensureAllProvinceCities,
  }
}
