import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('usernameData') && localStorage.getItem('passwordData');

  if (!isAuthenticated) {
    return <Navigate to="/tologin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;