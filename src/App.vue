<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
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

const dataIsReady = computed(
  () => productsSuccess.value && categoriesSuccess.value && rateSuccess.value,
)

const selectedCategory = ref<string>(localStorage.getItem('preferredCategory') || '')
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

watch(selectedCategory, (newVal) => {
  localStorage.setItem('preferredCategory', newVal)
})

onMounted(() => {
  const savedCategory = localStorage.getItem('preferredCategory')
  if (savedCategory) {
    selectedCategory.value = savedCategory
  }
})
</script>

<template>
  <div class="container p-4 h-full mx-auto relative overflow-hidden rounded-lg z-0">
    <!-- Estados de Carga/Error Globales -->
    <div v-if="isLoadingProducts || isLoadingCategories || isLoadingRate" class="text-center py-10">
      <p class="text-xl animate-bounce">Cargando Productos...</p>
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

    <div
      v-else-if="dataIsReady"
      class="flex flex-col gap-6"
    >
      <DashboardStats :products="filteredProducts" />
      <!-- Filter Section -->
      <section
        class="flex flex-col gap-2 bg-white/10 border-1 border-white/10 p-2 rounded-lg shadow-md z-50"
      >
        <h2 class="text-lg font-medium text-gray-200">Filtrar Productos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-white/10 p-4 rounded-lg">
          <!-- Categories -->
          <div class="flex flex-col gap-1">
            <label for="category-filter" class="block text-sm font-light text-gray-200"
              >Categoría:</label
            >
            <select
              id="category-filter"
              v-model="selectedCategory"
              class="appearance-none caret-indigo-200 w-full p-2 border border-gray-300 shadow-sm focus:bg-white/5 focus:outline-indigo-200 focus:outline-1 rounded-sm font-thin cursor-pointer"
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

          <!-- min-price -->
          <div class="flex flex-col gap-1">
            <label for="price-min-filter" class="block text-sm font-light text-gray-200"
              >Precio Mín. (USD):</label
            >
            <input
              id="price-min-filter"
              type="number"
              v-model.number="priceRangeMin"
              placeholder="Ej: 10"
              min="0"
              class="appearance-none caret-indigo-200 w-full p-2 border border-gray-300 shadow-sm focus:bg-white/5 focus:outline-indigo-200 focus:outline-1 rounded-sm font-thin cursor-pointer"
            />
          </div>

          <!-- max price -->
          <div class="flex flex-col gap-1">
            <label for="price-max-filter" class="block text-sm font-light text-gray-200"
              >Precio Máx. (USD):</label
            >
            <input
              id="price-max-filter"
              type="number"
              v-model.number="priceRangeMax"
              placeholder="Ej: 100"
              min="0"
              class="appearance-none caret-indigo-200 w-full p-2 border border-gray-300 shadow-sm focus:bg-white/5 focus:outline-indigo-200 focus:outline-1 rounded-sm font-thin cursor-pointer"
            />
          </div>
        </div>
      </section>

      <Transition name="fade" mode="out-in">
        <ProductList
          :key="currentPage + selectedCategory + priceRangeMin + priceRangeMax"
          :products="paginatedProducts"
          :exchange-rate="currentExchangeRate"
        />
      </Transition>

      <AppPagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:currentPage="(page: number) => (currentPage = page)"
      />
    </div>
  </div>
</template>
