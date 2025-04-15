const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const passport = require('./config/passport');
const session = require('express-session');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 导入路由
const contentRoutes = require('./routes/content');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// 初始化 Express 应用
const app = express();
const PORT = process.env.PORT || 5000;

// 确保目录存在
const uploadDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化数据存储
const dataFilePath = path.join(dataDir, 'contents.json');
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// 中间件
app.use(cors({
  origin: 'http://localhost:3000', // 前端地址
  credentials: true // 允许凭证 (cookies)
}));
app.use(express.json());
app.use(morgan('dev'));

// 会话配置
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1天
  }
}));

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// 静态文件服务
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/contents', contentRoutes);
app.use('/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 