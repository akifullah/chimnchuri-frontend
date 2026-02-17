

// LOGIN

import { apiClient } from "./apiClient";


export const registerApi = async (data) => {
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

export const updateProfile = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
        }
    });

    return apiClient("/profile", {
        method: "POST", // Usually POST for updates with files
        body: formData,
        headers: {
            "Content-Type": undefined, // Let the browser set the boundary
        }
    });
};


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

// CHECKCOUT 
export const createOrder = (data) => apiClient("/process-checkout", {
    method: "POST",
    body: JSON.stringify(data)
});


// ORDERS
export const fetchOrders = () => apiClient("/orders");

export const fetchOrder = (id) => apiClient(`/orders/${id}`);




// SETTINGS
export const settings = () => apiClient("/settings");

// GET PAYMENTS SETTINGS
export const paymentSettings = () => apiClient("/payment-settings");

// time slots
export const timeSlots = () => apiClient("/time-slots");
