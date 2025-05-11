import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

import Stats from '@/components/Stats.vue'
import type { Product } from '@/core/infrastructure/interfaces/app/app.types'

// Mock the currencyFormatter as its exact output is important here
// If formatUSDCurrency is complex or has side effects, mocking is good.
// If it's a pure function, you could also import and use it directly in expectations.
vi.mock('@/lib/currencyFormatter', () => ({
  // Adjust path to your currencyFormatter
  formatUSDCurrency: (value: number) => `$${value.toFixed(2)}`, // Simple mock for predictable output
}))

describe('Stats.vue', () => {
  let wrapper: VueWrapper<any>

  // Sample product data
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product A',
      priceUSD: 10,
      description: '',
      category: 'electronics',
      imageUrl: '',
      rating: 4,
    },
    {
      id: 2,
      title: 'Product B',
      priceUSD: 20,
      description: '',
      category: 'electronics',
      imageUrl: '',
      rating: 3,
    },
    {
      id: 3,
      title: 'Product C',
      priceUSD: 30,
      description: '',
      category: 'jewelery',
      imageUrl: '',
      rating: 5,
    },
  ]

  const createWrapper = (products: Product[] | undefined = mockProducts) => {
    return mount(Stats, {
      props: {
        products,
      },
    })
  }

  beforeEach(() => {
    // Default mount with mockProducts
    wrapper = createWrapper()
  })

  // Test 1: Renders the main title
  it('renders the main statistics title', () => {
    expect(wrapper.find('h2').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Estadísticas')
  })

  // Test 2: Renders the correct number of stat blocks
  it('renders three statistics blocks', () => {
    const statBlocks = wrapper.findAll('.grid > div') // Assumes each stat is a div in the grid
    expect(statBlocks.length).toBe(3)
  })

  // Test 3: Calculates and displays Total de Productos correctly
  it('calculates and displays "Total de Productos en la Categoria" correctly', () => {
    const totalProductsStat = wrapper.findAllComponents({ name: 'Stats' })[0] // Not ideal, better to find by text or structure
    const statBlock = wrapper
      .findAll('.grid > div')
      .find((div) => div.find('h3').text().includes('Total de Productos'))
    expect(statBlock).toBeDefined()
    expect(statBlock!.find('h3').text()).toBe('Total de Productos en la Categoria')
    expect(statBlock!.find('p').text()).toBe(String(mockProducts.length))
  })

  // Test 4: Calculates and displays Categorías Únicas correctly
  it('calculates and displays "Categorías Únicas" correctly', () => {
    const uniqueCategories = new Set(mockProducts.map((p) => p.category)).size
    const statBlock = wrapper
      .findAll('.grid > div')
      .find((div) => div.find('h3').text().includes('Categorías Únicas'))
    expect(statBlock).toBeDefined()
    expect(statBlock!.find('h3').text()).toBe('Categorías Únicas')
    expect(statBlock!.find('p').text()).toBe(String(uniqueCategories))
  })

  // Test 5: Calculates and displays Precio Promedio (USD) correctly
  it('calculates and displays "Precio Promedio (USD)" correctly', () => {
    const sum = mockProducts.reduce((acc, p) => acc + p.priceUSD, 0)
    const average = sum / mockProducts.length
    const expectedFormattedAverage = `$${average.toFixed(2)}` // Based on our mock of formatUSDCurrency

    const statBlock = wrapper
      .findAll('.grid > div')
      .find((div) => div.find('h3').text().includes('Precio Promedio (USD)'))
    expect(statBlock).toBeDefined()
    expect(statBlock!.find('h3').text()).toBe('Precio Promedio (USD)')
    expect(statBlock!.find('p').text()).toBe(expectedFormattedAverage)
  })

  // Test 7: Handles empty products array gracefully
  it('handles empty products array by displaying 0 for counts and $0.00 for average price', () => {
    wrapper = createWrapper([])

    const totalProductsBlock = wrapper
      .findAll('.grid > div')
      .find((div) => div.find('h3').text().includes('Total de Productos'))
    expect(totalProductsBlock!.find('p').text()).toBe('0')

    const uniqueCategoriesBlock = wrapper
      .findAll('.grid > div')
      .find((div) => div.find('h3').text().includes('Categorías Únicas'))
    expect(uniqueCategoriesBlock!.find('p').text()).toBe('0')

    const averagePriceBlock = wrapper
      .findAll('.grid > div')
      .find((div) => div.find('h3').text().includes('Precio Promedio (USD)'))
    expect(averagePriceBlock!.find('p').text()).toBe('$0.00') // Based on our mock
  })

  // Test 8: Check labels and values are rendered from the `stats` computed array
  it('renders correct labels and values from the stats computed array', () => {
    // This test verifies the structure driven by the `stats` computed array
    const statBlocks = wrapper.findAllComponents({ name: 'Stats' })[0] // This is still not good
    // Let's re-do selector for stat blocks
    const renderedStatBlocks = wrapper.findAll('.grid > div')
    expect(renderedStatBlocks.length).toBe(3)

    const expectedStats = [
      { label: 'Total de Productos en la Categoria', value: String(mockProducts.length) },
      {
        label: 'Categorías Únicas',
        value: String(new Set(mockProducts.map((p) => p.category)).size),
      },
      {
        label: 'Precio Promedio (USD)',
        value: `$${(mockProducts.reduce((s, p) => s + p.priceUSD, 0) / mockProducts.length).toFixed(2)}`,
      },
    ]

    renderedStatBlocks.forEach((block, index) => {
      const labelElement = block.find('h3')
      const valueElement = block.find('p')
      expect(labelElement.text()).toBe(expectedStats[index].label)
      expect(valueElement.text()).toBe(expectedStats[index].value)
    })
  })
})
