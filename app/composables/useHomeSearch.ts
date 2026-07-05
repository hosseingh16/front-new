import type { ApiResponse } from '~/types/api'
import {
  HOME_SEARCH_GROUPS,
  type HomeSearchItem,
  type HomeSearchTab,
} from '~/types/home-search'
import type { CompanyList } from '~/types/company'
import type { Opportunity } from '~/types/opportunity'
import type { AdList } from '~/types/ad'
import type { ProjectList } from '~/types/project'

const SEARCH_RESULT_LIMIT = 5

type SearchOpportunity = Opportunity | Record<string, unknown>

function mapOpportunityToSearchItem(opportunity: SearchOpportunity): HomeSearchItem | null {
  if (opportunity.type === 'ad') {
    const item = opportunity.item as AdList
    return {
      id: item.id,
      tab: 'jobs',
      title: `استخدام ${item.title}`,
      detailLabel: 'نام شرکت',
      detailValue: item.company_name,
      url: `/ad/${item.id}`,
      image: item.company_logo,
    }
  }

  if (opportunity.type === 'project') {
    const item = opportunity.item as ProjectList
    return {
      id: item.id,
      tab: 'jobs',
      title: `پروژه ${item.type}`,
      detailLabel: 'نام شرکت',
      detailValue: item.company_name,
      url: `/project/${item.id}`,
      image: item.company_logo,
    }
  }

  // if (opportunity.type === 'resume') {
  //   const item = opportunity.item as {
  //     id: number
  //     name?: string
  //     full_name?: string
  //     job_title?: string
  //     avatar?: string | null
  //   }
  //   const name = item.name ?? item.full_name ?? ''
  //   return {
  //     id: item.id,
  //     tab: 'seekers',
  //     title: name,
  //     detailLabel: 'عنوان شغلی',
  //     detailValue: item.job_title ?? '',
  //     url: `/resume/${item.id}`,
  //     image: item.avatar,
  //   }
  // }

  // if (opportunity.type === 'consultant') {
  //   const item = opportunity.item as {
  //     id: number
  //     name?: string
  //     full_name?: string
  //     specialty?: string
  //     avatar?: string | null
  //   }
  //   const name = item.name ?? item.full_name ?? ''
  //   return {
  //     id: item.id,
  //     tab: 'consultants',
  //     title: name,
  //     detailLabel: 'تخصص مشاور',
  //     detailValue: item.specialty ?? '',
  //     url: `#`,
  //     image: item.avatar,
  //   }
  // }

  return null
}

function mapCompanyToSearchItem(company: CompanyList): HomeSearchItem | null {
  const name = company.name?.trim()
  if (!name) return null

  const location = [company.province_name, company.city_name].filter(Boolean).join('، ')

  return {
    id: company.slug ?? name,
    tab: 'organizations',
    title: name,
    detailLabel: company.activity ? 'نوع فعالیت' : 'موقعیت',
    detailValue: company.activity ?? location,
    url: company.slug ? `/companies/${company.slug}` : '/companies',
    image: company.logo,
  }
}

function viewAllPath(tab: Exclude<HomeSearchTab, 'all'>, keyword: string): string {
  const query = encodeURIComponent(keyword)

  if (tab === 'jobs') return `/jobs?search=${query}`
  if (tab === 'organizations') return `/companies?search=${query}`
  return '#'
}

