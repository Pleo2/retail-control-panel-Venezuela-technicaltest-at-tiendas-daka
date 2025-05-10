<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProducts } from './composables/useProducts'
import { useCategories } from './composables/useCategories'
import { useExchangeRate } from './composables/useExchangeRate'
// types
import type { Product } from './core/infrastructure/interfaces/app/app.types'
// SPC
import ProductList from './components/ProductList.vue'
import DashboardStats from './components/DashboardStats.vue'
// import AppPagination from './components/ui/AppPagination.vue'

const {
  products: rawProducts,
  isLoading: isLoadingProducts,
  error: productsError,
  isSuccess: productsSuccess,
} = useProducts()
const {
  categories,
  isLoading: isLoadingCategories,
  error: categoriesError,
  isSuccess: categoriesSuccess,
} = useCategories()
const {
  exchangeRateInfo,
  isLoading: isLoadingRate,
  error: rateError,
  isSuccess: rateSuccess,
} = useExchangeRate()

const selectedCategory = ref<string>('')
const priceRangeMin = ref<number | null>(null)
const priceRangeMax = ref<number | null>(null)
const currentPage = ref<number>(1)
const itemsPerPage = ref<number>(5)
// Lógica de Productos Filtrados
const filteredProducts = computed<Product[]>(() => {
  if (!rawProducts.value) return [] // rawProducts es un Ref<Product[] | undefined> de useProducts
  let productsToFilter = [...rawProducts.value]

  if (selectedCategory.value) {
    productsToFilter = productsToFilter.filter((p) => p.category === selectedCategory.value)
  }
  if (priceRangeMin.value !== null && typeof priceRangeMin.value === 'number') {
    productsToFilter = productsToFilter.filter((p) => p.priceUSD >= priceRangeMin.value!)
  }
  if (priceRangeMax.value !== null && typeof priceRangeMax.value === 'number') {
    productsToFilter = productsToFilter.filter((p) => p.priceUSD <= priceRangeMax.value!)
  }
  return productsToFilter
})

// Lógica de Paginación
const totalPages = computed(() => {
  if (!filteredProducts.value) return 1 // Evitar división por cero si filteredProducts es undefined
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1 // || 1 para asegurar al menos una página
})

const paginatedProducts = computed<Product[]>(() => {
  if (!filteredProducts.value) return []
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

// Tasa de cambio actual (ya es un número o undefined, no necesita .value en template)
const currentExchangeRate = computed(() => exchangeRateInfo.value?.rate)

// Watch para resetear currentPage cuando los filtros cambian
watch([selectedCategory, priceRangeMin, priceRangeMax], () => {
  currentPage.value = 1
})

// Para manejar el v-if en el template de forma más limpia
const dataIsReady = computed(
  () => productsSuccess.value && categoriesSuccess.value && rateSuccess.value,
)
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Estados de Carga/Error Globales -->
    <div
      v-if="isLoadingProducts || isLoadingCategories || isLoadingRate"
      class="text-center py-10 bg-black"
    >
      <p class="text-xl animate-pulse">Cargando Productos...</p>
      <!-- Puedes añadir un spinner SVG o un componente de spinner aquí -->
    </div>
    <div
      v-else-if="productsError || categoriesError || rateError"
      class="text-center py-10 text-red-500"
    >
      <p>Error al cargar datos. Por favor, inténtalo de nuevo más tarde.</p>
      <pre v-if="productsError">{{ productsError.message }}</pre>
      <pre v-if="categoriesError">{{ categoriesError.message }}</pre>
      <pre v-if="rateError">{{ rateError.message }}</pre>
    </div>

    <!-- Contenido Principal cuando los datos están listos -->
    <div v-else-if="dataIsReady">
      <!-- Aquí irían los filtros y las estadísticas -->
      <DashboardStats :products="filteredProducts" />
      <ProductList :products="paginatedProducts" :exchange-rate="currentExchangeRate" />

      <AppPagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:currentPage="(page: number) => (currentPage = page)"
      />
    </div>
  </div>
</template>
