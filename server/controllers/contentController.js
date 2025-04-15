const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 数据存储路径
const dataFilePath = path.join(__dirname, '..', 'data', 'contents.json');

// 读取所有内容
const getContents = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取内容数据失败:', error);
    return [];
  }
};

// 保存内容
const saveContents = (contents) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(contents, null, 2));
    return true;
  } catch (error) {
    console.error('保存内容数据失败:', error);
    return false;
  }
};

// 获取待审核内容
exports.getPendingContents = (req, res) => {
  try {
    const contents = getContents();
    const pendingContents = contents.filter(content => content.status === 'pending');
    res.status(200).json(pendingContents);
  } catch (error) {
    console.error('获取待审核内容失败:', error);
    res.status(500).json({ message: '获取待审核内容失败' });
  }
};

// 获取已批准内容
exports.getApprovedContents = (req, res) => {
  try {
    const contents = getContents();
    const approvedContents = contents.filter(content => content.status === 'approved');
    res.status(200).json(approvedContents);
  } catch (error) {
    console.error('获取已批准内容失败:', error);
    res.status(500).json({ message: '获取已批准内容失败' });
  }
};

// 获取已拒绝内容
exports.getRejectedContents = (req, res) => {
  try {
    const contents = getContents();
    const rejectedContents = contents.filter(content => content.status === 'rejected');
    res.status(200).json(rejectedContents);
  } catch (error) {
    console.error('获取已拒绝内容失败:', error);
    res.status(500).json({ message: '获取已拒绝内容失败' });
  }
};

// 提交新内容
exports.submitContent = (req, res) => {
  try {
    const { title, description } = req.body;
    const imagePath = req.file.filename;
    
    if (!title || !description || !imagePath) {
      return res.status(400).json({ message: '缺少必要字段' });
    }
    
    const contents = getContents();
    const newContent = {
      id: uuidv4(),
      title,
      description,
      imagePath,
      status: 'pending', // 默认状态为待审核
      userId: req.user.id, // 添加用户ID关联
      userName: req.user.displayName || req.user.username, // 添加用户名
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    contents.push(newContent);
    saveContents(contents);
    
    res.status(201).json({ message: '内容提交成功，等待审核', content: newContent });
  } catch (error) {
    console.error('提交内容失败:', error);
    res.status(500).json({ message: '提交内容失败' });
  }
};

// 批准内容
exports.approveContent = (req, res) => {
  try {
    const { id } = req.params;
    const contents = getContents();
    const contentIndex = contents.findIndex(content => content.id === id);
    
    if (contentIndex === -1) {
      return res.status(404).json({ message: '内容不存在' });
    }
    
    if (contents[contentIndex].status !== 'pending') {
      return res.status(400).json({ message: '只能审核待审核状态的内容' });
    }
    
    contents[contentIndex].status = 'approved';
    contents[contentIndex].updatedAt = new Date().toISOString();
    contents[contentIndex].approvedBy = req.user.id; // 记录审核人
    
    saveContents(contents);
    
    res.status(200).json({ message: '内容已批准', content: contents[contentIndex] });
  } catch (error) {
    console.error('批准内容失败:', error);
    res.status(500).json({ message: '批准内容失败' });
  }
};

// 拒绝内容
exports.rejectContent = (req, res) => {
  try {
    const { id } = req.params;
    const contents = getContents();
    const contentIndex = contents.findIndex(content => content.id === id);
    
    if (contentIndex === -1) {
      return res.status(404).json({ message: '内容不存在' });
    }
    
    if (contents[contentIndex].status !== 'pending') {
      return res.status(400).json({ message: '只能审核待审核状态的内容' });
    }
    
    contents[contentIndex].status = 'rejected';
    contents[contentIndex].updatedAt = new Date().toISOString();
    contents[contentIndex].rejectedBy = req.user.id; // 记录审核人
    
    saveContents(contents);
    
    res.status(200).json({ message: '内容已拒绝', content: contents[contentIndex] });
  } catch (error) {
    console.error('拒绝内容失败:', error);
    res.status(500).json({ message: '拒绝内容失败' });
  }
}; 