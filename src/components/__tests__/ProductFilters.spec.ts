import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'

import ProductFilters from '@/components/ProductFilters.vue'
import type { Category } from '@/core/infrastructure/interfaces/app/app.types'

// Helper type for component props if needed for clarity, though not strictly necessary for mount
type ProductFiltersProps = {
  categories?: Category[]
  isLoadingCategories?: boolean
  // defineModel props will be handled by v-model in parent or by setting them on wrapper.props()
  selectedCategory?: string
  priceRangeMin?: number | null
  priceRangeMax?: number | null
}

describe('ProductFilters.vue', () => {
  // Declare wrapper type for better autocompletion
  let wrapper: VueWrapper<any>

  // Sample data for categories
  const mockCategories: Category[] = ['electronics', 'jewelery', "men's clothing"]

  // Helper function to mount the component with default props and models
  const createWrapper = (props: ProductFiltersProps = {}) => {
    return mount(ProductFilters, {
      props: {
        // Props passed to defineProps
        categories: props.categories === undefined ? mockCategories : props.categories,
        isLoadingCategories:
          props.isLoadingCategories === undefined ? false : props.isLoadingCategories,
        // For defineModel, we pass initial values for the models.
        // Vue Test Utils handles this by updating the component's internal refs.
        // The 'modelValue' convention is not strictly needed for defineModel if you name them.
        selectedCategory: props.selectedCategory === undefined ? '' : props.selectedCategory,
        priceRangeMin: props.priceRangeMin === undefined ? null : props.priceRangeMin,
        priceRangeMax: props.priceRangeMax === undefined ? null : props.priceRangeMax,
      },
      // If you were not using defineModel but props and emits:
      // global: {
      //   stubs: {
      //   }
      // }
    })
  }

  beforeEach(() => {
    // Mount the component before each test by default
    wrapper = createWrapper()
  })

  // Test 1: Component renders correctly
  it('renders the main section and filter title', () => {
    // Check if the main section element exists
    expect(wrapper.find('section').exists()).toBe(true)
    // Check if the title "Filtrar Productos" is present
    expect(wrapper.find('h2').text()).toBe('Filtrar Productos')
  })

  // Test 2: Renders category select, min price input, and max price input
  it('renders all filter input elements', () => {
    // Find elements by their ID
    expect(wrapper.find('#category-filter').exists()).toBe(true)
    expect(wrapper.find('#price-min-filter').exists()).toBe(true)
    expect(wrapper.find('#price-max-filter').exists()).toBe(true)
  })

  // Test 3: Populates category options correctly
  it('populates category select with provided categories', () => {
    const select = wrapper.find('#category-filter')
    const options = select.findAll('option')
    // Expected: 1 for "Todas las categorías" + number of mockCategories
    expect(options.length).toBe(1 + mockCategories.length)
    // Check if the first option is "Todas las categorías"
    expect(options[0].text()).toBe('Todas las categorías')
    expect(options[0].attributes('value')).toBe('')
    // Check if mock categories are present
    mockCategories.forEach((category, index) => {
      expect(options[index + 1].text()).toBe(category)
      expect(options[index + 1].attributes('value')).toBe(category)
    })
  })

  // Test 4: Category select is disabled when isLoadingCategories is true
  it('disables category select when isLoadingCategories is true', () => {
    // Re-mount with isLoadingCategories set to true
    wrapper = createWrapper({ isLoadingCategories: true })
    const select = wrapper.find<HTMLSelectElement>('#category-filter')
    // Check the 'disabled' attribute
    expect(select.element.disabled).toBe(true)
    // Check for the "Cargando categorías..." option
    expect(wrapper.find('option[disabled]').text()).toBe('Cargando categorías...')
  })

  // Test 5: Category select is enabled when isLoadingCategories is false
  it('enables category select when isLoadingCategories is false', () => {
    // Default wrapper has isLoadingCategories: false
    const select = wrapper.find<HTMLSelectElement>('#category-filter')
    expect(select.element.disabled).toBe(false)
  })

  // Test 6: Updates selectedCategory model when a category is selected
  it('updates selectedCategory model on change', async () => {
    const select = wrapper.find<HTMLSelectElement>('#category-filter')
    // Simulate user selecting the "electronics" category
    await select.setValue(mockCategories[0]) // "electronics"
    // Check the emitted event for defineModel.
    // defineModel emits 'update:modelName'
    expect(wrapper.emitted('update:selectedCategory')).toBeTruthy()
    expect(wrapper.emitted('update:selectedCategory')![0]).toEqual([mockCategories[0]])

    // To verify the model value *within* the component (if not using emitted check):
    // This requires that `defineModel` updates the ref, which it does.
    // (wrapper.vm as any).selectedCategory would access the internal ref value
    // console.log((wrapper.vm as any).selectedCategory); // For debugging
  })

  // Test 7: Updates priceRangeMin model when min price is entered
  it('updates priceRangeMin model on input', async () => {
    const minPriceInput = wrapper.find<HTMLInputElement>('#price-min-filter')
    // Simulate user typing a min price
    await minPriceInput.setValue('50')
    // Check emitted event
    expect(wrapper.emitted('update:priceRangeMin')).toBeTruthy()
    // .number modifier means it should emit a number
    expect(wrapper.emitted('update:priceRangeMin')![0]).toEqual([50])
  })

  // Test 8: Updates priceRangeMax model when max price is entered
  it('updates priceRangeMax model on input', async () => {
    const maxPriceInput = wrapper.find<HTMLInputElement>('#price-max-filter')
    // Simulate user typing a max price
    await maxPriceInput.setValue('150')
    // Check emitted event
    expect(wrapper.emitted('update:priceRangeMax')).toBeTruthy()
    expect(wrapper.emitted('update:priceRangeMax')![0]).toEqual([150])
  })

  // Test 10: Check placeholders for price inputs
  it('displays correct placeholders for price inputs', () => {
    const minPriceInput = wrapper.find('#price-min-filter')
    const maxPriceInput = wrapper.find('#price-max-filter')
    expect(minPriceInput.attributes('placeholder')).toBe('Ej: 10')
    expect(maxPriceInput.attributes('placeholder')).toBe('Ej: 100')
  })
})
