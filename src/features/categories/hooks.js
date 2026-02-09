import { useQuery } from "@tanstack/react-query";
import { categryKeys } from "./keys";
import { fetchCategories, fetchCategory } from "./api";


// FETCH ALL SINGLE CATEGORIES
export function useCategories() {
    return useQuery({
        queryKey: categryKeys.all,
        queryFn: fetchCategories,
    });
}


// FETCH SINGLE CATEGORY
export function useCategory(slug) {
    return useQuery({
        queryKey: categryKeys.byslug(slug),
        queryFn: () => fetchCategory(slug),
    });
}