export interface Product {
  id: number
  title: string
  priceUSD: number
  description: string
  category: string
  imageUrl: string
  rating: number
}

export type Category = string

export interface ExchangeRateInfo {
  rate: number
  source: string
  lastUpdate: string
}
