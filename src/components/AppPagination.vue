<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  // Optional: maximum number of page buttons to display if you want to implement ellipsis logic "..."
  // maxVisibleButtons?: number;
}

const props = withDefaults(defineProps<Props>(), {
  // maxVisibleButtons: 7, // Default value example
})

const emit = defineEmits(['update:currentPage'])

const onPageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}

const pageNumbers = computed((): (number | string)[] => {
  if (props.totalPages <= 1) return []

  const pages: number[] = []
  for (let i = 1; i <= props.totalPages; i++) {
    pages.push(i)
  }
  return pages
})

const isFirstPage = computed(() => props.currentPage === 1)
const isLastPage = computed(() => props.currentPage === props.totalPages)
</script>

<template>
  <nav
    v-if="totalPages > 1"
    aria-label="Paginación"
    class="flex items-center justify-center mt-2 mb-4 z-50"
  >
    <ul class="flex items-center -space-x-px h-10 text-base">
      <li>
        <button
          data-testid="prev-button"
          @click="onPageChange(currentPage - 1)"
          :disabled="isFirstPage"
          class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-dark-blue bg-white border border-white rounded-s-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          :class="{ 'cursor-not-allowed opacity-10': isFirstPage }"
        >
          <span class="sr-only">Anterior</span>
          <svg
            class="w-3 h-3 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </button>
      </li>

      <!-- number pages -->
      <li v-for="page in pageNumbers" :key="page">
        <button
          v-if="typeof page === 'number'"
          @click="onPageChange(page)"
          :class="[
            'flex items-center justify-center px-4 h-10 leading-tight hover:bg-white/20 hover:text-gray-700 transition-colors duration-300 cursor-pointer',
            currentPage === page
              ? 'text-dark-blue bg-white/80 hover:bg-blue-100 hover:text-indigo-200 z-10'
              : 'text-gray-500 bg-white',
          ]"
        >
          {{ page }}
        </button>
        <span
          v-else
          class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300"
        >
          {{ page }}
        </span>
      </li>

      <!-- next button -->
      <li>
        <button
          @click="onPageChange(currentPage + 1)"
          data-testid="next-button"
          :disabled="isLastPage"
          class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-dark-blue bg-white border border-white rounded-e-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          :class="{ 'cursor-not-allowed opacity-50': isLastPage }"
        >
          <span class="sr-only">Siguiente</span>
          <svg
            class="w-3 h-3 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>
