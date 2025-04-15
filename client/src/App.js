import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginButton from './components/LoginButton';
import LoginPage from './components/LoginPage';
import SubmissionForm from './components/SubmissionForm';
import ContentDisplay from './components/ContentDisplay';
import AdminPanel from './components/AdminPanel';

// 设置 axios 默认配置
axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <header className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">内容审核示例</h1>
                <nav>
                  <ul className="flex space-x-4 items-center">
                    <li>
                      <Link 
                        to="/"
                        className="px-3 py-2 rounded hover:bg-blue-700"
                      >
                        首页
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/submit"
                        className="px-3 py-2 rounded hover:bg-blue-700"
                      >
                        提交内容
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/admin"
                        className="px-3 py-2 rounded hover:bg-blue-700"
                      >
                        管理员
                      </Link>
                    </li>
                    <li>
                      <LoginButton />
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<ContentDisplay />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/submit" 
                element={
                  <ProtectedRoute>
                    <SubmissionForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          <footer className="bg-gray-100 py-4 mt-8">
            <div className="container mx-auto px-4 text-center text-gray-600">
              &copy; {new Date().getFullYear()} 内容审核示例应用
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 