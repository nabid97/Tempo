import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: ReactNode; // Allow ReactNode to support all types of React children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
