import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginButton = () => {
  const { isAuthenticated, currentUser, logout, loading } = useAuth();

  const handleLogin = () => {
    window.location.href = '/auth/github';
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <button 
        className="bg-gray-300 text-white py-2 px-4 rounded opacity-75 cursor-not-allowed"
        disabled
      >
        加载中...
      </button>
    );
  }

  if (isAuthenticated && currentUser) {
    return (
      <div className="flex items-center">
        <img 
          src={currentUser.avatarUrl} 
          alt={currentUser.displayName} 
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="mr-2 text-sm">{currentUser.displayName}</span>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
        >
          登出
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center"
    >
      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      GitHub 登录
    </button>
  );
};

export default LoginButton; 