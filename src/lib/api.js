

// LOGIN

import { apiClient } from "./apiClient";


export const registerApi = async (data) => {
    console.log(data);
    const res = await apiClient("/register", {
        method: "POST",
        body: JSON.stringify(data)

    });

    return res;
}

export async function login(data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.message || "Failed to login");
    }
    return res.json();
}
// PROFILE
export const fetchProfile = () => apiClient("/profile");


// GET ALL CATEGORIES
export async function fetchCategories() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/categories`);

    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }

    return res.json();
}

export async function fetchCategory(slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/categories/${slug}`);
    if (!res.ok) {
        throw new Error("Failed to fetch category");
    }

    return res.json();
}