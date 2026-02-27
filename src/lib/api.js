import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
});

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the backend returns 401 (Token expired or missing)
        if (error.response && error.response.status === 401) {

            // 1. Clear the local storage so ProtectedRoute triggers
            localStorage.removeItem('adminUser');

            // 2. Show a specific toast message
            // We use a unique ID to prevent multiple toasts if many requests fail at once
            toast.error("Session expired. Please login again.", { id: "session-expired" });

            // 3. Redirect to admin login
            // We use window.location because we are outside the React Router context here
            if (!window.location.pathname.includes('/admin/login')) {
                window.location.href = "/admin/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;