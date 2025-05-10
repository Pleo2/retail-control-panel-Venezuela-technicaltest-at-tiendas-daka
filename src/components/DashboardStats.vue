<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../core/infrastructure/interfaces//app//app.types.ts'
import { formatUSDCurrency } from '../lib/currencyFormatter'

interface Props {
  products: Product[] | undefined // Productos filtrados
}

const props = defineProps<Props>()

const totalProducts = computed(() => {
  return props.products?.length || 0
})

const uniqueCategoriesCount = computed(() => {
  if (!props.products || props.products.length === 0) {
    return 0
  }
  const categories = new Set(props.products.map((p) => p.category))
  return categories.size
})

const averagePriceUSD = computed(() => {
  if (!props.products || props.products.length === 0) {
    return 0
  }
  const totalSum = props.products.reduce((sum, p) => sum + p.priceUSD, 0)
  return totalSum / props.products.length
})

const averagePriceUSDFormatted = computed(() => {
  return formatUSDCurrency(averagePriceUSD.value)
})

const stats = computed(() => [
  { label: 'Total de Productos', value: totalProducts.value },
  { label: 'Categorías Únicas', value: uniqueCategoriesCount.value },
  { label: 'Precio Promedio (USD)', value: averagePriceUSDFormatted.value },
])
</script>

<template>
  <div class="bg-gray-50 p-4 rounded-lg shadow mb-6">
    <h2 class="text-xl font-semibold text-gray-700 mb-3">Estadísticas del Tablero</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white p-4 rounded-lg shadow-md text-center md:text-left"
      >
        <h3 class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
          {{ stat.label }}
        </h3>
        <p class="mt-1 text-xl sm:text-2xl font-semibold text-indigo-600">{{ stat.value }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