export function useHomeSearch() {
  const api = useApi()
  const router = useRouter()

  const keyword = ref('')
  const debouncedKeyword = ref('')
  const activeTab = ref<HomeSearchTab>('all')
  const isOpen = ref(false)
  const loading = ref(false)
  const items = ref<HomeSearchItem[]>([])
  const highlightedIndex = ref(-1)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let requestId = 0

  const hasKeyword = computed(() => keyword.value.trim().length > 0)
  const showDropdown = computed(() => isOpen.value && hasKeyword.value)

  const visibleItems = computed(() => {
    if (activeTab.value === 'all') return items.value
    return items.value.filter((item) => item.tab === activeTab.value)
  })

  const groupedItems = computed(() =>
    HOME_SEARCH_GROUPS.map((group) => ({
      ...group,
      items: items.value.filter((item) => item.tab === group.tab),
      viewAllUrl: viewAllPath(group.tab, debouncedKeyword.value),
    })),
  )

  const flatSelectableItems = computed(() => {
    if (activeTab.value === 'all') {
      return groupedItems.value.flatMap((group) => group.items)
    }
    return visibleItems.value
  })

  async function fetchResults(search: string) {
    const currentRequest = ++requestId
    loading.value = true

    try {
      const [opportunitiesResult, companiesResult] = await Promise.all([
        api.get<ApiResponse<SearchOpportunity[]>>('/opportunities', {
          query: {
            search,
            count: SEARCH_RESULT_LIMIT,
          },
        }),
        api.get<ApiResponse<CompanyList[]>>('/companies', {
          query: {
            search,
            page: 1,
          },
        }),
      ])

      if (currentRequest !== requestId) return

      const jobItems = (opportunitiesResult.data ?? [])
        .map(mapOpportunityToSearchItem)
        .filter((item): item is HomeSearchItem => item !== null)
        .slice(0, SEARCH_RESULT_LIMIT)

      const organizationItems = (companiesResult.data ?? [])
        .map(mapCompanyToSearchItem)
        .filter((item): item is HomeSearchItem => item !== null)
        .slice(0, SEARCH_RESULT_LIMIT)

      items.value = [...jobItems, ...organizationItems]
      highlightedIndex.value = items.value.length ? 0 : -1
    } catch {
      if (currentRequest !== requestId) return
      items.value = []
      highlightedIndex.value = -1
    } finally {
      if (currentRequest === requestId) {
        loading.value = false
      }
    }
  }

  function openDropdown() {
    if (hasKeyword.value) isOpen.value = true
  }

  function closeDropdown() {
    isOpen.value = false
    highlightedIndex.value = -1
  }

  function clearKeyword() {
    keyword.value = ''
    debouncedKeyword.value = ''
    items.value = []
    highlightedIndex.value = -1
    closeDropdown()
  }

  function selectItem(item: HomeSearchItem) {
    closeDropdown()
    router.push(item.url)
  }

  function submitSearch() {
    const search = keyword.value.trim()
    if (!search) return

    closeDropdown()
    router.push(`/jobs?search=${encodeURIComponent(search)}`)
  }

  function moveHighlight(direction: 1 | -1) {
    const list = flatSelectableItems.value
    if (!list.length) {
      highlightedIndex.value = -1
      return
    }

    if (highlightedIndex.value === -1) {
      highlightedIndex.value = direction === 1 ? 0 : list.length - 1
      return
    }

    highlightedIndex.value =
      (highlightedIndex.value + direction + list.length) % list.length
  }

  function selectHighlighted() {
    const item = flatSelectableItems.value[highlightedIndex.value]
    if (item) selectItem(item)
  }

  function onKeydown(event: KeyboardEvent) {
    if (!showDropdown.value) {
      if (event.key === 'Enter') submitSearch()
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveHighlight(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveHighlight(-1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      selectHighlighted()
    } else if (event.key === 'Escape') {
      closeDropdown()
    }
  }

  watch(keyword, (value) => {
    if (debounceTimer) clearTimeout(debounceTimer)

    const trimmed = value.trim()
    if (!trimmed) {
      debouncedKeyword.value = ''
      items.value = []
      highlightedIndex.value = -1
      return
    }

    isOpen.value = true
    debounceTimer = setTimeout(() => {
      debouncedKeyword.value = trimmed
    }, 300)
  })

  watch(debouncedKeyword, (value) => {
    if (!value) {
      items.value = []
      return
    }
    fetchResults(value)
  })

  watch(activeTab, () => {
    highlightedIndex.value = flatSelectableItems.value.length ? 0 : -1
  })

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    keyword,
    debouncedKeyword,
    activeTab,
    isOpen,
    loading,
    items,
    visibleItems,
    groupedItems,
    flatSelectableItems,
    highlightedIndex,
    hasKeyword,
    showDropdown,
    openDropdown,
    closeDropdown,
    clearKeyword,
    selectItem,
    submitSearch,
    onKeydown,
    viewAllPath,
  }
}
