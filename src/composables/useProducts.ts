import { useQuery } from '@tanstack/vue-query'
import { fetchAllProducts } from '../core/actions/ProductsAction'

export function useProducts() {
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    // staleTime, gcTime, etc., can inherit from the QueryClient defaults
  })

  return {
    // Expose the data and states you need from the query
    products: productsQuery.data, // Access .value in the template/script setup
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    isSuccess: productsQuery.isSuccess,
    // ... other Vue Query states if you need them (isFetching, refetch, etc.)
  }
}
