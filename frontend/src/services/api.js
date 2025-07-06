import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Attach token to all requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["X-User-Type"] = userType || "user";
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 errors
        if (error.response?.status === 401) {
            // Only clear tokens and redirect if not already on login page
            // and if the error is actually due to invalid/expired token
            const isAuthError = error.response?.data?.message?.toLowerCase().includes('token') ||
                error.response?.data?.message?.toLowerCase().includes('unauthorized');

            if (isAuthError && !window.location.pathname.includes('/login')) {
                // Clear invalid tokens
                localStorage.removeItem("token");
                localStorage.removeItem("userType");

                // Store the current location
                const currentPath = window.location.pathname;

                // Redirect to login with return URL
                window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
