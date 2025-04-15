import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
  const [pendingContents, setPendingContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected
  const [approvedContents, setApprovedContents] = useState([]);
  const [rejectedContents, setRejectedContents] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchContents();
  }, [activeTab, isAuthenticated, navigate]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      let endpoint = '';
      
      switch (activeTab) {
        case 'pending':
          endpoint = '/api/contents/pending';
          break;
        case 'approved':
          endpoint = '/api/contents/approved';
          break;
        case 'rejected':
          endpoint = '/api/contents/rejected';
          break;
        default:
          endpoint = '/api/contents/pending';
      }
      
      const response = await axios.get(endpoint, { withCredentials: true });
      
      switch (activeTab) {
        case 'pending':
          setPendingContents(response.data);
          break;
        case 'approved':
          setApprovedContents(response.data);
          break;
        case 'rejected':
          setRejectedContents(response.data);
          break;
        default:
          setPendingContents(response.data);
      }
    } catch (error) {
      console.error('获取内容失败:', error);
      
      if (error.response?.status === 401) {
        setMessage({ text: '请先登录', type: 'error' });
        navigate('/login');
      } else if (error.response?.status === 403) {
        setMessage({ text: '没有权限访问管理页面', type: 'error' });
      } else {
        setMessage({ 
          text: '获取内容失败，请稍后再试', 
          type: 'error' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/contents/${id}/approve`, {}, { withCredentials: true });
      setMessage({ text: '内容已批准', type: 'success' });
      fetchContents();
    } catch (error) {
      console.error('审核失败:', error);
      
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 403) {
        setMessage({ text: '没有权限进行此操作', type: 'error' });
      } else {
        setMessage({ 
          text: '操作失败，请稍后再试', 
          type: 'error' 
        });
      }
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/contents/${id}/reject`, {}, { withCredentials: true });
      setMessage({ text: '内容已拒绝', type: 'success' });
      fetchContents();
    } catch (error) {
      console.error('审核失败:', error);
      
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 403) {
        setMessage({ text: '没有权限进行此操作', type: 'error' });
      } else {
        setMessage({ 
          text: '操作失败，请稍后再试', 
          type: 'error' 
        });
      }
    }
  };

  const renderContentList = () => {
    let contents = [];
    
    switch (activeTab) {
      case 'pending':
        contents = pendingContents;
        break;
      case 'approved':
        contents = approvedContents;
        break;
      case 'rejected':
        contents = rejectedContents;
        break;
      default:
        contents = pendingContents;
    }

    if (loading) {
      return (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">正在加载内容...</p>
        </div>
      );
    }

    if (contents.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">暂无{activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '已批准' : '已拒绝'}的内容</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {contents.map((content) => (
          <div key={content.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 h-48">
                <img 
                  src={`/api/uploads/${content.imagePath}`} 
                  alt={content.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 md:w-2/3">
                <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
                <p className="text-gray-700 mb-4">{content.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>提交于: {new Date(content.createdAt).toLocaleString()}</p>
                  <p>状态: {content.status === 'pending' ? '待审核' : content.status === 'approved' ? '已批准' : '已拒绝'}</p>
                  {content.userName && <p>作者: {content.userName}</p>}
                </div>
                
                {activeTab === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(content.id)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                    >
                      批准
                    </button>
                    <button
                      onClick={() => handleReject(content.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                      拒绝
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">管理员面板</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              待审核
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'approved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              已批准
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'rejected'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              已拒绝
            </button>
          </nav>
        </div>
      </div>
      
      <div className="mb-4 flex justify-end">
        <button
          onClick={fetchContents}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          刷新
        </button>
      </div>
      
      {renderContentList()}
    </div>
  );
};

export default AdminPanel; 