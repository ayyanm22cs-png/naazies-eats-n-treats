import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const location = useLocation();

    let adminUser = null;

    try {
        // ✅ Check both localStorage and sessionStorage
        adminUser =
            JSON.parse(localStorage.getItem('adminUser')) ||
            JSON.parse(sessionStorage.getItem('adminUser'));
    } catch (err) {
        // ❌ If corrupted data, force logout
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminUser');
        adminUser = null;
    }

    // ❌ If not logged in OR not admin → block access
    if (!adminUser || adminUser.role !== 'admin') {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{ from: location }} // ✅ optional (for redirect after login)
            />
        );
    }

    // ✅ If valid admin → allow access
    return <Outlet />;
};

export default ProtectedRoute;