// * BaseUrl =>  https://fakestoreapi.com
// Fake Store API endpoints:
// - GET    /products
// - GET    /products/1
// - GET    /products/categories
// - GET    /products/category/jewelery
// - GET    /carts?userId=1
// - GET    /products?limit=5

import axios from 'axios'
export const fakeStoreApi = axios.create({
  baseURL: 'https://fakestoreapi.com',
})
