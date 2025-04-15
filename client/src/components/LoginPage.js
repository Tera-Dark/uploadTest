import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './LoginButton';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">用户登录</h2>
      <div className="mb-6 text-center text-gray-600">
        <p>请登录后才能上传内容</p>
      </div>
      <div className="flex justify-center">
        <LoginButton />
      </div>
    </div>
  );
};

export default LoginPage; 