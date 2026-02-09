
export async function apiClient(url, options = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000/api';
    const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAccessToken();
        console.log("Before refresh:", response.status);

        if (refreshed) {
            console.log("Access token refreshed, retrying original request...");
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
            `${process.env.NEXT_PUBLIC_SERVER_URL}/refresh`,
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