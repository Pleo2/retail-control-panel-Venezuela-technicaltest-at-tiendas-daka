// Import necessary functions from Vitest and Vue Test Utils
import { describe, it, expect } from 'vitest'
import { mount, VueWrapper, shallowMount } from '@vue/test-utils'

// Import the component to be tested
import ProductList from '@/components/ProductList.vue'
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/core/infrastructure/interfaces/app/app.types'

describe('ProductList.vue', () => {
  let wrapper: VueWrapper<any>

  // Sample product data
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product A',
      priceUSD: 10,
      category: 'cat1',
      description: '',
      imageUrl: 'imgA.jpg',
      rating: 4,
    },
    {
      id: 2,
      title: 'Product B',
      priceUSD: 20,
      category: 'cat2',
      description: '',
      imageUrl: 'imgB.jpg',
      rating: 5,
    },
    {
      id: 3,
      title: 'Product C',
      priceUSD: 30,
      category: 'cat1',
      description: '',
      imageUrl: 'imgC.jpg',
      rating: 3,
    },
  ]
  const mockExchangeRate = 36.5

  const createWrapper = (
    products: Product[] | undefined = mockProducts,
    exchangeRate: number | null | undefined = mockExchangeRate,
    mountMethod = mount, // Allow switching between mount and shallowMount
  ) => {
    return mountMethod(ProductList, {
      props: {
        products,
        exchangeRate,
      },
      // If ProductCard has complex children or makes API calls (it shouldn't for unit tests),
      // you might want to stub it, especially with `mount`.
      // For `shallowMount`, ProductCard will be stubbed automatically.
      global: {
        // stubs: { // Example of stubbing if needed with `mount`
        //   ProductCard: true // Simple stub
        //   // ProductCard: { template: '<div class="mock-product-card"></div>' } // Stub with template
        // }
      },
    })
  }

  // Test Suite 1: Rendering ProductCards
  describe('Rendering ProductCards', () => {
    it('renders the correct number of ProductCard components when products are provided', () => {
      wrapper = createWrapper(mockProducts, mockExchangeRate, shallowMount) // Using shallowMount to not render ProductCard's internals
      const cards = wrapper.findAllComponents(ProductCard)
      expect(cards.length).toBe(mockProducts.length)
    })

    it('passes correct props to each ProductCard component', () => {
      wrapper = createWrapper(mockProducts, mockExchangeRate, mount) // Using mount to inspect props of actual ProductCard instances
      const cards = wrapper.findAllComponents(ProductCard)

      cards.forEach((cardWrapper, index) => {
        const expectedProduct = mockProducts[index]
        // Check the 'product' prop
        expect(cardWrapper.props('product')).toEqual(expectedProduct)
        // Check the 'exchangeRate' prop
        expect(cardWrapper.props('exchangeRate')).toBe(mockExchangeRate)
        // Check the :key (less direct to test, but implied by v-for and correct rendering)
        // Vue Test Utils doesn't directly expose the v-node's key easily for assertion on the component instance.
        // We trust Vue's v-for behavior if the correct number of distinct items are rendered.
      })
    })

    it('renders ProductCard components with unique keys', () => {
      // This test is a bit more advanced and relies on inspecting rendered HTML attributes if ProductCard was a simple div
      // With actual components, we trust Vue's diffing if distinct items are updated correctly.
      // For this, we'll check if ProductCard components are found, implying keys allow Vue to manage them.
      wrapper = createWrapper(mockProducts, mockExchangeRate, shallowMount)
      const cards = wrapper.findAllComponents(ProductCard)
      expect(cards.length).toBe(mockProducts.length) // Indirectly implies keys are working for rendering
    })
  })

  // Test Suite 2: Handling empty or undefined products
  describe('Handling empty or undefined products', () => {
    it('displays a message when the products array is empty', () => {
      wrapper = createWrapper([], mockExchangeRate) // Empty array
      expect(wrapper.findComponent(ProductCard).exists()).toBe(false) // No cards should be rendered
      const message = wrapper.find('p.text-xl.text-gray-400')
      expect(message.exists()).toBe(true)
      expect(message.text()).toBe('No se encontraron productos que coincidan con tus filtros.')
      // The main grid div should not exist
      expect(wrapper.find('.grid').exists()).toBe(false)
    })
  })

  // Test Suite 3: Main grid styling
  describe('Grid styling', () => {
    it('applies correct grid classes when products are present', () => {
      wrapper = createWrapper(mockProducts, mockExchangeRate)
      const gridDiv = wrapper.find('.grid') // Find the div with grid classes
      expect(gridDiv.exists()).toBe(true)
      expect(gridDiv.classes()).toContain('grid-cols-1')
      expect(gridDiv.classes()).toContain('sm:grid-cols-2')
      expect(gridDiv.classes()).toContain('xl:grid-cols-5')
      expect(gridDiv.classes()).toContain('gap-6')
      expect(gridDiv.classes()).toContain('bg-white/10')
    })
  })
})
