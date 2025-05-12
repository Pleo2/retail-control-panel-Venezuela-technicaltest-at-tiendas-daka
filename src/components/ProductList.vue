<script setup lang="ts">
import type { Product } from '@/core/infrastructure/interfaces/app/app.types'
import ProductCard from '@/components/ProductCard.vue'

interface Props {
  products: Product[] | undefined // Puede ser undefined mientras carga
  exchangeRate: number | null | undefined
}

defineProps<Props>()
</script>

<template>
  <div
    class="bg-white/10 grid grid-cols-1 rounded-lg sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-2 z-50 overflow-hidden"
  >
    <ProductCard
      v-if="products && products.length > 0"
      v-for="product in products"
      :key="product.id"
      :product="product"
      :exchange-rate="exchangeRate"
    />
    <div v-if="products && products.length === 0" class="text-center flex py-10 bg-white/10 rounded-lg sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-5 sm:h-[350px] xl:w-[1230px] 2xl:w-[1486px]">
    <p class="text-2xl text-gray-200 p-4 rounded-lg flex items-center justify-center w-full">No se encontraron productos que coincidan con tus filtros.</p>
  </div>
  </div>

</template>
