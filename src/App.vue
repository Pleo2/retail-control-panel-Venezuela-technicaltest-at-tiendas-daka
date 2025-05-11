<script setup lang="ts">
import { computed } from 'vue' // onMounted and watch are no longer necessary here for localStorage

// Server data composables
import { useProducts } from './composables/useProducts'
import { useCategories } from './composables/useCategories'
import { useExchangeRate } from './composables/useExchangeRate'

// Composable for UI logic (client-side filtering and pagination with localStorage)
import { useClientSideFilteringAndPagination } from './composables/useClientSideFilteringAndPagination'

// types (Product is not necessary here if not used directly)
// import type { Product } from './core/infrastructure/interfaces/app/app.types';

// SPC
import ProductFilters from './components/ProductFilters.vue'
import ProductList from './components/ProductList.vue'
import DashboardStats from './components/Stats.vue'
import AppPagination from './components/AppPagination.vue'

// --- 1. Fetching Data from the Server ---
const {
  products: rawProducts, // This is Ref<Product[] | undefined>
  isLoading: isLoadingProducts,
  error: productsError,
  isSuccess: productsSuccess,
} = useProducts()

const {
  categories, // This is Ref<Category[] | undefined>
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

// --- 2. Client-side Filtering and Pagination Logic ---
const {
  selectedCategory,
  priceRangeMin,
  priceRangeMax,
  currentPage,
  // itemsPerPage, // Not needed here if fixed in the composable
  filteredProducts,
  paginatedProducts,
  totalPages,
} = useClientSideFilteringAndPagination({
  rawProducts: rawProducts, // Passing the Ref directly
  itemsPerPage: 5,
  initialCategoryFromStorage: true, // Enables loading/saving of selectedCategory in localStorage
})

// --- 3. Derived Data for the Specific UI of App.vue ---
const dataIsReady = computed(
  () => productsSuccess.value && categoriesSuccess.value && rateSuccess.value,
)
const currentExchangeRate = computed(() => exchangeRateInfo.value?.rate)
</script>

<template>
  <div class="container p-4 h-full mx-auto relative overflow-hidden rounded-lg z-0">
    <!-- Global Loading/Error States -->
    <div v-if="isLoadingProducts || isLoadingCategories || isLoadingRate" class="text-center py-10">
      <p class="text-xl animate-bounce">Loading Products...</p>
    </div>

    <div
      v-else-if="productsError || categoriesError || rateError"
      class="text-center py-10 text-red-500"
    >
      <p>Error loading data. Please try again later.</p>
      <pre v-if="productsError">{{ productsError.message }}</pre>
      <pre v-if="categoriesError">{{ categoriesError.message }}</pre>
      <pre v-if="rateError">{{ rateError.message }}</pre>
    </div>

    <div v-else-if="dataIsReady" class="flex flex-col gap-6">
      <DashboardStats :products="filteredProducts" />

      <ProductFilters
        :categories="categories"
        :is-loading-categories="isLoadingCategories"
        v-model:selectedCategory="selectedCategory"
        v-model:priceRangeMin="priceRangeMin"
        v-model:priceRangeMax="priceRangeMax"
      />

      <Transition name="fade" mode="out-in">
        <!-- The key of ProductList is important for the transition to work well when filters or page change.
             If paginatedProducts is an empty array, ProductList should handle it internally. -->
        <ProductList
          :key="`${currentPage}-${selectedCategory}-${priceRangeMin}-${priceRangeMax}`"
          :products="paginatedProducts"
          :exchange-rate="currentExchangeRate"
        />
      </Transition>

      <AppPagination
        v-if="totalPages > 1"
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
        @update:currentPage="(page: number) => (currentPage = page)"
      />
    </div>
    <div v-else class="text-center py-10">
      <p>Waiting for data to be ready...</p>
      <!-- Consider if this state is reachable or if isLoading* covers all cases -->
    </div>
  </div>
</template>
