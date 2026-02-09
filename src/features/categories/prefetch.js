import { fetchCategories, fetchCategory } from "./api";
import { categryKeys } from "./keys";


export async function prefetchCategories(queryClient) {
    await queryClient.prefetchQuery({
        queryKey: categryKeys.all,
        queryFn: fetchCategories,
    });
}


export async function prefetchCategory(queryClient, slug) {
    await queryClient.prefetchQuery({
        queryKey: categryKeys.byslug(slug),
        queryFn: () => fetchCategory(slug),
    });
}