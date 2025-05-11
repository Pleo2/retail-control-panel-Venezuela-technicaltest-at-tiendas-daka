import { exchangeRateApi } from '@/core/api/exchangeRateApi'
import type { ExchangeRateResponse } from '@/core/infrastructure/interfaces/exchange-rate/exchange-rate-response.types'
import type { ExchangeRateInfo } from '@/core/infrastructure/interfaces/app/app.types'
import { ExchangeRateMapper } from '@/core/infrastructure/mappers/exchangeRateMapper'

export const fetchBcvRate = async (): Promise<ExchangeRateInfo | null> => {
  try {
    const { data } = await exchangeRateApi.get<ExchangeRateResponse>(
      '/dollar?page=bcv&monitor=bdv&format_date=default&rounded_price=true',
    )
    return ExchangeRateMapper.fromPyDolarToApp(data)
  } catch (error) {
    console.error('Error fetching BCV rate:', error)
    throw new Error('Could not fetch BCV exchange rate.')
  }
}
