import { fakeStoreApi } from '@/core/api/fakeStoreApi'
import type { ProductResponse } from '@/core/infrastructure/interfaces/fakestore/products-response.types'
import type { Product, Category } from '@/core/infrastructure/interfaces/app/app.types'
import { ProductMapper } from '@/core/infrastructure/mappers/productMapper'

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
