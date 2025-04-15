// 检查用户是否已登录
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ message: '请先登录', isAuthenticated: false });
};

// 检查是否为管理员
exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  
  res.status(403).json({ message: '需要管理员权限', isAuthenticated: true, isAdmin: false });
}; 