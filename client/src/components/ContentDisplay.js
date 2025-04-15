import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentDisplay = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedContents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contents/approved');
      setContents(response.data);
    } catch (error) {
      console.error('获取内容失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedContents();
  }, []);

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
        <p className="text-gray-600 mb-4">暂无审核通过的内容</p>
        <button
          onClick={fetchApprovedContents}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          刷新
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">已审核内容</h2>
        <button
          onClick={fetchApprovedContents}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          刷新
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => (
          <div key={content.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={`/api/uploads/${content.imagePath}`} 
                alt={content.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
              <p className="text-gray-700">{content.description}</p>
              <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                <span>提交于: {new Date(content.createdAt).toLocaleDateString()}</span>
                {content.userName && (
                  <span>作者: {content.userName}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentDisplay; 