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
    class="bg-white/10 grid grid-cols-1 rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-2 z-50"
  >
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      :exchange-rate="exchangeRate"
    />
  </div>
  <div v-else-if="products && products.length === 0" class="text-center py-10">
    <p class="text-xl text-gray-400">No se encontraron productos que coincidan con tus filtros.</p>
    <!-- You could add an image or an icon here -->
  </div>
</template>
