import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

// Import the component to be tested
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/core/infrastructure/interfaces/app/app.types'

// Mock the currencyFormatter or ensure it's correctly imported if it's simple
// For this example, we'll assume it's imported and works.
// If it had external dependencies, mocking would be better.
// vi.mock('@/lib/currencyFormatter', () => ({
//   formatVenezuelanCurrency: (val: number) => `Bs. ${val.toFixed(2)} (Mocked)`,
//   formatUSDCurrency: (val: number) => `$${val.toFixed(2)} (Mocked)`,
// }));

describe('ProductCard.vue', () => {
  let wrapper: VueWrapper<any>

  // Sample product data
  const mockProduct: Product = {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
    priceUSD: 109.95,
    description:
      'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
    category: "men's clothing",
    imageUrl: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: 3.9,
  }

  const mockExchangeRate = 36.5

  // Helper to create the wrapper
  const createWrapper = (
    product: Product = mockProduct,
    exchangeRate: number | null | undefined = mockExchangeRate,
  ) => {
    return mount(ProductCard, {
      props: {
        product,
        exchangeRate,
      },
      // global: {
      //   stubs: { /* Stub child components if any */ }
      // }
    })
  }

  beforeEach(() => {
    wrapper = createWrapper()
  })

  // Test 1: Renders product information correctly
  it('renders product title, category, and image alt text', () => {
    expect(wrapper.find('h3').text()).toBe(mockProduct.title)
    expect(wrapper.find('h3').attributes('title')).toBe(mockProduct.title) // For truncated title
    expect(wrapper.find('p.capitalize').text()).toBe(mockProduct.category)
    expect(wrapper.find('img').attributes('alt')).toBe(mockProduct.title)
  })

  // Test 2: Renders product image with correct src and lazy loading
  it('renders product image with correct src and lazy loading attribute', () => {
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(mockProduct.imageUrl)
    expect(img.attributes('loading')).toBe('lazy')
  })

  // Test 3: Displays formatted USD price
  it('displays formatted USD price', () => {
    // This relies on your formatUSDCurrency function
    // Example: if formatUSDCurrency(109.95) returns "$109.95"
    const expectedUSD = `$${mockProduct.priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    // Find the USD price element (be more specific if needed using class or structure)
    const usdPriceElement = wrapper.findAll('p.text-base').find((p) => p.text().includes('$'))
    expect(usdPriceElement?.text()).toContain(expectedUSD) // Using toContain for flexibility
  })

  // Test 4: Displays formatted VES price when exchange rate is available
  it('displays formatted VES price when exchange rate is available', () => {
    const expectedVESValue = mockProduct.priceUSD * mockExchangeRate
    // This relies on your formatVenezuelanCurrency function
    // Example: if formatVenezuelanCurrency(value) returns "1.234,56 Bs."
    const expectedVESText = `${expectedVESValue
      .toFixed(2)
      .split('.')[0]
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${expectedVESValue.toFixed(2).split('.')[1]} Bs.`

    const vesPriceElement = wrapper.findAll('p.text-base').find((p) => p.text().includes('Bs.'))
    expect(vesPriceElement?.text()).toContain(expectedVESText.split(' ')[0]) // Check the numeric part
    expect(vesPriceElement?.text()).toContain('Bs.') // Check the currency symbol
  })

  // Test 5: Displays "N/A" for VES price when exchange rate is null
  it('displays "N/A" for VES price when exchange rate is null', () => {
    wrapper = createWrapper(mockProduct, null)
    const vesPriceElement = wrapper
      .findAll('p.text-base')
      .find((p) => p.text() === 'N/A' || p.text().includes('N/A'))
    expect(vesPriceElement?.text()).toBe('N/A')
  })

  // Test 6: Image load event removes opacity and scale classes (basic check)
  it('image @load event triggers class changes for animation', async () => {
    const img = wrapper.find('img')
    // Initially, it should have opacity-0 and scale-90
    expect(img.classes()).toContain('opacity-0')
    expect(img.classes()).toContain('scale-90')

    // Trigger the load event
    await img.trigger('load')

    // Now, it should not have opacity-0 and scale-90
    expect(img.classes()).not.toContain('opacity-0')
    expect(img.classes()).not.toContain('scale-90')
    // And it should have opacity-100 and scale-100
    expect(img.classes()).toContain('opacity-100')
    expect(img.classes()).toContain('scale-100')
  })

  // Test 7: Image error event changes src to placeholder
  it('image @error event changes src to placeholder', async () => {
    const img = wrapper.find<HTMLImageElement>('img') // Type it for element access
    const originalSrc = img.element.src
    const placeholderSrc =
      'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'

    // Make sure original src is not the placeholder src
    expect(originalSrc).not.toBe(placeholderSrc)

    // Trigger the error event
    await img.trigger('error')

    // Check if the src attribute has been updated to the placeholder
    // After the event, the wrapper's view of the img attributes might need a tick or re-find
    // but usually, the element's property is updated directly.
    expect(img.element.src).toBe(placeholderSrc)
  })

  // Test 8: Check for root element classes (basic check, can be expanded)
  it('has correct root element classes for styling and interaction', () => {
    expect(wrapper.classes()).toContain('bg-white/20')
    expect(wrapper.classes()).toContain('rounded-lg')
    expect(wrapper.classes()).toContain('group') // For group-hover effects
  })
})
