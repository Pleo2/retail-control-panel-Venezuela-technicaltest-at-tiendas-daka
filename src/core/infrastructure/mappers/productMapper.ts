import type { ProductResponse } from '../interfaces/fakestore/products-response.types';
import type { Product } from '../interfaces/app/app.types';

export class ProductMapper {
    static fromFakeStoreToApp(apiProduct: ProductResponse): Product {
        return {
            id: apiProduct.id,
            title: apiProduct.title,
            priceUSD: apiProduct.price,
            description: apiProduct.description,
            category: apiProduct.category,
            imageUrl: apiProduct.image,
            rating: apiProduct.rating.rate,
        };
    }
}
