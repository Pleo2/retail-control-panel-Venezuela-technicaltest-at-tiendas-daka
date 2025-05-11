import { ref, type Ref } from 'vue'
import type {
  Product,
  Category,
  ExchangeRateInfo,
} from '@/core/infrastructure/interfaces/app/app.types'

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, shallowMount, VueWrapper, flushPromises } from '@vue/test-utils'
import App from '@/App.vue'

// Import child components to check their props if using shallowMount or to find them
import DashboardStats from '@/components/Stats.vue'
import ProductFilters from '@/components/ProductFilters.vue'
import ProductList from '@/components/ProductList.vue'
import AppPagination from '@/components/AppPagination.vue'
// Your localStorageMock and other mocks can stay below the Vitest/Test Utils imports
// or above, as long as vi.mock for actual modules is at the very top.

// Mock data - define it once
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Mock P1',
    priceUSD: 10,
    category: 'catA',
    description: '',
    imageUrl: '',
    rating: 0,
  },
  {
    id: 2,
    title: 'Mock P2',
    priceUSD: 100,
    category: 'catB',
    description: '',
    imageUrl: '',
    rating: 0,
  },
  {
    id: 3,
    title: 'Mock P3',
    priceUSD: 50,
    category: 'catA',
    description: '',
    imageUrl: '',
    rating: 0,
  },
]
const MOCK_CATEGORIES: Category[] = ['catA', 'catB']
const MOCK_EXCHANGE_RATE_INFO: ExchangeRateInfo = { rate: 35.0, source: 'BCV', lastUpdate: '' }

// Helper to create reactive refs for mock composable return values
const createMockRef = <T>(value: T): Ref<T> => ref(value) as Ref<T>

// Default mock state (can be overridden in tests)
let mockUseProductsState = {
  products: createMockRef<Product[] | undefined>(MOCK_PRODUCTS),
  isLoading: createMockRef(false),
  isSuccess: createMockRef(true),
  error: createMockRef<Error | null>(null),
}
let mockUseCategoriesState = {
  categories: createMockRef<Category[] | undefined>(MOCK_CATEGORIES),
  isLoading: createMockRef(false),
  isSuccess: createMockRef(true),
  error: createMockRef<Error | null>(null),
}
let mockUseExchangeRateState = {
  exchangeRateInfo: createMockRef<ExchangeRateInfo | undefined>(MOCK_EXCHANGE_RATE_INFO),
  isLoading: createMockRef(false),
  isSuccess: createMockRef(true),
  error: createMockRef<Error | null>(null),
}

// --- Actual vi.mock calls should be at the very top of the file ---
// (Moved them up for clarity in the final structure, but the order below is fine too)
// vi.mock('@/composables/useProducts', () => ({
//   useProducts: () => mockUseProductsState,
// }));
// vi.mock('@/composables/useCategories', () => ({
//   useCategories: () => mockUseCategoriesState,
// }));
// vi.mock('@/composables/useExchangeRate', () => ({
//   useExchangeRate: () => mockUseExchangeRateState,
// }));

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
    removeItem: (key: string) => {
      delete store[key]
    },
  }
})()
// Apply the localStorage mock globally if needed for testing
// Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
// If your Vitest environment (jsdom/happy-dom) already provides localStorage, this global mock might not be strictly necessary
// but having your own mock gives you more control for testing specific scenarios.
// The `localStorage.clear()` in `resetMocks` will use this mock if it's defined on `window`.

// --- MOCKS FOR COMPOSABLES ---
// It's crucial these `vi.mock` calls are hoisted and effectively at the top.
// Putting them here, after some imports, is fine because Vitest handles the hoisting.
vi.mock('@/composables/useProducts', () => ({
  useProducts: () => mockUseProductsState,
}))
vi.mock('@/composables/useCategories', () => ({
  useCategories: () => mockUseCategoriesState,
}))
vi.mock('@/composables/useExchangeRate', () => ({
  useExchangeRate: () => mockUseExchangeRateState,
}))

