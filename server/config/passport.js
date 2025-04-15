const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const fs = require('fs');
const path = require('path');

// 用户数据存储路径
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// 确保用户数据文件存在
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const users = getUsers();
  const user = users.find(user => user.id === id);
  done(null, user || null);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    try {
      const users = getUsers();
      
      // 检查用户是否已存在
      let user = users.find(user => user.githubId === profile.id);
      
      if (user) {
        // 更新用户信息
        user.username = profile.username;
        user.displayName = profile.displayName || profile.username;
        user.avatarUrl = profile._json.avatar_url;
        user.lastLogin = new Date().toISOString();
      } else {
        // 创建新用户
        user = {
          id: profile.id.toString(),
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || profile.username,
          avatarUrl: profile._json.avatar_url,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        users.push(user);
      }
      
      // 保存用户数据
      saveUsers(users);
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

module.exports = passport; 