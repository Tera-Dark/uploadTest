const fs = require('fs');
const path = require('path');

// 用户数据存储路径
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// 读取用户数据
const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取用户数据失败:', error);
    return [];
  }
};

// 保存用户数据
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('保存用户数据失败:', error);
    return false;
  }
};

// 设置用户为管理员
exports.setAdmin = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: '缺少用户ID' });
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 更新用户为管理员
    users[userIndex].isAdmin = true;
    
    // 保存用户数据
    saveUsers(users);
    
    res.status(200).json({ message: '已将用户设置为管理员', user: users[userIndex] });
  } catch (error) {
    console.error('设置管理员失败:', error);
    res.status(500).json({ message: '设置管理员失败' });
  }
};

// 移除管理员权限
exports.removeAdmin = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: '缺少用户ID' });
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 移除管理员权限
    users[userIndex].isAdmin = false;
    
    // 保存用户数据
    saveUsers(users);
    
    res.status(200).json({ message: '已移除用户的管理员权限', user: users[userIndex] });
  } catch (error) {
    console.error('移除管理员权限失败:', error);
    res.status(500).json({ message: '移除管理员权限失败' });
  }
};

// 获取所有用户列表
exports.getAllUsers = (req, res) => {
  try {
    const users = getUsers();
    
    // 过滤掉敏感信息
    const safeUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      isAdmin: user.isAdmin || false,
      createdAt: user.createdAt
    }));
    
    res.status(200).json(safeUsers);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ message: '获取用户列表失败' });
  }
};