<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProducts } from './composables/useProducts'
import { useCategories } from './composables/useCategories'
import { useExchangeRate } from './composables/useExchangeRate'
// types
import type { Product } from './core/infrastructure/interfaces/app/app.types'
// SPC
import ProductList from './components/ProductList.vue'
import DashboardStats from './components/Stats.vue'
import AppPagination from './components/AppPagination.vue'

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

    <div v-else-if="dataIsReady">
      <DashboardStats :products="filteredProducts" />
      <!-- SECCIÓN DE FILTROS -->
      <div class="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 mb-3">Filtros</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <!-- Filtro por Categoría -->
          <div>
            <label for="category-filter" class="block text-sm font-medium text-gray-700 mb-1"
              >Categoría:</label
            >
            <select
              id="category-filter"
              v-model="selectedCategory"
              class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              :disabled="isLoadingCategories"
            >
              <option value="">Todas las categorías</option>
              <option v-if="isLoadingCategories" value="" disabled>Cargando categorías...</option>
              <template v-else-if="categories">
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                  class="capitalize"
                >
                  {{ category }}
                </option>
              </template>
            </select>
          </div>

          <!-- Filtro por Precio Mínimo -->
          <div>
            <label for="price-min-filter" class="block text-sm font-medium text-gray-700 mb-1"
              >Precio Mín. (USD):</label
            >
            <input
              id="price-min-filter"
              type="number"
              v-model.number="priceRangeMin"
              placeholder="Ej: 10"
              min="0"
              class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Filtro por Precio Máximo -->
          <div>
            <label for="price-max-filter" class="block text-sm font-medium text-gray-700 mb-1"
              >Precio Máx. (USD):</label
            >
            <input
              id="price-max-filter"
              type="number"
              v-model.number="priceRangeMax"
              placeholder="Ej: 100"
              min="0"
              class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
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
di
