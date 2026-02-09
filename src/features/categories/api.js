import { apiClient } from "@/lib/apiClient";

export function fetchCategories() {
    return apiClient("/categories");
}

export function fetchCategory(slug) {
    return apiClient(`/categories/${slug}`);
}