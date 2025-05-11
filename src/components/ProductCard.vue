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
    class="bg-white/20 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col hover:opacity-90 group cursor-pointer"
  >
    <div class="bg-white opacity-80 p-4 rounded-lg relative w-full h-48 sm:h-56">
      <img
        :src="product.imageUrl"
        :alt="product.title"
        class="w-full h-full object-contain p-2 group-hover:scale-[105%] transition-all duration-500 ease-out opacity-0 scale-90"
        loading="lazy"
        @load="
          (event) => {
            const target = event.target as HTMLImageElement
            if (target) {
              target.classList.remove('opacity-0', 'scale-90')
              target.classList.add('opacity-100', 'scale-100')
            }
          }
        "
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
      <p
        class="text-sm text-white border w-max px-2 py-1 rounded-lg border-white/50 bg-black/10 mb-2 capitalize"
      >
        {{ product.category }}
      </p>
      <div class="mt-auto flex gap-2">
        <p class="text-base font-light text-dark-blue">
          {{ priceUSDFormatted }}
        </p>
        <p class="text-base text-indigo-100">
          {{ priceVES }}
        </p>
      </div>
    </div>
  </div>
</template>
