import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductList from '../ProductList.vue'
import ProductCard from '../ProductCard.vue' // Import ProductCard as it's a child component

const mockProducts = [
  {
    id: 1,
    title: 'Product 1',
    priceUSD: 10,
    category: 'electronics',
    imageUrl: 'image1.jpg',
    description: 'Desc 1',
    rating: 4,
  },
  {
    id: 2,
    title: 'Product 2',
    priceUSD: 20,
    category: 'books',
    imageUrl: 'image2.jpg',
    description: 'Desc 2',
    rating: 4.5,
  },
]

describe('ProductList.vue', () => {
  it('renders a list of ProductCard components when products are provided', () => {
    const wrapper = mount(ProductList, {
      props: {
        products: mockProducts,
        exchangeRate: 36.5,
      },
      global: {
        stubs: {
          ProductCard: true, // Stub ProductCard to avoid testing its internals here
        },
      },
    })
    const productCards = wrapper.findAllComponents(ProductCard)
    expect(productCards.length).toBe(mockProducts.length)
    productCards.forEach((cardWrapper, index) => {
      expect(cardWrapper.props('product')).toEqual(mockProducts[index])
      expect(cardWrapper.props('exchangeRate')).toBe(36.5)
    })
  })

  it('displays a message when no products are found (empty array)', () => {
    const wrapper = mount(ProductList, {
      props: {
        products: [],
        exchangeRate: 36.5,
      },
    })
    expect(wrapper.findComponent(ProductCard).exists()).toBe(false)
    expect(wrapper.text()).toContain('No se encontraron productos que coincidan con tus filtros.')
  })

  it('displays a message when products prop is undefined (initial loading state)', () => {
    const wrapper = mount(ProductList, {
      props: {
        products: undefined,
        exchangeRate: 36.5,
      },
    })
    // Depending on how you handle undefined (e.g., v-if might mean nothing is rendered or a specific loading message)
    // If it renders nothing, then ProductCard should not exist and the 'no products' message also shouldn't.
    expect(wrapper.findComponent(ProductCard).exists()).toBe(false)
    // If you have a specific loading state message, test for that.
    // For this component, if products is undefined, it seems to render nothing from the template's v-if/v-else-if structure.
    // So, the 'no products' message shouldn't be there either.
    expect(wrapper.text()).not.toContain(
      'No se encontraron productos que coincidan con tus filtros.',
    )
    // Check if the main div is not rendered or is empty
    expect(wrapper.find('.grid').exists()).toBe(false)
  })

  it('passes the correct props to each ProductCard', () => {
    const wrapper = mount(ProductList, {
      props: {
        products: mockProducts,
        exchangeRate: 36.0,
      },
      // No stubbing here to check actual prop passing if ProductCard was fully rendered
    })
    const productCards = wrapper.findAllComponents(ProductCard)
    expect(productCards.length).toBe(mockProducts.length)
    productCards.forEach((card, index) => {
      expect(card.vm.product).toEqual(mockProducts[index])
      expect(card.vm.exchangeRate).toBe(36.0)
    })
  })
})
