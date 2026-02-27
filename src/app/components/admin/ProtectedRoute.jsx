import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check for the token in cookies or a 'user' object in localStorage
    // Since cookies are HTTP-only, we usually store a small 'isLoggedIn' flag 
    // or the user profile in localStorage upon successful login.
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));

    if (!adminUser || adminUser.role !== 'admin') {
        // If not an admin, kick them back to the login page
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;