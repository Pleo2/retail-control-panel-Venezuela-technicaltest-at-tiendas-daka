import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Stats from '../Stats.vue'
import { formatUSDCurrency } from '../../lib/currencyFormatter'
import type { Product } from '../../core/infrastructure/interfaces/app/app.types'

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    priceUSD: 100,
    category: 'electronics',
    imageUrl: 'image1.jpg',
    description: 'Desc 1',
    rating: 4,
  },
  {
    id: 2,
    title: 'Product 2',
    priceUSD: 200,
    category: 'books',
    imageUrl: 'image2.jpg',
    description: 'Desc 2',
    rating: 4.5,
  },
  {
    id: 3,
    title: 'Product 3',
    priceUSD: 150,
    category: 'electronics',
    imageUrl: 'image3.jpg',
    description: 'Desc 3',
    rating: 4.5,
  },
]

// Helper to find the stat card by its label
const findStatByLabel = (wrapper: any, label: string) => {
  return wrapper.findAll('div').filter((card: { find: (arg0: string) => any }) => {
    const h3 = card.find('h3')
    return h3.exists() && h3.text().trim() === label
  })[0]
}

describe('Stats.vue', () => {
  it('renders the main title', () => {
    const wrapper = mount(Stats, { props: { products: mockProducts } })
    expect(wrapper.find('h2').text()).toBe('Estadísticas')
  })

  it('calculates and displays total products correctly', () => {
    const wrapper = mount(Stats, { props: { products: mockProducts } })
    const statCard = findStatByLabel(wrapper, 'Total de Productos en la Categoria')
    expect(statCard).toBeDefined()
    expect(statCard.find('p').text()).toBe(String(mockProducts.length))
  })

  it('calculates and displays unique categories count correctly', () => {
    const wrapper = mount(Stats, { props: { products: mockProducts } })
    const uniqueCategories = new Set(mockProducts.map((p) => p.category))
    const statCard = findStatByLabel(wrapper, 'Categorías Únicas')
    expect(statCard).toBeDefined()
    expect(statCard.find('p').text()).toBe(String(uniqueCategories.size))
  })

  it('calculates and displays average price USD correctly formatted', () => {
    const totalSum = mockProducts.reduce((sum, p) => sum + p.priceUSD, 0)
    const average = totalSum / mockProducts.length
    const wrapper = mount(Stats, { props: { products: mockProducts } })
    const statCard = findStatByLabel(wrapper, 'Precio Promedio (USD)')
    expect(statCard).toBeDefined()
    expect(statCard.find('p').text()).toBe(formatUSDCurrency(average))
  })

  it('handles empty products array gracefully', () => {
    const wrapper = mount(Stats, { props: { products: [] } })
    ;['Total de Productos en la Categoria', 'Categorías Únicas', 'Precio Promedio (USD)'].forEach(
      (label) => {
        const statCard = findStatByLabel(wrapper, label)
        expect(statCard).toBeDefined()
        const expectedValue = label === 'Precio Promedio (USD)' ? formatUSDCurrency(0) : '0'
        expect(statCard.find('p').text()).toBe(expectedValue)
      },
    )
  })

  it('handles undefined products prop gracefully (initial loading state)', () => {
    const wrapper = mount(Stats, { props: { products: undefined } })
    ;['Total de Productos en la Categoria', 'Categorías Únicas', 'Precio Promedio (USD)'].forEach(
      (label) => {
        const statCard = findStatByLabel(wrapper, label)
        expect(statCard).toBeDefined()
        const expectedValue = label === 'Precio Promedio (USD)' ? formatUSDCurrency(0) : '0'
        expect(statCard.find('p').text()).toBe(expectedValue)
      },
    )
  })

  it('renders the correct number of stat boxes', () => {
    const wrapper = mount(Stats, { props: { products: mockProducts } })
    // Assumes that the stat cards are direct children of the container with class "grid"
    expect(wrapper.find('.grid').findAll('div').length).toBe(3)
  })
})