describe('App.vue (Main Application Component)', () => {
  let wrapper: VueWrapper<any>

  // Function to reset mock states before each test
  const resetMocks = () => {
    mockUseProductsState = {
      products: createMockRef<Product[] | undefined>(MOCK_PRODUCTS),
      isLoading: createMockRef(false),
      isSuccess: createMockRef(true),
      error: createMockRef<Error | null>(null),
    }
    mockUseCategoriesState = {
      categories: createMockRef<Category[] | undefined>(MOCK_CATEGORIES),
      isLoading: createMockRef(false),
      isSuccess: createMockRef(true),
      error: createMockRef<Error | null>(null),
    }
    mockUseExchangeRateState = {
      exchangeRateInfo: createMockRef<ExchangeRateInfo | undefined>(MOCK_EXCHANGE_RATE_INFO),
      isLoading: createMockRef(false),
      isSuccess: createMockRef(true),
      error: createMockRef<Error | null>(null),
    }
    // If using the global localStorage mock:
    localStorageMock.clear()
    // If relying on JSDOM/HappyDOM's localStorage:
    // window.localStorage.clear(); // or just localStorage.clear(); if globals: true
  }

  beforeEach(() => {
    resetMocks()
    // For most App.vue tests, shallowMount is good to isolate App.vue's logic
    wrapper = shallowMount(App, {
      global: {
        // If using stubs with shallowMount and need to check props on specific stubs
        // stubs: { ProductList: true, DashboardStats: true, ... }
        // plugins: [VueQueryPlugin] // If your App.vue directly uses useQuery, you might need this.
        // But since we are mocking the composables that use it, it might not be needed here.
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks() // Clear mock call history etc.
  })

  // Test Suite 1: Loading and Error States
  describe('Loading and Error States', () => {
    it('displays global loading message when any data is loading', async () => {
      resetMocks() // Ensure clean state before modification
      mockUseProductsState.isLoading.value = true
      mockUseProductsState.isSuccess.value = false // if loading, not yet success

      // Re-mount or update props. For mocks that return refs, changing the ref's value
      // should be picked up if the component is watching it or using it in a computed.
      // Re-mounting is safest to ensure component re-evaluates with new composable state.
      wrapper = shallowMount(App)
      await flushPromises()

      expect(wrapper.find('p.animate-bounce').exists()).toBe(true)
      expect(wrapper.find('p.animate-bounce').text()).toBe('Loading Products...')
      expect(wrapper.findComponent(DashboardStats).exists()).toBe(false)
    })

    it('displays global error message when any data fetching fails', async () => {
      resetMocks()
      const testError = new Error('Network Failure')
      mockUseProductsState.error.value = testError
      mockUseProductsState.isSuccess.value = false
      mockUseProductsState.isLoading.value = false // Ensure isLoading is false if there's an error

      wrapper = shallowMount(App)
      await flushPromises()

      const errorDiv = wrapper.find('.text-red-500')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.find('p').text()).toBe('Error loading data. Please try again later.')
      expect(errorDiv.find('pre').text()).toBe(testError.message)
      expect(wrapper.findComponent(DashboardStats).exists()).toBe(false)
    })

    it('displays "Waiting for data" if not loading, no error, but not all data isSuccess', async () => {
      resetMocks()
      mockUseProductsState.isSuccess.value = true
      mockUseCategoriesState.isSuccess.value = false // Categories not yet ready
      mockUseExchangeRateState.isSuccess.value = true
      // isLoading for all is false by default in resetMocks

      wrapper = shallowMount(App)
      await flushPromises()

      // Check that the loading message is NOT present
      expect(wrapper.find('p.animate-bounce').exists()).toBe(false)
      // Check that the error message is NOT present
      expect(wrapper.find('.text-red-500').exists()).toBe(false)

      // Check for the "Waiting for data" message
      // The selector might need to be more specific if there are other `div.text-center > p` elements
      const waitingMessage = wrapper
        .findAll('div.text-center > p')
        .find((p) => p.text() === 'Waiting for data to be ready...')
      expect(waitingMessage?.exists()).toBe(true)
      expect(wrapper.findComponent(DashboardStats).exists()).toBe(false)
    })
  })

  // Test Suite 2: Successful Data Display and Prop Passing
  describe('Successful Data Display and Prop Passing', () => {
    // beforeEach for this specific suite to ensure wrapper is set up for success state
    beforeEach(async () => {
      resetMocks() // Ensure all isSuccess is true, isLoading false, no errors
      wrapper = shallowMount(App)
      await flushPromises()
    })

    it('renders child components when dataIsReady is true', () => {
      expect(wrapper.findComponent(DashboardStats).exists()).toBe(true)
      expect(wrapper.findComponent(ProductFilters).exists()).toBe(true)
      expect(wrapper.findComponent(ProductList).exists()).toBe(true)
      // AppPagination visibility depends on totalPages
      const totalPagesForPaginationCheck = Math.ceil(MOCK_PRODUCTS.length / 5) // Assuming itemsPerPage is 5
      expect(wrapper.findComponent(AppPagination).exists()).toBe(totalPagesForPaginationCheck > 1)
    })

    it('passes correct :products (filtered) to DashboardStats', () => {
      const stats = wrapper.findComponent(DashboardStats)
      expect(stats.props('products')).toEqual(MOCK_PRODUCTS)
    })

    it('passes correct props to ProductFilters', () => {
      const filters = wrapper.findComponent(ProductFilters)
      expect(filters.props('categories')).toEqual(MOCK_CATEGORIES)
      expect(filters.props('isLoadingCategories')).toBe(false)
      expect(filters.props('selectedCategory')).toBe(
        localStorageMock.getItem('preferredCategory') || '',
      )
      expect(filters.props('priceRangeMin')).toBeNull()
      expect(filters.props('priceRangeMax')).toBeNull()
    })

    it('passes correct :products (paginated) and :exchange-rate to ProductList', () => {
      const productList = wrapper.findComponent(ProductList)
      const expectedPaginated = MOCK_PRODUCTS.slice(0, 5)
      expect(productList.props('products')).toEqual(expectedPaginated)
      expect(productList.props('exchangeRate')).toBe(MOCK_EXCHANGE_RATE_INFO.rate)
    })

    it('passes correct props to AppPagination when it should render', () => {
      // To ensure AppPagination renders, we need more products
      const manyMockProducts = Array.from({ length: 12 }, (_, i) => ({
        ...MOCK_PRODUCTS[0],
        id: i + 100,
        category: 'catA',
        priceUSD: 10 * (i + 1),
      }))
      mockUseProductsState.products.value = manyMockProducts // Update the reactive ref

      // Re-mount or force update. Re-mounting is cleaner for this specific state.
      // Or, if the composable that App.vue uses (useClientSideFilteringAndPagination)
      // correctly recalculates based on the changed rawProducts.value, a nextTick might be enough.
      wrapper = shallowMount(App) // Re-mount with the updated mock state for products
      // await wrapper.vm.$nextTick(); // Or this if you don't re-mount

      const pagination = wrapper.findComponent(AppPagination)
      const expectedTotalPages = Math.ceil(manyMockProducts.length / 5)

      expect(pagination.exists()).toBe(true) // It should exist now
      expect(pagination.props('currentPage')).toBe(1)
      expect(pagination.props('totalPages')).toBe(expectedTotalPages)
    })
  })

  // Test Suite 3: Interactions (Example: Filter Change)
  describe('Interactions', () => {
    beforeEach(async () => {
      resetMocks()
      // For interaction tests that involve child component emits or deep rendering, use `mount`
      wrapper = mount(App, {
        // Using full mount
        global: {
          // If children have their own complex dependencies (like i18n, router) they might need stubs or providers
        },
      })
      await flushPromises()
    })

    it('updates ProductList and DashboardStats when category filter changes', async () => {
      const productFiltersComponent = wrapper.findComponent(ProductFilters)
      expect(productFiltersComponent.exists()).toBe(true)

      // Simulate changing the category filter in ProductFilters
      // ProductFilters uses defineModel, so parent updates model, which emits 'update:selectedCategory'
      // We need to trigger the change in a way that updates the v-model in App.vue
      // The most direct way is to emit from the child.
      await productFiltersComponent.vm.$emit('update:selectedCategory', 'catA')
      // Alternative for direct input manipulation if not defineModel:
      // const select = productFiltersComponent.find('#category-filter');
      // await select.setValue('catA');

      await flushPromises() // Allow Vue's reactivity & TanStack Query's composable to process
      // await wrapper.vm.$nextTick(); // Vue's own reactivity cycle

      const productList = wrapper.findComponent(ProductList)
      const dashboardStats = wrapper.findComponent(DashboardStats)

      const expectedFilteredProductsCatA = MOCK_PRODUCTS.filter((p) => p.category === 'catA')

      expect(dashboardStats.props('products')).toEqual(expectedFilteredProductsCatA)
      expect(productList.props('products')).toEqual(expectedFilteredProductsCatA.slice(0, 5))
    })
  })
})
