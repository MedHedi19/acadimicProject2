
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { token } = useSelector((state) => state.auth);
    const decodedToken = token ? jwtDecode(token) : null;
    const role = decodedToken?.role;

    // Redirect to login if there's no token
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Redirect if the user's role is not allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Redirect clients to /forum if trying to access admin-only pages
        return <Navigate to="/forum" />;
    }

    return children;
};

export default ProtectedRoute; 