# 用户上传内容审核示例

这是一个简单的内容审核系统示例，用户可以登录后提交内容（包括标题、简介和图片），管理员可以审核这些内容，批准的内容将在首页展示。

## 功能特点

- 使用 GitHub OAuth 进行用户登录
- 登录用户可以上传标题、简介和图片
- 所有提交的内容需要管理员审核
- 管理员可以批准或拒绝内容
- 批准的内容会在首页展示
- 简单的管理界面，查看待审核、已批准和已拒绝的内容

## 技术栈

- 前端：React + React Router + Tailwind CSS
- 后端：Node.js + Express + Passport.js
- 认证：GitHub OAuth
- 数据存储：本地 JSON 文件（简化实现）
- 文件存储：本地文件系统

## 安装与运行

### 前提条件

- Node.js 14.x 或更高版本
- npm 或 yarn
- GitHub 账户（用于创建 OAuth 应用）

### 创建 GitHub OAuth 应用

1. 登录你的 GitHub 账户
2. 进入 Settings -> Developer settings -> OAuth Apps -> New OAuth App
3. 填写应用信息：
   - Application name: 内容审核示例
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:5000/auth/github/callback
4. 点击 "Register application"
5. 创建完成后，记下 Client ID 和 Client Secret

### 配置环境变量

1. 在 server 目录下创建 .env 文件（可复制 .env.example 并重命名）
2. 填写以下环境变量：
```
PORT=5000
GITHUB_CLIENT_ID=你的GitHub客户端ID
GITHUB_CLIENT_SECRET=你的GitHub客户端密钥
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
SESSION_SECRET=任意随机字符串
```

### 安装步骤

1. 克隆仓库或下载源码

2. 安装前端依赖
```bash
cd client
npm install
```

3. 安装后端依赖
```bash
cd server
npm install
```

### 运行应用

1. 启动后端服务
```bash
cd server
npm run dev
```

2. 启动前端开发服务器
```bash
cd client
npm start
```

3. 在浏览器中访问：http://localhost:3000

## 使用指南

1. 使用 GitHub 账号登录
2. 在首页查看已获批的内容
3. 登录后可点击"提交内容"来上传新内容
4. 管理员可点击"管理员"访问管理界面
5. 在管理界面审核待审核内容

## 部署到 GitHub

1. 在 GitHub 上创建新仓库

2. 初始化 Git 并添加远程仓库
```bash
git init
git add .
git commit -m "初始提交"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

## 设置管理员权限

首次使用系统时，你需要将自己的账户设置为管理员。登录系统后，可以通过以下方式设置：

1. 查找你的用户 ID：查看服务器数据目录下的 users.json 文件
2. 使用 API 请求将自己设置为管理员：
```bash
curl -X PUT http://localhost:5000/api/admin/users/你的用户ID/promote -H "Cookie: 你的会话cookie"
```

## 项目结构

```
├── client/                # 前端项目
│   ├── public/            # 静态资源
│   └── src/               # 源代码
│       ├── components/    # React 组件
│       ├── contexts/      # React 上下文
│       ├── App.js         # 主应用组件
│       └── index.js       # 入口文件
├── server/                # 后端项目
│   ├── config/            # 配置文件
│   ├── controllers/       # 控制器
│   ├── middleware/        # 中间件
│   ├── routes/            # 路由
│   ├── uploads/           # 上传的文件
│   ├── data/              # 数据存储
│   └── server.js          # 服务器入口文件
└── README.md              # 项目说明
``` 