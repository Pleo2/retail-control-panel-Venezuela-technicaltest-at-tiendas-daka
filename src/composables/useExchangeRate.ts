import { useQuery } from '@tanstack/vue-query'
import { fetchBcvRate } from '../core/actions/exchangeRateActions'

export function useExchangeRate() {
  const exchangeRateQuery = useQuery({
    queryKey: ['exchangeRate', 'bcv'], // Más específico
    queryFn: fetchBcvRate,
  })
  return {
    exchangeRateInfo: exchangeRateQuery.data,
    isLoading: exchangeRateQuery.isLoading,
    isError: exchangeRateQuery.isError,
    error: exchangeRateQuery.error,
    isSuccess: exchangeRateQuery.isSuccess,
  }
}
