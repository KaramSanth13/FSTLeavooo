import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from './Layout';

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
