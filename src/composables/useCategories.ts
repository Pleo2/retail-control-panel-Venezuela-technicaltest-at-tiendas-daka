import { useQuery } from '@tanstack/vue-query';
import { fetchCategories } from '../core/actions/ProductsAction.ts';

export function useCategories() {
    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });
    return {
        categories: categoriesQuery.data,
        isLoading: categoriesQuery.isLoading,
        isError: categoriesQuery.isError,
        error: categoriesQuery.error,
    };
}
