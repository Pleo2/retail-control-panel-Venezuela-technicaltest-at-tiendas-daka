import { fakeStoreApi } from '../api/fakeStoreApi'
import type { ProductResponse } from '../infrastructure/interfaces/fakestore/products-response.types'
import type { Product, Category } from '../infrastructure/interfaces/app/app.types'
import { ProductMapper } from '../infrastructure/mappers/productMapper'

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await fakeStoreApi.get<ProductResponse[]>('/products')
    return data.map(ProductMapper.fromFakeStoreToApp)
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Could not fetch products.')
  }
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await fakeStoreApi.get<string[]>('/products/categories')
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Could not fetch categories.')
  }
}
