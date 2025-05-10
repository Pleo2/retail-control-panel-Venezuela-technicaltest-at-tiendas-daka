<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { useCategories } from '@/composables/useCategories'
import { useExchangeRate } from '@/composables/useExchangeRate'
import ProductList from '@/components/products/ProductList.vue'
import DashboardStats from '@/components/DashboardStats.vue'
import AppPagination from '@/components/ui/AppPagination.vue'
// ... otros imports

const { products: rawProducts, isLoading: isLoadingProducts, error: productsError } = useProducts()
const { categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories()
const { exchangeRateInfo, isLoading: isLoadingRate, error: rateError } = useExchangeRate()

// Estados para filtros y paginación (CLIENT-SIDE)
const selectedCategory = ref<string>('')
const priceRangeMin = ref<number | null>(null)
const priceRangeMax = ref<number | null>(null)
const currentPage = ref<number>(1)
const itemsPerPage = ref<number>(5)

// ... resto de la lógica de filteredProducts, paginatedProducts, etc.
// usando rawProducts.value (que viene de TanStack Query)
</script>

<template>
  <!-- Mostrar estados de carga/error globales aquí -->
  <div v-if="isLoadingProducts || isLoadingCategories || isLoadingRate">
    Cargando datos maestros...
  </div>
  <div v-if="productsError || categoriesError || rateError">
    <p>Error al cargar datos. Intenta de nuevo más tarde.</p>
    <!-- Podrías mostrar errores específicos -->
  </div>

  <div v-if="rawProducts && categories && exchangeRateInfo">
    <div>hello world</div>
    <!-- Filtros UI -->
    <!-- DashboardStats :products="filteredProducts" -->
    <!-- ProductList :products="paginatedProducts" :exchange-rate="exchangeRateInfo.value?.rate" -->
    <!-- AppPagination v-model:currentPage="currentPage" :total-pages="totalPages" -->
  </div>
</template>
