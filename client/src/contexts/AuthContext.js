import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 创建认证上下文
const AuthContext = createContext();

// 设置 axios 默认值
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/user');
      if (response.data.isAuthenticated) {
        setCurrentUser(response.data);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // 登出
  const logout = async () => {
    try {
      await axios.get('/auth/logout');
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 提供的上下文值
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    fetchCurrentUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的 Hook
export const useAuth = () => {
  return useContext(AuthContext);
}; 