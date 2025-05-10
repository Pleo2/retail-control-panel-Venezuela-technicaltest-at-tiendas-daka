<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../core/infrastructure/interfaces/app/app.types.ts' // Tu modelo de app
import { formatVenezuelanCurrency, formatUSDCurrency } from '../lib/currencyFormatter'

interface Props {
  product: Product
  exchangeRate: number | null | undefined
}

const props = defineProps<Props>()

const priceVES = computed(() => {
  if (props.exchangeRate && props.product.priceUSD) {
    const priceInVes = props.product.priceUSD * props.exchangeRate
    return formatVenezuelanCurrency(priceInVes)
  }
  return 'N/A'
})

const priceUSDFormatted = computed(() => {
  return formatUSDCurrency(props.product.priceUSD)
})
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col"
  >
    <div class="relative w-full h-48 sm:h-56">
      <img
        :src="product.imageUrl"
        :alt="product.title"
        class="w-full h-full object-contain p-2"
        loading="lazy"
        @error="
          (event) =>
            ((event.target as HTMLImageElement).src =
              'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png')
        "
      />
    </div>
    <div class="p-4 flex flex-col flex-grow">
      <h3 class="text-lg font-semibold text-gray-800 mb-1 truncate" :title="product.title">
        {{ product.title }}
      </h3>
      <p class="text-sm text-gray-500 mb-2 capitalize">
        {{ product.category }}
      </p>
      <div class="mt-auto">
        <p class="text-base font-bold text-blue-600">
          {{ priceUSDFormatted }}
        </p>
        <p class="text-sm text-gray-700">
          {{ priceVES }}
        </p>
      </div>
    </div>
  </div>
</template>
