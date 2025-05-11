import { ref, computed, watch, onMounted, type Ref } from 'vue'
import type { Product } from '@/core/infrastructure/interfaces/app/app.types' // Asegúrate que la ruta sea correcta

interface UseClientFilteringAndPaginationOptions {
  rawProducts: Ref<Product[] | undefined>
  itemsPerPage?: number
  initialCategoryFromStorage?: boolean // Para controlar si se carga de localStorage
}

export function useClientSideFilteringAndPagination(
  options: UseClientFilteringAndPaginationOptions,
) {
  const { rawProducts, initialCategoryFromStorage = true } = options // default a true
  const itemsPerPage = ref(options.itemsPerPage || 5)

  // Estados para filtros
  const selectedCategory = ref<string>('') // Se inicializará desde localStorage si initialCategoryFromStorage es true
  const priceRangeMin = ref<number | null>(null)
  const priceRangeMax = ref<number | null>(null)

  // Estado para paginación
  const currentPage = ref<number>(1)

  // Lógica de LocalStorage para selectedCategory
  if (initialCategoryFromStorage) {
    onMounted(() => {
      const savedCategory = localStorage.getItem('preferredCategory')
      if (savedCategory) {
        selectedCategory.value = savedCategory
      }
    })

    watch(selectedCategory, (newVal) => {
      localStorage.setItem('preferredCategory', newVal)
    })
  }

  const filteredProducts = computed<Product[]>(() => {
    if (!rawProducts.value) return []
    let productsToFilter = [...rawProducts.value]

    if (selectedCategory.value) {
      productsToFilter = productsToFilter.filter((p) => p.category === selectedCategory.value)
    }
    if (
      priceRangeMin.value !== null &&
      typeof priceRangeMin.value === 'number' &&
      priceRangeMin.value >= 0
    ) {
      productsToFilter = productsToFilter.filter((p) => p.priceUSD >= priceRangeMin.value!)
    }
    if (
      priceRangeMax.value !== null &&
      typeof priceRangeMax.value === 'number' &&
      priceRangeMax.value >= 0
    ) {
      productsToFilter = productsToFilter.filter((p) => p.priceUSD <= priceRangeMax.value!)
    }
    return productsToFilter
  })

  const totalPages = computed(() => {
    if (!filteredProducts.value || filteredProducts.value.length === 0) return 1
    return Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1
  })

  const paginatedProducts = computed<Product[]>(() => {
    if (!filteredProducts.value) return []
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredProducts.value.slice(start, end)
  })

  // Watch para resetear currentPage cuando los filtros cambian
  watch(
    [selectedCategory, priceRangeMin, priceRangeMax],
    () => {
      if (currentPage.value !== 1) {
        currentPage.value = 1
      }
    },
    { deep: false },
  ) // No necesitamos deep watch aquí

  // Watch para asegurar que currentPage no exceda totalPages
  watch(totalPages, (newTotalPages, oldTotalPages) => {
    if (currentPage.value > newTotalPages && newTotalPages > 0) {
      currentPage.value = newTotalPages
    } else if (newTotalPages === 0 && oldTotalPages > 0) {
      // Si no hay páginas, ir a 1
      currentPage.value = 1
    }
  })

  return {
    selectedCategory,
    priceRangeMin,
    priceRangeMax,
    currentPage,
    itemsPerPage,
    filteredProducts,
    paginatedProducts,
    totalPages,
  }
}
