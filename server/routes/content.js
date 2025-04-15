const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const contentController = require('../controllers/contentController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// 文件类型过滤
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('只支持图片格式 (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制文件大小为 5MB
  fileFilter
});

// 获取已批准内容 (公开)
router.get('/approved', contentController.getApprovedContents);

// 以下路由需要登录
// 获取待审核内容 (仅管理员)
router.get('/pending', isAdmin, contentController.getPendingContents);

// 获取已拒绝内容 (仅管理员)
router.get('/rejected', isAdmin, contentController.getRejectedContents);

// 提交新内容 (需要登录)
router.post('/submit', isAuthenticated, upload.single('image'), contentController.submitContent);

// 批准内容 (仅管理员)
router.put('/:id/approve', isAdmin, contentController.approveContent);

// 拒绝内容 (仅管理员)
router.put('/:id/reject', isAdmin, contentController.rejectContent);

module.exports = router; 