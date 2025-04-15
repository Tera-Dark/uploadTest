const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

// 获取所有用户 (需要管理员权限)
router.get('/users', isAdmin, adminController.getAllUsers);

// 设置用户为管理员 (需要管理员权限)
router.put('/users/:userId/promote', isAdmin, adminController.setAdmin);

// 移除用户的管理员权限 (需要管理员权限)
router.put('/users/:userId/demote', isAdmin, adminController.removeAdmin);

module.exports = router; 