import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '../ProductCard.vue'
import { formatVenezuelanCurrency, formatUSDCurrency } from '../../lib/currencyFormatter'

const mockProduct = {
  id: 1,
  title: 'Test Product',
  priceUSD: 100,
  category: 'electronics',
  imageUrl: 'test-image.jpg',
  description: 'Test Description',
  rating: 4.5,
}

describe('ProductCard.vue', () => {
  it('renders product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        exchangeRate: 36.5, // Example exchange rate
      },
    })

    expect(wrapper.find('h3').text()).toBe(mockProduct.title)
    expect(wrapper.find('img').attributes('src')).toBe(mockProduct.imageUrl)
    expect(wrapper.find('img').attributes('alt')).toBe(mockProduct.title)
    expect(wrapper.text()).toContain(mockProduct.category)
  })

  it('displays price in USD correctly formatted', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        exchangeRate: 36.5,
      },
    })
    const expectedUSD = formatUSDCurrency(mockProduct.priceUSD)
    expect(wrapper.text()).toContain(expectedUSD)
  })

  it('displays price in VES correctly formatted when exchange rate is provided', () => {
    const exchangeRate = 36.5
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        exchangeRate: exchangeRate,
      },
    })
    const expectedVES = formatVenezuelanCurrency(mockProduct.priceUSD * exchangeRate)
    expect(wrapper.text()).toContain(expectedVES)
  })

  it('displays "N/A" for VES price when exchange rate is null', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        exchangeRate: null,
      },
    })
    expect(wrapper.text()).toContain('N/A')
  })

  it('displays "N/A" for VES price when exchange rate is undefined', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        exchangeRate: undefined,
      },
    })
    expect(wrapper.text()).toContain('N/A')
  })

  it('uses a placeholder image if the product image fails to load', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: { ...mockProduct, imageUrl: 'invalid-url.jpg' },
        exchangeRate: 36.5,
      },
    })
    const img = wrapper.find('img')
    await img.trigger('error')
    expect(img.attributes('src')).toBe(
      'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
    )
  })

  it('applies loading animation classes and removes them on load', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        exchangeRate: 36.5,
      },
    })
    const img = wrapper.find('img')
    // Initially, opacity-0 and scale-90 should be present
    expect(img.classes()).toContain('opacity-0')
    expect(img.classes()).toContain('scale-90')

    // Simulate image load
    await img.trigger('load')

    // After load, opacity-100 and scale-100 should be present, and others removed
    expect(img.classes()).not.toContain('opacity-0')
    expect(img.classes()).not.toContain('scale-90')
    expect(img.classes()).toContain('opacity-100')
    expect(img.classes()).toContain('scale-100')
  })
})
