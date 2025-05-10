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
    class="bg-white/20 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col"
  >
    <div class="bg-white opacity-80 rounded-lg relative w-full h-48 sm:h-56">
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
      <h3 class="text-lg font-semibold text-white mb-1 truncate" :title="product.title">
        {{ product.title }}
      </h3>
      <p class="text-sm text-white mb-2 capitalize">
        {{ product.category }}
      </p>
      <div class="mt-auto">
        <p class="text-base font-bold text-indigo-200">
          {{ priceUSDFormatted }}
        </p>
        <p class="text-sm text-indigo-100">
          {{ priceVES }}
        </p>
      </div>
    </div>
  </div>
</template>
