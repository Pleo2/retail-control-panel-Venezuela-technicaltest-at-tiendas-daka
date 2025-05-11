<script setup lang="ts">
import type { Category } from '@/core/infrastructure/interfaces/app/app.types'

interface Props {
  categories: Category[] | undefined
  isLoadingCategories: boolean
}
defineProps<Props>()

// v-model para los filtros usando defineModel (Vue 3.3+)
const selectedCategory = defineModel<string>('selectedCategory')
const priceRangeMin = defineModel<number | null>('priceRangeMin')
const priceRangeMax = defineModel<number | null>('priceRangeMax')
</script>

<template>
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
</template>
