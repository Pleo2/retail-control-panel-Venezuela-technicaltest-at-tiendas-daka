import type { ExchangeRateResponse } from '@/core/infrastructure/interfaces/exchange-rate/exchange-rate-response.types'
import type { ExchangeRateInfo } from '@/core/infrastructure/interfaces/app/app.types'

export class ExchangeRateMapper {
  static fromPyDolarToApp(apiResponse: ExchangeRateResponse): ExchangeRateInfo | null {
    // this the bcv data monitor bdv
    const bcvDataBdv = apiResponse
    if (bcvDataBdv && typeof bcvDataBdv.price === 'number') {
      return {
        rate: bcvDataBdv.price,
        source: 'BDV',
        lastUpdate: bcvDataBdv.last_update || new Date().toISOString(),
      }
    }
    return null
  }
}
