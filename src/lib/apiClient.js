
export async function apiClient(url, options = {}) {
    const baseUrl = '/api/v1/frontend';
    const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            // Retry original request after refresh
            return apiClient(url, options);
        }

        // If refresh also fails, user must login again
        throw new Error("Session expired");
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "API Error");
    }
    return response.json();

}

// Helper function to refresh access token
async function refreshAccessToken() {
    try {
        const res = await fetch(
            `/api/v1/frontend/refresh`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        return res.ok;
    } catch (error) {
        return false;
    }
}