<script setup lang="ts">
import type { Product } from '../core/infrastructure/interfaces/app/app.types'
import ProductCard from './ProductCard.vue'

interface Props {
  products: Product[] | undefined // Puede ser undefined mientras carga
  exchangeRate: number | null | undefined
}

defineProps<Props>()
</script>

<template>
  <div
    v-if="products && products.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4"
  >
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      :exchange-rate="exchangeRate"
    />
  </div>
  <div v-else-if="products && products.length === 0" class="text-center py-10">
    <p class="text-xl text-gray-600">No se encontraron productos que coincidan con tus filtros.</p>
    <!-- You could add an image or an icon here -->
  </div>
  
</template>
