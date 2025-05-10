// * BaseUrl =>  https://pydolarve.org/api/v2

// Example API endpoint:
//   https://pydolarve.org/api/v2/dollar?page=bcv&monitor=bdv&format_date=default&rounded_price=true

// Example response:
// {
//   "change": 6.19,
//   "color": "green",
//   "image": null,
//   "last_update": "09/05/2025, 12:00 AM",
//   "percent": 7.14,
//   "price": 92.86,
//   "price_old": 86.67,
//   "symbol": "▲",
//   "title": "Banco de Venezuela"
// }

import axios from 'axios'
export const exchangeRateApi = axios.create({
  baseURL: 'https://pydolarve.org/api/v2',
})
